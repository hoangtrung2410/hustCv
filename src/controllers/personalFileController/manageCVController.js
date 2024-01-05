const db = require('../../models')
const s3 = require('../../models/CV.js')
const { S3Client, DeleteObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3")
const personalFile = db.personalFile

const client = new S3Client({
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY
    },
    region: 'ap-southeast-2'
});
const bucketName = 'hustcv-1';

const deleteCv = async (req, res) => {
    const key = req.body.key;
    const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
    });
    
    try {
        const response = await client.send(command);
        res.send('oke')
        console.log('xoa hoan tat')
    } catch (err) {
        console.error(err);
        console.log('loi xoa')
    }
}

const deleteCv2 = async (data) => {
    const key = data;
    const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
    });

    try {
        const response = await client.send(command);
        console.log('xoa hoan tat')
    } catch (err) {
        console.error(err);
        console.log('loi xoa')
    }
}

const addCv = async (req, res) => {
    // const key = `${req.userId}.pdf`;
    const user = await personalFile.findOne({ where: { id: req.userId } });
    const id = req.userId;
    const key = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + req.file?.originalname;
    const fileContent = req.file.buffer;

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent
    };

    s3.upload(params, async (err, data) => {
        if (err) {
            console.error("Error uploading file:", err);
            res.status(404).json({ error: "loi upload" })
        }
        else {
            console.log("File uploaded successfully. ETag:", data.ETag);
            if (user.cv != '') {
                deleteCv2(user.cv)
            }
            try {
                await personalFile.update({ cv: data.Key }, { where: { id: id } })
            }
            catch (error) {
                console.log(error)
            }
            res.status(201).json(data)
        }
    });


}

const getUrlCv = async (req, res) => {
    try {
        const id = req.userId;
        const user = await personalFile.findOne({ where: { id: id } });
        const fileName = user.cv
        if (fileName != '') {
            const fileUrl = await s3.getSignedUrl('getObject', {
                Bucket: bucketName,
                Key: fileName,
                ResponseContentType: 'application/pdf',
                ResponseContentDisposition: 'inline'
            });
            res.status(201).json({ url: fileUrl });
        }
        else {
            res.status(404).json('lỗi tìm file')
        }
    }
    catch (err) {
        console.log(err);
        res.status(404).json('loi server')
    }
}

const getNameCv = async (req, res) => {
    try {
        const id = req.userId;
        const user = await personalFile.findOne({ where: { id: id } });
        if (user.cv == '') {
            res.status(201).json({ name: '' });
        }
        const fileName = user.cv.split('-')[2]
        res.status(201).json({ name: fileName });
    }
    catch (err) {
        // res.status(404).json('not found')
    }
}

module.exports = {
    addCv,
    getUrlCv,
    deleteCv,
    getNameCv,
}
const s3 = require('../../models/CV.js')

const deleteCv = (req, res) => {
    const bucketName = 'hustcv-1';
    const key = `${req.body.userId}.pdf`;
    // const key = 'baocao.pdf';
    const params = {
        Bucket: bucketName,
        Key: key,
    }
    s3.deleteObject(params, (error, data) => {
        if (error) {
            console.log('loi xoa', error);
            res.send('loi xoa');
        }
        else {
            console.log('xoa hoan tat');
            res.send('xoa hoan tat');
        }
    })
}

const addCv = (req, res) => {
    const bucketName = 'hustcv-1';
    const key = `${req.body.userId}.pdf`;
    const fileContent = req.body.Cv;

    s3.deleteObject({
        Bucket: bucketName,
        Key: key,
    }, (error, data) => {
        if (error) {
            console.log('loi xoa', error);
            res.send('loi xoa');
        }
        else {
            console.log('xoa hoan tat');
            res.send('xoa hoan tat');
        }
    })

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent
    };
    s3.upload(params, async (err, data) => {
        if (err) {
            console.error("Error uploading file:", err);
            res.send('loi upload');
        }
        else {
            console.log("File uploaded successfully. ETag:", data.ETag);
            res.send('upload hoan tat');
        }
    });
    
}

const getCv = async (req, res) => {
    const bucketName = 'hustcv-1';
    const fileName = `${req.body.userId}.pdf`;
    fileUrl = await s3.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: fileName,
    });
    res.redirect(fileUrl);
}

module.exports = {
    addCv,
    getCv,
}
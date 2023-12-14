const s3 = require('../models/CV.js')

const getLink = async (bucketName, fileName) => {
    return fileUrl = s3.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: fileName,
    });
}

const addCv = async (req, res) => {
    const bucketName = 'hustcv-1';
    const key = `${req.body.userId.Cv}.pdf`;
    const fileContent = req.body.Cv;


    const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent
    };
    s3.upload(params, (err, data) => {
        if (err) {
            console.error("Error uploading file:", err);
            res.send('loi');
        }
        else {
            console.log("File uploaded successfully. ETag:", data.ETag);
            res.send('oke');
        }
    });
}

const getCv = async (req, res) => {
    const url = await getLink('hustcv-1', 'onlinewebtutor.pdf')
    res.send(url);
}

module.exports = {
    addCv,
    getCv
}
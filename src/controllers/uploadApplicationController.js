const { RDS } = require('aws-sdk');
const db = require('../models')
const s3 = require('../models/CV')
const { S3Client, DeleteObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3")

const application = db.application;
const personalFile = db.personalFile;

const client = new S3Client({
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY
    },
    region: 'ap-southeast-2'
});
const bucketName = 'hustcv-1';

const uploadApplication = async (req, res) => {
    const userId = req.userId;
    const postId = req.body.postId;
    const key = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + req.file?.originalname;
    const fileContent = req.file.buffer;

    const infor = {
        CV: key,
        status: 'Đang chờ',
        user_id: userId,
        recruitmentPost_id: postId
    }
    console.log(infor);
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
            try{
                const old_application = await application.findOne({where: {user_id: userId, recruitmentPost_id: postId}});
                if (old_application) {
                    await application.update({CV: key}, {where: {user_id: userId}});
            }
                else {
                    await application.create(infor);
                }
                res.status(200).json('upload thanh cong')
            }
            catch(err) {
                res.status(404).json('loi tao moi db')
            }
        }
    });
}
const useAvailableCv = async (req, res) => {
    try{
        const user_id = req.userId;
        const postId = req.body.postId;
        const userFile = await personalFile.findOne({where: {id: user_id}});
        const old_application = application.findOne({where: {user_id: user_id, recruitmentPost_id: postId}});
        const available_cv = userFile.cv;
        if (available_cv != '') {
            if (old_application){
                await application.update({CV: available_cv}, {where: {user_id: user_id, recruitmentPost_id: postId}});
            }
            else {
                const infor = {
                    CV: available_cv,
                    status: 'Đang chờ',
                    user_id: user_id,
                    recruitmentPost_id: postId
                }
                await application.create(infor);
            }
            res.status(200).json('upload thanh cong');
        }
        else {
            res.status(404).json('not available CV');
        }
    }
    catch (err) {
        res.status(404).json('loi server');
    }
}

module.exports = {
    uploadApplication,
    useAvailableCv
}
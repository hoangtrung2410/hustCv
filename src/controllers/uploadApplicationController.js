const { RDS } = require('aws-sdk');
const db = require('../models')
const s3 = require('../models/CV')
const fs = require('fs');
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
    const postId = req.body.recruitmentPost_id;
    const content = req.body.content;
    const key = req.body.CV?.split('/')[2];
    const filePath = req.filePath;

    const infor = {
        CV: key,
        status: 'Đang chờ',
        user_id: userId,
        recruitmentPost_id: postId,
        content: content
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          return;
        }
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: data
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
    })
}
const useAvailableCv = async (req, res) => {
    // try{
    //     const user_id = req.userId;
    //     const postId = req.body.postId;
    //     console.log(postId)
    //     const userFile = await personalFile.findOne({where: {id: user_id}});
    //     const old_application = application.findOne({where: {user_id: user_id, recruitmentPost_id: postId}});
    //     const available_cv = userFile.cv;
    //     if (available_cv != '') {
    //         if (old_application){
    //             await application.update({CV: available_cv}, {where: {user_id: user_id, recruitmentPost_id: postId}});
    //         }
    //         else {
    //             const infor = {
    //                 CV: available_cv,
    //                 status: 'Đang chờ',
    //                 user_id: user_id,
    //                 recruitmentPost_id: postId
    //             }
    //             await application.create(infor);
    //         }
    //         res.status(200).json();
    //     }
    //     else {
    //         res.status(404).json('not available CV');
    //     }
    // }
    // catch (err) {
    //     res.status(404).json('loi server');
    // }
        try{
            const user_id = req.userId;
            const postId = req.body.recruitmentPost_id;
            const userFile = await personalFile.findOne({where: {id: user_id}});
            const available_cv = userFile.cv;
            if (available_cv != '') {
                const fakePath = 'src/public/' + available_cv
                res.status(200).json({ pdfPath: fakePath })
            }
            else {
                res.status(404).json('loi')
            }
        }
        catch(err) {
            res.status(404).json('loi server');
        }
}

module.exports = {
    uploadApplication,
    useAvailableCv
}
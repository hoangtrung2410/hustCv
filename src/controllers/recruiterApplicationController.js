const db = require('../models/index');
const jwt = require("../services/jwtServices")
const s3 = require("../models/CV");
const { mode } = require('crypto-js');
const { Model } = require('sequelize');
const getUserIdFromToken = (req) => {
    const token = jwt.jwtGetToken(req);
    if (!token){
        return null;
    }
    const payload = jwt.jwtVerify(token);
    if (!payload.userId){
        return null;
    }
    return payload;
}
const bucketName = "hustcv-1";
exports.getRecruiterPosts =  async (req, res) => {
    try{
        // get current recruiter's id
        const payload = getUserIdFromToken(req);
        if (!payload){
            res.status(401).json({
                message: "Log in first"
            })
        }
        const recruiterId = payload.userId
        // get all recruiter's posts
        const posts = await db.recruitmentPost.findAll({
            where: {
                user_Id: recruiterId,
            },
            include: [
                {
                    model: db.skill,
                    attributes: ["name"],
                    through: {
                        attributes: [],
                    }
                }
            ]
        })
        res.status(200).send(
            {
                data: posts,   
            }
        )
    }
    catch (e){
        console.log(e);
        return res.status(500).json({
            message: "Server error"
        })
    }
}
exports.getAcceptedApplications = async (req, res) => {
    try {
        // get user id
        const payload = getUserIdFromToken(req);
        if (!payload){
            return res.status(401).json({
                message: "Log in first",
            })
        }
        const recruiterId = payload.userId;
        // get post id
        const postId = req.params.postId;
        // check whether the current user own the post
        const post = await db.recruitmentPost.findOne({
            where: {
                id: postId,
                user_Id: recruiterId,
            }
        }
        )
        if (!post){
            return res.status(404).json(
                {
                    message: "The current user don't have this post"
                }
            )
        }
        // get all accepted applications 
        const acceptedApplications = await db.application.findAll({
            where: {
                status: "Đã chấp nhận",
                recruitmentPost_id: postId,
            },
            include: {model: db.user, attributes: ["username", "email", "phoneNumber"]}
        })
        return res.status(200).json({
            data: acceptedApplications
        })
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Server error"
        })
    }
}
exports.getPendingApplications = async (req, res) => {
    try {
        // get user id
        const payload = getUserIdFromToken(req);
        if (!payload){
            return res.status(401).json({
                message: "Log in first",
            })
        }
        const recruiterId = payload.userId;
        // get post id
        const postId = req.params.postId;
        // check whether the current user own the post
        const post = await db.recruitmentPost.findOne({
            where: {
                id: postId,
                user_Id: recruiterId,
            }
        }
        )
        if (!post){
            return res.status(403).json(
                {
                    message: "The current user don't have this post"
                }
            )
        }
        // get all accepted applications 
        const acceptedApplications = await db.application.findAll({
            where: {
                status: "Đang chờ",
                recruitmentPost_id: postId,
            },
            include: {model: db.user, attributes: ["username", "email", "phoneNumber"]}
        })
        return res.status(200).json({
            data: acceptedApplications
        })
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Server error"
        })
    }
}
exports.getDetailedApplication = async (req, res) => {
    try {
        // get user Id
        const payload = getUserIdFromToken(req)
        if (!payload){
            return res.status(401).json({
                message: "Log in first",
            })
        }
        const recruiterId = payload.userId
        // get application id
        const applicationId = req.params.applicationId
        // check whether the recruiter can view the application or not
        const application = await db.application.findOne({
            where: {
                id: applicationId,
                status: "Đang chờ"
            },
            include: [{model: db.user, attributes: ["username", "email", "phoneNumber"]}]
        })
        if (!application){
            return res.status(404).json({
                message: "Applcation not found"
            })
        }
        
        const post = await application.getRecruitmentPost();
        if (!post || post.user_id != recruiterId){
            return res.status(403).json({
                message: "The current user can't view this application"
            })
        }
        // get CV url
        const cvUrl = s3.getSignedUrl("getObject", {
            Bucket: bucketName,
            Key: application.CV,
            ResponseContentType: 'application/pdf',
            ResponseContentDisposition: 'inline',
        })
        application.CV = cvUrl;
        // get detailed application
        return res.status(200).json(
            {
                data: application
            }
        )
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Server error"
        })
    }
}
exports.putAcceptApplication = async (req, res) => {
    try{
            // get user Id
        const payload = getUserIdFromToken(req)
        if (!payload){
            return res.status(401).json({
                message: "Log in first",
            })
        }
        const recruiterId = payload.userId
        // get application id
        const applicationId = req.params.applicationId
        // check whether the recruiter can view the application or not
        const application = await db.application.findOne({
            where: {
                id: applicationId,
            }
        })
        if (!application){
            return res.status(404).json({
                message: "Applcation not found"
            })
        }
        const post = await application.getRecruitmentPost();
        if (!post || post.user_id !== recruiterId){
            return res.status(403).json({
                message: "The current user can't view this application"
            })
        }
        // accept application
        await db.application.update({status: "Đã chấp nhận"}, {
            where: {
                id: applicationId,
            }
        })
        return res.status(200).json({
            message: "OK"
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Server error"
        })
    }
}
exports.putDeclineApplication = async (req, res) => {
    try{
        // get user Id
        const payload = getUserIdFromToken(req)
        if (!payload){
            return res.status(403).json({
                message: "Log in first",
            })
        }
        const recruiterId = payload.userId
        // get application id
        const applicationId = req.params.applicationId
        // check whether the recruiter can view the application or not
        const application = await db.application.findOne({
            where: {
                id: applicationId,
            }
        })
        if (!application){
            return res.status(404).json({
                message: "Applcation not found"
            })
        }
        const post = await application.getRecruitmentPost();
        if (!post || post.user_id !== recruiterId){
            return res.status(403).json({
                message: "The current user can't view this application"
            })
        }
        // accept application
        await db.application.update({status: "Bị từ chối"}, {
            where: {
                id: applicationId,
            }
        })
        return res.status(200).json({
            message: "OK"
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Server error"
        })
    }
}
exports.getAcceptedDetailedApplication = async (req, res) => {
    try {
        // get user Id
        const payload = getUserIdFromToken(req)
        if (!payload){
            return res.status(401).json({
                message: "Log in first",
            })
        }
        const recruiterId = payload.userId
        // get application id
        const applicationId = req.params.applicationId
        // check whether the recruiter can view the application or not
        const application = await db.application.findOne({
            where: {
                id: applicationId,
                status: "Đã chấp nhận"
            },
            include: [{model: db.user, attributes: ["username", "email", "phoneNumber"]}]
        })
        if (!application){
            return res.status(404).json({
                message: "Applcation not found"
            })
        }
        
        const post = await application.getRecruitmentPost();
        if (!post || post.user_id != recruiterId){
            return res.status(403).json({
                message: "The current user can't view this application"
            })
        }
        // get CV url
        const cvUrl = s3.getSignedUrl("getObject", {
            Bucket: bucketName,
            Key: application.CV,
            ResponseContentType: 'application/pdf',
            ResponseContentDisposition: 'inline',
        })
        application.CV = cvUrl;
        // get detailed application
        return res.status(200).json(
            {
                data: application
            }
        )
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Server error"
        })
    }
}

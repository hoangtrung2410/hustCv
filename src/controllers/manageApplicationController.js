const db = require('../models');
const jwt = require("../services/jwtServices");
const Application = db.application;
const RecruitmentPost = db.recruitmentPost

const getUserIdFromToken = (req) => {
    const token = jwt.jwtGetToken(req);
    if (!token) {
        return null;
    }
    const payload = jwt.jwtVerify(token);
    if (!payload.userId) {
        return null;
    }
    return payload.userId;
};

const deleteApplication = async (req, res) => {
    try {
        const id = req.params.applicationId;
        console.log("id = ",id)
        const application = await Application.findByPk(id);
        if (!application) {
            return res.status(404).json("Application does not exist!");
        }
        await application.destroy();
        return res.status(200).json("Application deleted successfully!");
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
const getAllApplications = async (req, res) => {
    try {
        // get user id
        const payload = getUserIdFromToken(req);
        if (!payload){
            return res.status(401).json({
                message: "Log in first",
            })
        }
        const AllApplications = await Application.findAll({
            include: {model: db.user, attributes: ["username", "email", "phoneNumber"]}
        })
        return res.status(200).json({
            data: AllApplications
        })
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Server error"
        })
    }
}
const getApplicationDetails = async (req, res) => {
    try {
        const id = req.params.applicationId;
        console.log("3435t4t = ",id)

        const application = await Application.findByPk(id)
        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }
        let recruitmentPostId = application.recruitmentPost_id;
        console.log("recruitmentPostId = ",recruitmentPostId)
        const recruitmentPost = await RecruitmentPost.findByPk(recruitmentPostId);
        res.status(200).json({
            application,
            recruitmentPost
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
const updateStatusApplication = async (req, res) => {
    try {
        const id = req.params.applicationId;
        const status = "Rút đơn"
        const [updatedRows] = await Application.update({status: status}, {where: {id: id}});
        if (updatedRows === 0) {
            return res.status(404).json({error: "Application not found"});
        }
        const updatedApplication = await Application.findByPk(id);
        return res.status(200).json(updatedApplication);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = {
    deleteApplication,
    getAllApplications,
    getApplicationDetails,
    updateStatusApplication
};

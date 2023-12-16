const db = require('../../models');

const personalFile = db.personalFile;
const study = db.study;
const project = db.project;
const experience = db.experience;
const certificate = db.certificate;

const addEducation = async (req, res) => {
    try {
        const info = {
            name: req.body.name,
            personalFileId: req.body.personalFileId
        };
        await study.create(info);
    }
catch(error){
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const addProject = async (req, res) => {
    try {
        const info = {
            name: req.body.name,
            personalFileId: req.body.personalFileId
        };
        await project.create(info);
    }
catch(error){
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const addCertificate = async (req, res) => {
    try {
        const info = {
            name: req.body.name,
            personalFileId: req.body.personalFileId
        };
        await certificate.create(info);
    }
catch(error){
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const addExperience = async (req, res) => {
    try {
        const info = {
            name: req.body.name,
            personalFileId: req.body.personalFileId
        };
        await experience.create(info);
    }
catch(error){
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateEducation = async (req, res) => {
    try {
        const id = req.body.id;
        await study.update(req.body, {where:{id:id}});
    } catch(error){
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateProject = async (req, res) => {
    try {
        const id = req.body.id;
        await project.update(req.body, {where:{id:id}});
    } catch(error){
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateCertificate = async (req, res) => {
    try {
        const id = req.body.id;
        await certificate.update(req.body, {where:{id:id}});
    } catch(error){
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateExperience = async (req, res) => {
    try {
        const id = req.body.id;
        await experience.update(req.body, {where:{id:id}});
    } catch(error){
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteEducation = async (req, res) => {
    try {
        const id = req.body.id;
        await study.destroy(req.body, {where:{id:id}});
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error"});
    }
};

const deleteProject = async (req, res) => {
    try {
        const id = req.body.id;
        await project.destroy(req.body, {where:{id:id}});
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error"});
    }
};

const deleteCertificate = async (req, res) => {
    try {
        const id = req.body.id;
        await certificate.destroy(req.body, {where:{id:id}});
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error"});
    }
};

const deleteExperience = async (req, res) => {
    try {
        const id = req.body.id;
        await experience.destroy(req.body, {where:{id:id}});
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error"});
    }
};

const getAllEducation = async (req,res)=>{
    try{
        let personalFileId = req.body.personalFileId
        let allEducation = await study.findAll({where:{personalFileId: personalFileId}});
        res.status(200).json(allEducation);
    }
    catch (error){
        console.log(error)
        res.status(500).json({error :"Internal Server Error"})
    }
};
const getAllProject = async (req,res)=>{
    try{
        let personalFileId = req.body.personalFileId
        let allProject = await project.findAll({where:{personalFileId: personalFileId}});
        res.status(200).json(allProject);
    }
    catch (error){
        console.log(error)
        res.status(500).json({error :"Internal Server Error"})
    }
};
const getAllCertificate = async (req,res)=>{
    try{
        let personalFileId = req.body.personalFileId
        let allCertificate = await certificate.findAll({where:{personalFileId: personalFileId}});
        res.status(200).json(allCertificate);
    }
    catch (error){
        console.log(error)
        res.status(500).json({error :"Internal Server Error"})
    }
};
const getAllExperience = async (req,res)=>{
    try{
        let personalFileId = req.body.personalFileId
        let allExperience = await experience.findAll({where:{personalFileId: personalFileId}});
        res.status(200).json(allExperience);
    }
    catch (error){
        console.log(error)
        res.status(500).json({error :"Internal Server Error"})
    }
};

const getOneEducation = async (req,res) => {
    try{
        let id = req.body.id
        const getOneEducation = await study.findOne({where:{id:id}})
        if(!getOneEducation){
            res.status(404).json({error:"detail not found"})
            return;
        }
        res.status(200).json(getOneEducation)
    }
    catch (error){
        console.log(error)
        res.status(500).json({error :"Internal Server Error"})
    }
}
const getOneProject = async (req,res) => {
    try{
        let id = req.body.id
        const getOneProject = await project.findOne({where:{id:id}})
        if(!getOneProject){
            res.status(404).json({error:"detail not found"})
            return;
        }
        res.status(200).json(getOneProject)
    }
    catch (error){
        console.log(error)
        res.status(500).json({error :"Internal Server Error"})
    }
}
const getOneExperience = async (req,res) => {
    try{
        let id = req.body.id
        const getOneExperience = await experience.findOne({where:{id:id}})
        if(!getOneExperience){
            res.status(404).json({error:"detail not found"})
            return;
        }
        res.status(200).json(getOneExperience)
    }
    catch (error){
        console.log(error)
        res.status(500).json({error :"Internal Server Error"})
    }
}
const getOneCertificate = async (req,res) => {
    try{
        let id = req.body.id
        const getOneCertificate = await certificate.findOne({where:{id:id}})
        if(!getOneCertificate){
            res.status(404).json({error:"detail not found"})
            return;
        }
        res.status(200).json(getOneCertificate)
    }
    catch (error){
        console.log(error)
        res.status(500).json({error :"Internal Server Error"})
    }
}


module.exports = {
    addEducation,
    addCertificate,
    addExperience,
    addProject,

    updateEducation,
    updateCertificate,
    updateExperience,
    updateProject,

    deleteEducation,
    deleteCertificate,
    deleteExperience,
    deleteProject,

    getAllEducation,
    getAllCertificate,
    getAllExperience,
    getAllProject,

    getOneEducation,
    getOneCertificate,
    getOneExperience,
    getOneProject,
}
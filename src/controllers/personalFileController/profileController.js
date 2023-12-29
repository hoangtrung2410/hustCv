const db = require('../../models');

const skill = db.skill
const personalFile = db.personalFile;
const study = db.study;
const project = db.project;
const experience = db.experience;
const certificate = db.certificate;
const skill_profile = db.skill_profile

const addEducation = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ error: "Bad request: Missing request body" });
        }
        const info = {
            name: req.body.name,
            personalFileId: req.body.personalFileId
        };
        const newEducation = await study.create(info);
        return res.status(201).json(newEducation);
    }
catch(error){
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const addProject = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ error: "Bad request: Missing request body" });
        }
        const info = {
            name: req.body.name,
            personalFileId: req.body.personalFileId
        };
        const newProject = await project.create(info);
        return res.status(201).json(newProject);
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

const addSkill = async (req, res) => {
    try {
        if(!req.body) {
            return res.status(400).json({ error: "Bad request: Missing request body" });
        }
        const user = await personalFile.findOne({where: {id: req.body.id}})
        const skills = await user.getSkills();
        await user.removeSkills(skills);
        // const skillProfile = await req.body.skill?.map(async (item) => {
        //     await user.addSkill(item)
        // })
        await Promise.all(req.body.skill?.map(async (item) => {
            await user.addSkill(item);
        }));
        return res.status(201).json(user)
    }
    catch (error) {

    }
}

const updateEducation = async (req, res) => {
    try {
        const id = req.params.id;
        const educationInfo = await study.findOne({where: { id: id }})
        if (!educationInfo){
            return res.status(404).json({ error: "not found eduId"})
        }
        await study.update(req.body, {where:{id:id}});
        return res.status(201).json('update complete');
    } catch(error){
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateProject = async (req, res) => {
    try {
        const id = req.params.id;
        const projectInfo = await project.findOne({where: {id: id}})
        if (!projectInfo){
            return res.status(404).json({error: "not found"})
        }
        await project.update(req.body, {where:{id:id}});
        return res.status(201).json('update complete')
    } catch(error){
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateCertificate = async (req, res) => {
    try {
        const id = req.params.id;
        await certificate.update(req.body, {where:{id:id}});
    } catch(error){
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateExperience = async (req, res) => {
    try {
        const id = req.params.id;
        await experience.update(req.body, {where:{id:id}});
    } catch(error){
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateUserInfor = async (req, res) => {
    try {
        const id = req.params.id;
        let profile = await personalFile.findOne({where: {id:id}});
        if (!profile){
            return res.statur(500).json('loi')
        }
        await personalFile.update({profile: req.body.infor}, {where: {id: id}})
        return res.status(201).json('update complete')
    } catch(error){

    }
}

const deleteEducation = async (req, res) => {
    try {
        const id = req.params.id;
        let educationInfo = await study.findOne({ where: { id: id }})
        if (!educationInfo){
            return res.status(404).json({ error: "not found education info"})
        }
        await study.destroy({where:{id:id}});
        return res.status(200).json("deleted education")
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error"});
    }
};

const deleteProject = async (req, res) => {
    try {
        const id = req.params.id;
        let projectInfo = await project.findOne({ where:{id: id}})
        if (!projectInfo){
            return res.status(404).json({ error: "not found"})
        }
        await project.destroy({where:{id:id}});
        return res.status(200).json("delete successfull")
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
        // let personalFileId = 1
        let allEducation = await study.findAll({where:{personalFileId: personalFileId}});
        return res.status(200).json(allEducation);
    }
    catch (error){
        console.log(error)
        return res.status(500).json({error :"Internal Server Error"})
    }
};
const getAllProject = async (req,res)=>{
    try{
        let personalFileId = req.body.personalFileId
        let allProject = await project.findAll({where:{personalFileId: personalFileId}});
        return res.status(200).json(allProject);
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
        return res.status(200).json(allCertificate);
    }
    catch (error){
        console.log(error)
        return res.status(500).json({error :"Internal Server Error"})
    }
};
const getAllExperience = async (req,res)=>{
    try{
        let personalFileId = req.body.personalFileId
        let allExperience = await experience.findAll({where:{personalFileId: personalFileId}});
        return res.status(200).json(allExperience);
    }
    catch (error){
        console.log(error)
        return res.status(500).json({error :"Internal Server Error"})
    }
};

const getSkill = async (req, res) => {
    try {
        let skillUser = await personalFile.findByPk(req.body.id,{
            include: [{
                model: skill,
                through: { attributes: [] },
                attributes: ['id', 'name'],
            }]
        })
        res.status(200).json(skillUser)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

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
        let id = req.params.id
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
const getUserInfor = async (req, res) => {
    try{
        let id = req.body.id;
        const getInfor = await personalFile.findOne({where: {id: id}});
        if (!getInfor){
             return res.status(404).json({error: "detail not found"})   
        }
        res.status(200).json(getInfor)
    }catch (error){
        res.status(500).json({error :"Internal Server Error"})
    }
}



module.exports = {
    addEducation,
    addCertificate,
    addExperience,
    addProject,
    addSkill,

    updateEducation,
    updateCertificate,
    updateExperience,
    updateProject,
    updateUserInfor,

    deleteEducation,
    deleteCertificate,
    deleteExperience,
    deleteProject,

    getAllEducation,
    getAllCertificate,
    getAllExperience,
    getAllProject,
    getSkill,
    
    getOneEducation,
    getOneCertificate,
    getOneExperience,
    getOneProject,
    getUserInfor,
}
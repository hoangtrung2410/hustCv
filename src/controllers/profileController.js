const db = require('../models');
const personalFile = db.personalFile;
const study = db.study;

const addEducation = async (req, res) => {
    try {
        const info = {
            name: req.body.name,
            personalFileId: req.body.personalFileId
        };
        await study.create(info);
    }
    catch(error) {

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

const deleteEducation = async (req, res) => {
    try {
        const id = req.body.id;
        await study.update(req.body, {where:{id:id}});
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

const getOneEducation = async (req,res) => {
    try{
        let id = req.body.id
        const education = await study.findOne({where:{id:id}})
        if(!education){
            res.status(404).json({error:"detail not found"})
            return;
        }
        res.status(200).json(education)
    }
    catch (error){
        console.log(error)
        res.status(500).json({error :"Internal Server Error"})

    }
}
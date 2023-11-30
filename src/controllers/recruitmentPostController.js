const db = require('../models')
// create main Model
const RecruitmentPost = db.recruitmentPost

const addRecruitmentPost = async(req,res ) =>{
    try{
        if(!res.body){
            res.status(400).send("Bad request: Missing request body")
        }
        let info = {
            title: req.body.title,
            describe: req.body.describe,
            request: req.body.request,
            form: req.body.form,
            salary:req.body.salary,
            dateCreate: req.body.dateCreate,

        }
        console.log(info)
        const recruitmentPost = await RecruitmentPost.create(info)
        res.status(201).send(recruitmentPost)
    }catch(error){
        console.log(error)
        res.status(500).send("Internal Server Error")

    }
}
const updateRecruitmentPost = async (req,res)=>{
    try{
        let id = req.params.id
        const [recruitmentPost]  = await RecruitmentPost.update(req.body,{where: {id:id}})
        if(recruitmentPost===0){
            res.status(404).send("RecruitmentPost not found")
            return
        }
        res.status(200).send(recruitmentPost)

    }catch(error){
        console.log(error)
        res.status(500).send("Internal Server Error")

    }
}
const getAllRecruitmentPost = async (req,res)=>{
    try{
        let recruitmentPosts = await RecruitmentPost.findAll({})
        res.status(200).send(recruitmentPosts)
    }
    catch (error){
        console.log(error)
        res.status(500).send("Internal Server error")
    }
}
// get one user
const getOneRecruitmentPost = async(req,res)=>{
    try{
        let id = req.params.id
        const recruitmentPost = await RecruitmentPost.findOne({where:{id:id}})
        if(!recruitmentPost){
            res.status(404).send("User not found")
            return;
        }
        res.status(200).send(recruitmentPost)

    }
    catch (error){
        console.log(error)
        res.status(500).send("Internal Server error")

    }
}
const deleteRecruitmentPost = async (req,res)=>{
    try{
        let id = req.params.id
        await RecruitmentPost.destroy({where:{id:id}})
        res.status(200).send("RecruitmentPost deleted")
    }
    catch (error){
        console.log(error)
        res.status(500).send("Internal Server error")
    }
}
// update user
module.exports={
    addRecruitmentPost,
    updateRecruitmentPost,
    getAllRecruitmentPost,
    getOneRecruitmentPost,
    deleteRecruitmentPost

}


const db = require('../models')
// create main Model
const Business = db.business

const addBusiness = async(req,res ) =>{
    try{
        if(!res.body){
            res.status(400).send("Bad request: Missing request body")
        }

        let info = {
            name: req.body.name,
            address: req.body.address,
            website: req.body.website
        }

        console.log(info)
        const business = await Business.create(info)
        res.status(201).send(business)
    }catch(error){
        console.log(error)
        res.status(500).send("Internal Server Error")

    }
}

const updateBusiness = async (req,res)=>{
    try{
        let id = req.params.id
        const [business]  = await Business.update(req.body,{where: {id:id}})
        if(business===0){
            res.status(404).send("RecruitmentPost not found")
            return
        }
        res.status(200).send(business)

    }catch(error){
        console.log(error)
        res.status(500).send("Internal Server Error")

    }
}

const getAllBusiness = async (req,res)=>{
    try{
        let business = await Business.findAll({})
        res.status(200).send(business)
    }
    catch (error){
        console.log(error)
        res.status(500).send("Internal Server error")
    }
}

// get one business
const getOneBusiness = async(req,res)=>{
    try{
        let id = req.params.id
        const business = await Business.findOne({where:{id:id}})
        if(!business){
            res.status(404).send("User not found")
            return;
        }
        res.status(200).send(business)

    }
    catch (error){
        console.log(error)
        res.status(500).send("Internal Server error")

    }
}


const deleteBusiness = async (req,res)=>{
    try{
        let id = req.params.id
        await Business.destroy({where:{id:id}})
        res.status(200).send("RecruitmentPost deleted")
    }
    catch (error){
        console.log(error)
        res.status(500).send("Internal Server error")
    }
}
// update user
module.exports={
    addBusiness,
    updateBusiness,
    getAllBusiness,
    getOneBusiness,
    deleteBusiness 
}


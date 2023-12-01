const db = require('../models')
// create main Model
const Business = db.business

const addBusiness = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: "Bad request: Missing request body" });
        }

        const info = {
            name: req.body.name,
            address: req.body.address,
            website: req.body.website,
        };
        console.log(info);
        const business = await Business.create(info);
        return res.status(201).json(business);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const updateBusiness = async (req, res) => {
    try {
        const id = req.params.id;
        const [updatedRows] = await Business.update(req.body, { where: { id: id } });

        if (updatedRows === 0) {
            return res.status(404).json({ error: "Business not found" });
        }
        const updatedBusiness = await Business.findByPk(id);
        return res.status(200).json(updatedBusiness);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAllBusiness = async (req,res)=>{
    try{
        let business = await Business.findAll({})
        res.status(200).json(business)
    }
    catch (error){
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
    }
}

// get one business
const getOneBusiness = async(req,res)=>{
    try{
        let id = req.params.id
        const business = await Business.findOne({where:{id:id}})
        if(!business){
            res.status(404).send("Business  not found")
            return;
        }
        res.status(200).json(business)

    }
    catch (error){
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
    }
}
const deleteBusiness = async (req,res)=>{
    try{
        let id = req.params.id
        await Business.destroy({where:{id:id}})
        res.status(200).json("Business  deleted")
    }
    catch (error){
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
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


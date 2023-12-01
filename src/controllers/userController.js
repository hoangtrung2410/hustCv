const db = require('../models')

const User = db.user

const addUser = async (req, res) =>{
    try{
        if(!req.body){
            return res.status(404).json({error:"Bad request: Missing request body"})
        }
        const inf = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        }
    } catch(error){
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});
    }
};

const updateUser = async(req, res) => {
    try{
        const id = req.params.id;
        const [updatedRows] = await User.updateUser(req.body, {where:{id:id}});

        if (updatedRows === 0){
            return res.status(404).json({ error: "RecruitmentPost not found" });
        }

        const  updateUser = await User.findByPk(id);
        return res.status(200).json(updateUser);
    } catch(error){
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAllUser = async (req,res)=>{
    try{
        let user = await User.findAll({})
        res.status(200).json(user)
    }
    catch (error){
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
    }
}
module.exports ={
    addUser,
    updateUser,
    getAllUser
}
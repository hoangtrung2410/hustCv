const db = require('../models')
const { Op } = require('sequelize');
const User = db.user

const signUp = async (req, res) =>{
    try{
        if(!req.body){
            return res.status(404).json({error:"Bad request: Missing request body"})
        }
        const info = {
            username: req.body.username,
            email:req.body.email,
            password: req.body.password,
            phoneNumber:req.body.phoneNumber,
            birthDay:req.body.birthDay,
        }
        const checkUser = await User.findOne({
            where: {
                [Op.or]: [
                    { username: info.username },
                    { email: info.email },
                ],
            },
        });
        if(checkUser){
            console.log("user find :",checkUser)
            return res.status(403).json({error:"User is exist"})
        }
        // console.log(info);
        const user = await User.create(info);
        return res.status(201).json(user);
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
    signUp,
    updateUser,
    getAllUser
}
const db = require('../models')
const { Op } = require('sequelize');
const Yup = require("yup");
const {BadRequestError} = require("../utils/apiError");
const bcrypt = require("bcrypt");
const User = db.user
const Business = db.business


const signUp = async (req, res) => {
    try {
        const { username, email, password, phoneNumber, birthDay } = req.body;

        const schema = Yup.object().shape({
            username: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            phoneNumber: Yup.string().required(),
            birthDay: Yup.date().required(),
        });



        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Invalid request body" });
        }
        const checkUser = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: email },
                ],
            },
        });
        if (checkUser) {
            return res.status(403).json({ error: "Username or email already exists" });
        }
        const user = await User.create(req.body);
        return res.status(201).json({ user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateUser = async(req, res) => {
    try{
        const id = req.params.id;
        const [updatedRows] = await User.update(req.body, {where:{id:id}});
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
    getAllUser,
}
const db = require('../models');
const {Op} = require('sequelize');
const Yup = require('yup');
const bcrypt = require('bcrypt');
const {BadRequestError} = require('../utils/apiError');
const User = db.user;
const personalFile = db.personalFile;

const signUp = async (req, res) => {
    try {
        const schema = Yup.object().shape({
            username: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(8),
            phoneNumber: Yup.string().required().matches(/^\d{10}$/),
            birthDay: Yup.string().required(),
            role_id: Yup.number().required(),
            business_id: Yup.number().nullable(),
        });

        try {
            await schema.validate(req.body);
        } catch (e) {
            return res.status(400).json({error: 'Invalid input', message: e.message});
        }
        let {username, email, password, phoneNumber, birthDay, role_id, business_id} = req.body;
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    {email: email},
                ],
            },
        });

        if (existingUser) {
            console.log("existingUser", existingUser.id);
            return res.status(401).json({
                  status: false,
              }
            );
        }
        console.log("role_id", role_id)
        const user = await User.create({
            username,
            email,
            password,
            phoneNumber,
            birthDay,
            role_id,
            business_id,
        });
        const profile = username + '*/' + email + '*/' + birthDay.split(' ')[0] + 'T' + '*/' + phoneNumber;
        await personalFile.create({
            id : user.id,
            profile: profile,
            cv: '',
            user_id: user.id
        })
        return res.status(201).json({user});
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
};


const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const [updatedRows] = await User.update(req.body, {where: {id: id}});
        if (updatedRows === 0) {
            return res.status(404).json({error: 'User not found'});
        }

        const updatedUser = await User.findByPk(id);
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
};

const getAllUser = async (req, res) => {
    try {
        const users = await User.findAll({});
        res.status(200).json({
            statuscode: 200,
            message: "0K",
            users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};


// moi nguoi lay user theo id tuong tu
const getUserById = async (req, res) => {
    try {
        const id = req.userId;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
}
module.exports = {
    signUp,
    updateUser,
    getAllUser,
    getUserById
};

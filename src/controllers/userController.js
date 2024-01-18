const db = require('../models');
const { Op } = require('sequelize');
const Yup = require('yup');
const bcrypt = require('bcrypt');
const { BadRequestError } = require('../utils/apiError');
const User = db.user;
const personalFile = db.personalFile;

const signUp = async (req, res) => {
    try {
        const schema = Yup.object().shape({
            username: Yup.string().required(),
            email: Yup.string().email().required(),
            // mật khẩu phải có ít nhất 8 ký tự, có chữ Hoa và chữ thường, số, có ký tự đặc biệt
            password: Yup.string().required().matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                "Mật khẩu phải có ít nhất 8 ký tự, có chữ Hoa và chữ thường, số , có ký tự đặc biệt"
            ),
            //phoneNumber phải có 10 số
            phoneNumber: Yup.string().required().matches(
                /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                "Số điện thoại không hợp lệ"
            ),
            birthDay: Yup.string().required(),
            role_id: Yup.number().required(),
            business_id: Yup.number().nullable(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                statusCode: 400,
                message: "Bad Request",
                error: "Invalid data"
            });
        }
        let { username, email, password, phoneNumber, birthDay, role_id, business_id } = req.body;
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                ],
            },
        });
        if (existingUser) {
            return res.status(401).json({
                status: 401,
                message: "Email already exists",
            }
            );
        }
        const user = await User.create({
            username,
            email,
            password,
            phoneNumber,
            birthDay,
            role_id,
            business_id,
        });
        const profile = username + '*/' + email + '*/' + birthDay + '*/' + phoneNumber;
        await personalFile.create({
            id: user.id,
            profile: profile,
            cv: '',
            user_id: user.id
        })
        return res.status(201).json({ user });
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
};

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const [updatedRows] = await User.update(req.body, { where: { id: id } });
        if (updatedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedUser = await User.findByPk(id);
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// moi nguoi lay user theo id tuong tu
const getUserById = async (req, res) => {
    try {
        const id = req.userId;
        const user1 = await User.findByPk(id);
        if (!user1) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user1.status === false) {
            return res.status(403).json({
                statusCode: 403,
                message: "Tài khoản đã bị khóa",
            });
        }
        const { password: hashedPassword, ...user } = user1.get();
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = {
    signUp,
    updateUser,
    getAllUser,
    getUserById
};

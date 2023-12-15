const db = require('../models')
const {Op} = require('sequelize');
const Yup = require("yup");
const {BadRequestError} = require("../utils/apiError");
const bcrypt = require("bcrypt");
const Role = db.role;

const addRole = async (req, res) => {
    try {
        const {name} = req.body;
        const schema = Yup.object().shape({
            name: Yup.string().required(),
        });
        console.log(req.body)
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({error: "Invalid request body"});
        }
        const role = await Role.create(req.body);
        return res.status(201).json({role});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

const getAllRole = async (req, res) => {
    try {
        let roles = await Role.findAll({})
        res.status(200).json(roles)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal Server Error"})
    }

}
const updateRole = async (req, res) => {
    try {
        const id = req.params.id;
        const [updatedRows] = await Role.update(req.body, {where: {id: id}});
        if (updatedRows === 0) {
            return res.status(404).json({error: "Role not found"});
        }

        const updateRole = await Role.findByPk(id);
        return res.status(200).json(updateRole);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"});
    }

}

module.exports = {
    addRole,
    getAllRole,
    updateRole
}
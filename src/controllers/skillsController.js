const db = require('../models')

const skill = db.skill

const getAllSkills = async (req, res) => {
    try {
        const skills = await skill.findAll({})
        if (!skills) {
            res.status(400).json('Skill not found')
        }
        return res.status(200).json(skills)
    } catch (error) {
        res.status(500).json('Interal Server Error')
    }
}

module.exports = {
    getAllSkills
}
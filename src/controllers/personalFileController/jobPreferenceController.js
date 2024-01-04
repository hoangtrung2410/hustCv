const db = require('../../models');

const criterionJob = db.criterionJob
const Skill = db.skill

const addCriterionJob = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: "Bad request: Missing request body" });
        }
        const infor = {
            user_id: req.userId,
            salary: req.body.salary,
            jobLevel: req.body.jobLevel,
            address: req.body.address,
        };
        const userCriterion = await criterionJob.findOne({where: {user_id: req.userId}});
        if (userCriterion){
            await criterionJob.destroy({where: {user_id: req.userId}});
        }
        const newCriterionJob = await criterionJob.create(infor);
        await Promise.all(req.body.skill?.map(async (item) => {
            await newCriterionJob.addSkill(item);
        }));
        return res.status(201).json(newCriterionJob)
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const updateCriterionJob = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: "Bad request: Missing request body" });
        }
        const criterion = await criterionJob.findOne({where: {user_id: req.userId}})
        const infor = {
            salary: req.body.salary,
            jobLevel: req.body.jobLevel,
            address: req.body.address,
        };
        criterionJob.update(infor, {where: {user_id: req.userId}});
        criterion.setSkills(req.body.skill)
    }
    catch(err) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }    
}

const getCriterionJob = async (req, res) => {
    try {
        let criterion = await criterionJob.findOne({where: {user_id: req.userId}})
        if (!criterion) {
            criterion = await criterionJob.create({user_id: req.userId});
        }
        let job = await criterionJob.findByPk(criterion.id, {
            include: [{
                model: Skill,
                through: { attributes: [] },
                attributes: ['id', 'name'],
            }]
        })
        res.status(200).json(job)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = {
    addCriterionJob,
    updateCriterionJob,
    getCriterionJob,
}
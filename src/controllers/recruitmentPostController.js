const db = require('../models')
// create main Model
const RecruitmentPost = db.recruitmentPost
const Skill = db.skill
const User = db.user

const addRecruitmentPost = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: "Bad request: Missing request body" });
        }
        const user = await User.findOne({ where: { id: req.userId } })
        const info = {
            title: req.body.title,
            describe: req.body.describe,
            request: req.body.request,
            form: req.body.form,
            salary: req.body.salary,
            dateClose: req.body.dateClose,
            location: req.body.location,
            level: req.body.level
        };
        const recruitmentPost = await RecruitmentPost.create(info);
        await req.body.skill?.map(async (item) => {
            await recruitmentPost.addSkill(item)
        })

        await user.addRecruitmentPost(recruitmentPost)

        return res.status(201).json(recruitmentPost);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateRecruitmentPost = async (req, res) => {
    try {
        const id = req.params.id;
        const [updatedRows] = await RecruitmentPost.update(req.body, { where: { id: id } });

        if (updatedRows === 0) {
            return res.status(404).json({ error: "RecruitmentPost not found" });
        }
        const updatedRecruitmentPost = await RecruitmentPost.findByPk(id);
        return res.status(200).json(updatedRecruitmentPost);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAllRecruitmentPost = async (req, res) => {
    try {
        const user = req.user
        let recruitmentPosts = await RecruitmentPost.findAll({
            where: { user_id: req.userId },
            order: [['createdAt', 'DESC']],
            include: [{
                model: Skill,
                through: { attributes: [] },
                attributes: ['id', 'name'],
            }, {
                model: User,
                attributes: ['username'],
            }],
        })
        const count = await RecruitmentPost.count({ where: { user_id: req.userId } })
        res.status(200).json({
            count: count,
            data: recruitmentPosts
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
// get one user
const getOneRecruitmentPost = async (req, res) => {
    try {
        let id = req.params.id
        const recruitmentPost = await RecruitmentPost.findOne({ where: { id: id } })
        if (!recruitmentPost) {
            res.status(404).json({ error: "RecruitmentPost not found" })
            return;
        }
        res.status(200).json(recruitmentPost)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })

    }
}
const deleteRecruitmentPost = async (req, res) => {
    try {
        let id = req.params.id
        const post = await RecruitmentPost.findOne({ where: { id: id } })
        console.log('>>> check post: ', post)
        if (!post) {
            return res.status(404).json("RecruitmentPost does not exit!")
        }
        const response = await RecruitmentPost.destroy({ where: { id: id } })
        res.status(200).json("RecruitmentPost deleted")
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
// update user
module.exports = {
    addRecruitmentPost,
    updateRecruitmentPost,
    getAllRecruitmentPost,
    getOneRecruitmentPost,
    deleteRecruitmentPost

}


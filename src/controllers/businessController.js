const db = require('../models')
const Yup = require("yup");
const {Op} = require("sequelize");
const Business = db.business

const addBusiness = async (req, res) => {
    try {
        const {businessName, businessAddress, businessWebsite} = req.body;
        const existingBusiness = await Business.findOne({
            where: {
                [Op.or]: [
                    {businessName: businessName},
                    {businessWebsite: businessWebsite},
                ],
            },
        });
        if (existingBusiness) {
            return res.status(201).json(existingBusiness);
        }
        const schema = Yup.object().shape({
            businessName: Yup.string().required(),
            businessAddress: Yup.string().required(),
            businessWebsite: Yup.string().required(),

        });
        console.log(req.body)
        const business = await Business.create(req.body);
        console.log("business_id", business.id)
        return res.status(201).json(business);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
};


const updateBusiness = async (req, res) => {
    try {
        const id = req.params.id;
        const [updatedRows] = await Business.update(req.body, {where: {id: id}});

        if (updatedRows === 0) {
            return res.status(404).json({error: "Business not found"});
        }
        const updatedBusiness = await Business.findByPk(id);
        return res.status(200).json(updatedBusiness);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
};

const getAllBusiness = async (req, res) => {
    try {
        let business = await Business.findAll({})
        res.status(200).json(business)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal Server Error"})
    }
}

// get one business
const getOneBusiness = async (req, res) => {
    try {
        let id = req.params.id
        const business = await Business.findOne({where: {id: id}})
        if (!business) {
            res.status(404).send("Business  not found")
            return;
        }
        res.status(200).json(business)

    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal Server Error"})
    }
}
const deleteBusiness = async (req, res) => {
    try {
        let id = req.params.id
        await Business.destroy({where: {id: id}})
        res.status(200).json("Business  deleted")
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal Server Error"})
    }
}
// update user
module.exports = {
    addBusiness,
    updateBusiness,
    getAllBusiness,
    getOneBusiness,
    deleteBusiness
}


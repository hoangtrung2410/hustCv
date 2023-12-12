const dbConfig = require('../config/dbConfig.js')
const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: true,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }

    }
)
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')

    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize
db.sequelize.sync({force: true})
    .then(() => {
        console.log('yes re-sync done!')
    })

// Define models
db.role = require('./role.js')(sequelize, DataTypes) // Role model
db.business = require('./business.js')(sequelize, DataTypes) // Business model
db.user = require('./user.js')(sequelize, DataTypes) // User model
db.personalFile = require('./personalFile.js')(sequelize, DataTypes) // PersonalFile model
db.criterionJob = require('./criterionJob.js')(sequelize, DataTypes) // CriterionJob model
db.recruitmentPost = require('./recruitmentPost.js')(sequelize, DataTypes) // RecruitmentPost model
db.application = require('./application.js')(sequelize, DataTypes) // Application model
db.skill = require('./skill.js')(sequelize, DataTypes) // Skill model
db.authQuestion = require('./authQuestion.js')(sequelize, DataTypes) // AuthQuestion model

// Define relationships
// Role - User
db.role.hasMany(db.user, {foreignKey: 'role_id', onUpdate: 'cascade', onDelete: 'cascade'})
// Business - User
db.business.hasMany(db.user, {foreignKey: 'business_id', onUpdate: 'cascade', onDelete: 'cascade'})
// User - PersonalFile
db.user.hasOne(db.personalFile, {foreignKey: 'user_id', onUpdate: 'cascade', onDelete: 'cascade'})
// User - CriterionJob
db.user.hasOne(db.criterionJob, {foreignKey: 'user_id', onUpdate: 'cascade', onDelete: 'cascade'})
// User - RecruitmentPost
db.user.hasMany(db.recruitmentPost, {foreignKey: 'user_id', onUpdate: 'cascade', onDelete: 'cascade'})
// User - Application
db.user.hasMany(db.application, {foreignKey: 'user_id', onUpdate: 'cascade', onDelete: 'cascade'})
// RecruitmentPost - Application
db.recruitmentPost.hasMany(db.application, {foreignKey: 'recruitmentPost_id', onUpdate: 'cascade', onDelete: 'cascade'})
// RecruitmentPost - User
db.recruitmentPost.belongsTo(db.user, {foreignKey: 'user_id', onUpdate: 'cascade', onDelete: 'cascade'})
// RecruitmentPost - Skill
db.recruitmentPost.belongsToMany(db.skill, {through: 'post_skill'})
// Skill - RecruitmentPost
db.skill.belongsToMany(db.recruitmentPost, {through: 'post_skill'})
// Skill - CriterionJob
db.skill.belongsToMany(db.criterionJob, {through: 'skill_criterion'})
// CriterionJob - Skill
db.criterionJob.belongsToMany(db.skill, {through: 'skill_criterion'})
// CriterionJob - User
db.criterionJob.belongsTo(db.user, {foreignKey: 'user_id', onUpdate: 'cascade', onDelete: 'cascade'})
// Application - RecruitmentPost
db.application.belongsTo(db.recruitmentPost, {
    foreignKey: 'recruitmentPost_id',
    onUpdate: 'cascade',
    onDelete: 'cascade'
})
// Application - User
db.application.belongsTo(db.user, {foreignKey: 'user_id', onUpdate: 'cascade', onDelete: 'cascade'})
// PersonalFile - Skill
db.personalFile.belongsToMany(db.skill, {through: 'skill_profile'})
// PersonalFile - User
db.personalFile.belongsTo(db.user, {foreignKey: 'user_id', onUpdate: 'cascade', onDelete: 'cascade'})

module.exports = db

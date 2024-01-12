const dbConfig = require('../config/dbConfig.js')
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: false,
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


db.sequelize.sync({ force: false })
    .then(() => {
        console.log('yes re-sync done!')
    })


// Importing models
db.admin = require('./admin.js')(sequelize, DataTypes)
db.recruitmentPost = require('./recruitmentPost.js')(sequelize, DataTypes)
db.business = require('./business.js')(sequelize, DataTypes)
db.user = require('./user.js')(sequelize, DataTypes)
db.application = require('./application.js')(sequelize, DataTypes)
db.skill = require('./skill.js')(sequelize, DataTypes)
db.role = require('./role.js')(sequelize, DataTypes)
db.criterionJob = require('./criterionJob.js')(sequelize, DataTypes)
db.authQuestion = require('./authQuestion.js')(sequelize, DataTypes)

db.personalFile = require('./personalFile.js')(sequelize, DataTypes)

db.study = require('./study.js')(sequelize, DataTypes)
db.project = require('./project.js')(sequelize, DataTypes)
db.certificate = require('./certificate.js')(sequelize, DataTypes)
db.experience = require('./experience.js')(sequelize, DataTypes)
db.personalFile = require('./personalFile.js')(sequelize, DataTypes)

// Relations

// User
// User has one Role and Business
// User has one Personal File and Criterion Job
// User has many Recruitment Posts and Applications
db.user.belongsTo(db.role, { foreignKey: 'role_id', onUpdate: 'cascade', onDelete: 'cascade' })
db.user.belongsTo(db.business, { foreignKey: 'business_id', onUpdate: 'cascade', onDelete: 'cascade' })
db.user.hasOne(db.personalFile, { foreignKey: 'user_id', onUpdate: 'cascade', onDelete: 'cascade' })
db.user.hasOne(db.criterionJob, { foreignKey: 'user_id', onUpdate: 'cascade', onDelete: 'cascade' })
db.user.hasMany(db.recruitmentPost, { foreignKey: 'user_id', onUpdate: 'cascade', onDelete: 'cascade' })
db.user.hasMany(db.application, { foreignKey: 'user_id', onUpdate: 'cascade', onDelete: 'cascade' })

// Business
// Business has many Users
db.business.hasMany(db.user, { foreignKey: 'business_id', onUpdate: 'cascade', onDelete: 'cascade' })

// Role
// Role has many Users
db.role.hasMany(db.user, { foreignKey: 'role_id', onUpdate: 'cascade', onDelete: 'cascade' })

// Recruitment Post
// Recruitment Post has many Applications
// Recruitment Post belongs to a User
// Recruitment Post belongs to many Skills through 'post_skill'
db.recruitmentPost.hasMany(db.application, { foreignKey: 'recruitmentPost_id', onUpdate: 'cascade', onDelete: 'cascade' })
db.recruitmentPost.belongsTo(db.user, { foreignKey: 'user_id', onUpdate: 'cascade', onDelete: 'cascade' })
db.recruitmentPost.belongsToMany(db.skill, { through: 'post_skill', onUpdate: 'cascade', onDelete: 'cascade' })

// Skill
// Skill belongs to many Recruitment Posts through 'post_skill'
// Skill belongs to many Criterion Jobs through 'skill_criterion'
db.skill.belongsToMany(db.recruitmentPost, { through: 'post_skill', onUpdate: 'cascade', onDelete: 'cascade' })
db.skill.belongsToMany(db.criterionJob, { through: 'skill_criterion' })

// Criterion Job
// Criterion Job belongs to many Skills through 'skill_criterion'
// Criterion Job belongs to a User
db.criterionJob.belongsToMany(db.skill, { through: 'skill_criterion' })
db.criterionJob.belongsTo(db.user, { foreignKey: 'user_id', onUpdate: 'cascade', onDelete: 'cascade' })

// Personal File
// Personal File belongs to many Skills through 'skill_profile'
// Personal File belongs to a User
// Personal File has many Studies, Projects, Certificates, and Experiences
db.personalFile.belongsToMany(db.skill, { through: 'skill_profile' })
db.personalFile.belongsTo(db.user, { foreignKey: 'user_id', onUpdate: 'cascade', onDelete: 'cascade' })
db.personalFile.hasMany(db.study, { foreignKey: 'personalFileId', onUpdate: 'cascade', onDelete: 'cascade' })
db.personalFile.hasMany(db.project, { foreignKey: 'personalFileId', onUpdate: 'cascade', onDelete: 'cascade' })
db.personalFile.hasMany(db.certificate, { foreignKey: 'personalFileId', onUpdate: 'cascade', onDelete: 'cascade' })
db.personalFile.hasMany(db.experience, { foreignKey: 'personalFileId', onUpdate: 'cascade', onDelete: 'cascade' })

// Application
// Application belongs to a Recruitment Post and a User
db.application.belongsTo(db.recruitmentPost, {
    foreignKey: 'recruitmentPost_id',
    onUpdate: 'cascade',
    onDelete: 'cascade'
})
db.application.belongsTo(db.user, { foreignKey: 'user_id', onUpdate: 'cascade', onDelete: 'cascade' })

// Repeated entry (remove or correct if necessary)
db.personalFile.belongsToMany(db.skill, { through: 'skill_profile' })

// Export the configured database
module.exports = db

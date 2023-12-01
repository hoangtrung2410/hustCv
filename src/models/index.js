
const dbConfig = require('../config/dbConfig.js')
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host:dbConfig.HOST,
        port:dbConfig.port,
        dialect:dbConfig.dialect,
        operatorsAliases:false,
        pool:{
            max:dbConfig.pool.max,
            min:dbConfig.pool.min,
            acquire:dbConfig.pool.acquire,
            idle:dbConfig.pool.idle
        }

    }
)
sequelize.authenticate()
    .then(()=> {
        console.log('Connection has been established successfully.')

    })
    .catch(err=>{
        console.error('Unable to connect to the database:', err)
    })

const db ={}
db.Sequelize = Sequelize
db.sequelize = sequelize
db.sequelize.sync({ force: false  })
    .then(() => {
        console.log('yes re-sync done!')
    })


db.recruitmentPost = require('./recruitmentPost.js')(sequelize, DataTypes)
db.business = require('./business.js')(sequelize, DataTypes)
db.user = require('./user.js')(sequelize, DataTypes)
module.exports = db

const dbConfig = require("../config/db.config.js")
const { Sequelize,Datatypes }=require('sequelize')


const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host:dbConfig.HOST,
        port:dbConfig.port,
        dialect:dbConfig.dialect,
        pool:{
            max:dbConfig.pool.max,
            min:dbConfig.pool.min,
            acquire:dbCongig.pool.acquire,
            idle:dbConfig.pool.idle,

        }

    }
)
sequelize.authenticate()
    .then(()=>{
        console.log("Connection has been established successfully")
    })
    .catch(err=>{
        console.error("Unable to connect to the database ")
    })

const db={}
    db.Sequelize= Sequelize
    db.sequelize = sequelize
    db.sequelize.sync({force:true})
        .then(()=>{
            console.log("yes - yes")
        })
module.exports=db

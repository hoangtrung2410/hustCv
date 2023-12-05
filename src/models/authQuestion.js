module.exports = (sequelize, DataTypes)=>{
    const AuthQuestion = sequelize.define('authQuestion',{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content :{
            type:DataTypes.TEXT,
        }

    },{
        timestamps : false
    })
    return AuthQuestion
}
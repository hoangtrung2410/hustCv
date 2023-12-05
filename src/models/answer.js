module.exports = (sequelize, DataTypes)=>{
    const Answer = sequelize.define('answer',{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        context :{
            type:DataTypes.STRING(50),
            required :true,
        }

    },{
        timestamps : false
    })
    return Answer
}
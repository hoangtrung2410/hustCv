module.exports = (sequelize,DataTypes)=>{
    const PersonalFile = sequelize.define('personalFile',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        profile:{
            type: DataTypes.TEXT,
        },
        cv:{
            type: DataTypes.STRING,
        }
    },{
        timestamps:false,
    })
    return PersonalFile
}
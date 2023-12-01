module.exports = (sequelize,DataTypes)=>{
    const Skill = sequelize.define("skill",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type: DataTypes.STRING
        }
    },{
        timestamps: false,
    })
    return Skill
}
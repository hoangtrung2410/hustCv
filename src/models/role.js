module.exports =(sequelize,DataTypes)=>{
    const Role = sequelize.define("role",{
        id:{
            type:DataTypes.INTEGER,
            primarykey: true,
            autoIncrement:true,
        },
        name:{
            type: DataTypes.STRING(30)

        }
    },
        {
            timestamps: false
        })
    return Role
}
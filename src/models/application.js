module.exports = (sequelize,DataTypes) =>{
    const Application = sequelize.define("application",{
        id:{
            Type : DataTypes.INTEGER,
            primaryKey:True,
            autoIncrement:True,
        },
        cv:{
            Type :DataTypes.STRING

        },
        status:{
            Type : DataTypes.BOOLEAN,

        }

    })
}
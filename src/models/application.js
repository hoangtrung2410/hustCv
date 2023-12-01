module.exports = (sequelize,DataTypes) =>{
    const Application = sequelize.define("application",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        CV:{
            type :DataTypes.STRING,
        },
        status:{
            type : DataTypes.STRING,
        }

    },{

    })
    return Application
}
module.exports = (sequelize,DataTypes) =>{
    const Application = sequelize.define("application",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content:{
            type: DataTypes.STRING,
            required: true,
        },
        CV:{
            type :DataTypes.STRING,
        },
        status:{
            type : DataTypes.STRING,
        }

    },{
        timestamps: false,

    })
    return Application
}
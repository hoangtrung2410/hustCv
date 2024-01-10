module.exports = (sequelize,DataTypes) =>{
    const Application = sequelize.define("application",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content:{
            type: DataTypes.STRING,
        },
        CV:{
            type :DataTypes.STRING,
        },
        recuritmentPost_id: {
            type: DataTypes.INTEGER,
        },
        status:{
            type : DataTypes.STRING,
        }

    },{
        timestamps: false,

    })
    return Application
}
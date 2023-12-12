module.exports = (sequelize, DataTypes) => {
    const Certificate = sequelize.define("certificate", {
        id:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true,
        },
        name:{
            type: DataTypes.TEXT

        }
    },
        {
            timestamps: false
        })
    return Certificate
}
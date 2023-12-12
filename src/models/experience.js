module.exports = (sequelize, DataTypes) => {
    const Experience = sequelize.define("experience", {
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
    return Experience
}
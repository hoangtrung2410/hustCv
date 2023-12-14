module.exports = (sequelize, DataTypes) => {
    const Study = sequelize.define("study", {
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
    return Study
}
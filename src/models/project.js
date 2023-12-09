module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define("project", {
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
    return Project
}
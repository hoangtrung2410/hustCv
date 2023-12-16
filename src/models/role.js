module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define("role", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(100)

            }
        },
        {
            timestamps: false
        })
    return Role
}
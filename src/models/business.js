module.exports = (sequelize, DataTypes) => {
    const Business = sequelize.define("business", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true

        },
        businessName: {
            type: DataTypes.STRING(255),
        },
        businessAddress: {
            type: DataTypes.STRING(255),
        },
        businessWebsite: {
            type: DataTypes.STRING(255),
        },
    }, {
        timestamps: false
    })

    return Business

}

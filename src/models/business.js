
module.exports = (sequelize, DataTypes) => {
    const Business = sequelize.define("business", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true

        }, 
        name: {
            type: DataTypes.STRING(100),
        },
        address: {
            type: DataTypes.STRING(100),
        },
        website: {
            type: DataTypes.STRING(100),
        },
    }, {
        timestamps: false
    })

    return Business

}

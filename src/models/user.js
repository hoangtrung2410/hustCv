
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true

        },
        username: {
            type: DataTypes.STRING(50),
            unique: true
        },
        email: {
            type: DataTypes.STRING(100),
            unique: true

        },
        password: {
            type: DataTypes.STRING(100),
        },


    }, {

        timestamps: false
    })

    return User

}

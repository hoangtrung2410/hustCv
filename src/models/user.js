
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true

        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        email:{
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        password:{
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        phoneNumber:{
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        birthDay:{
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }

    }, {

        timestamps: false
    })
    return User

}

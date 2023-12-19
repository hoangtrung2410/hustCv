module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("admin", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userName:{
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true
        },
        passWord:{
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email:{
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        fullName:{
            type: DataTypes.STRING(50),
            allowNull: true,
        }
    }, {

    });

    return Admin;
};

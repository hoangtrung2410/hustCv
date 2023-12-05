
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true

        },
        username: {
            type: DataTypes.STRING(50),
            required :true
        },
        email:{
            type: DataTypes.STRING(100),
            unique: true,
            required :true,
            lowercase :true
        },
        password:{
            type: DataTypes.STRING(20),
            required :true,
        },
        phoneNumber:{
            type: DataTypes.STRING(10),
            required :true,
        },
        birthDay:{
            type: DataTypes.DATE,
            required :true,
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

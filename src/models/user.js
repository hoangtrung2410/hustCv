const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false,
            lowercase: true
        },
        password: {
            type: DataTypes.STRING(255),
            set(value) {
                const bcrypt = require('bcrypt');
                const saltRounds = 10;
                const hashedPassword = bcrypt.hashSync(value, saltRounds);
                this.setDataValue('password', hashedPassword);
            }

        },

        phoneNumber: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        birthDay: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }

    }, {
        timestamps: false,


    });
    // User.addHook("beforeSave", async (user) => {
    //     if (user.password) {
    //
    //         user.password = await bcrypt.hash(user.password, 10);
    //         console.log("password = " + user.password)
    //     }
    // })
    User.prototype.checkPassword = async function (newPassword) {
        try {
            console.log("validPassword 1 = " + newPassword);
            console.log("validPassword 2= " + this.password)
            const check = await bcrypt.compare(newPassword, this.password);
            console.log("check = " + check);
            return check;
        } catch (error) {
            console.log(error);
        }
    };

    return User;
};
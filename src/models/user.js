const bcrypt = require('bcrypt');
const crypto = require('crypto')

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(50), allowNull: false
        },
        email: {
            type: DataTypes.STRING(100), unique: true, allowNull: false, lowercase: true
        },
        password: {
            type: DataTypes.STRING(255), set(value) {
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
        refreshToken: {
            type: DataTypes.TEXT, allowNull: true,
        },
        timeCreateRefreshToken: {
            type: DataTypes.DATE
        },
        status: {
            type: DataTypes.BOOLEAN, defaultValue: true
        },
        passwordChangedAt: {
            type: DataTypes.DATE
        },
        passwordCode: {
            type: DataTypes.STRING(255)
        },
        codeResetExpires: {
            type: DataTypes.STRING(255)
        },


    }, {
        timestamps: false,

    });


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
    }
    User.prototype.createPasswordChangedToken = async function (genericParam) {
        try {
            const code = crypto.randomInt(100000, 1000000);
            console.log("code = " + code);
            this.passwordCode = crypto.createHash('sha256').update(code.toString()).digest('hex');
            this.codeResetExpires = Date.now() + 15 * 60 * 1000;
            return code;
        } catch (error) {
            console.log(error);
        }
    }

    return User
}


const bcrypt = require('bcrypt');
const crypto = require('crypto')
const {nanoid} = require('nanoid');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
        }, username: {
            type: DataTypes.STRING(50), allowNull: false
        }, email: {
            type: DataTypes.STRING(100), unique: true, allowNull: false, lowercase: true
        }, password: {
            type: DataTypes.STRING(255), set(value) {
                const bcrypt = require('bcrypt');
                const saltRounds = 10;
                const hashedPassword = bcrypt.hashSync(value, saltRounds);
                this.setDataValue('password', hashedPassword);
            }

        }, phoneNumber: {
            type: DataTypes.STRING(10), allowNull: false,
        }, birthDay: {
            type: DataTypes.DATE, allowNull: false,
        }, tokenRefresh: {
            type: DataTypes.TEXT, allowNull: true,
        },
        status: {
            type: DataTypes.BOOLEAN, defaultValue: true
        },
        passwordChangedAt: {
            type: DataTypes.STRING
        },
        passwordResetToken: {
            type: DataTypes.STRING(255)
        },
        passwordResetExpires: {
            type: DataTypes.STRING
        }

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
            const resetToken = crypto.randomBytes(32).toString('hex');
            this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
            return resetToken;
        } catch (error) {
            console.log(error);
        }
    }

    return User
}


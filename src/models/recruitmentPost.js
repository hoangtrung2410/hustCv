module.exports = (sequelize, DataTypes) => {
    const RecuritmentPost = sequelize.define("recruitmentPost", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true

        }, title: {
            type: DataTypes.TEXT,
        },
        describe: {
            type: DataTypes.TEXT,
        },
        request: {
            type: DataTypes.TEXT,
        },
        form: {
            type: DataTypes.STRING(20),

        },
        salary: {
            type: DataTypes.STRING(100),
        },
        dateClose: {
            type: DataTypes.DATE,
        },
        location: {
            type: DataTypes.STRING(100),
        },
        level: {
            type: DataTypes.STRING(100),
        }
    }, {
        timestamps: true
    })

    return RecuritmentPost

}

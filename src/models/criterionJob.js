module.exports=(sequelize,DataTypes)=>{
    const CriterionJob = sequelize.define("criterionJob",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        salary:{
            type:DataTypes.TEXT,
        },
        jobLevel:{
            type:DataTypes.STRING

        },
        address:{
            type:DataTypes.STRING

        }
    },{
        timestamps: false,
    })
    return CriterionJob
}
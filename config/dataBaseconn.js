const mongoose=require("mongoose")
require("dotenv").config()
const dbConnection=()=>{

    mongoose.connect(process.env.DataBase_URL)
    .then(()=>{console.log("Data Base Connection Established Successfully")})
    .catch((error)=>{
        console.log("Data Base Connection Not Established Successfully")
        console.error(error)
        process.exit(1)
    })

}
module.exports=dbConnection;
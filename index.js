const express=require("express")
const app=express();

require("dotenv").config()

const PORT=process.env.PORT || 5000

app.use(express.json())

const dbConnection=require("./config/dataBaseconn")
dbConnection();

const user=require("./routes/user")
app.use("/api/v1",user)

app.listen(PORT,()=>{
    console.log(`Server is start listning at ${PORT}`)
})

app.get("/",(req,res)=>{
    res.send("This is home page baby ")
})
const mongoose = require("mongoose")
require('dotenv').config()

const connecDB = async()=>{
     await mongoose.connect(process.env.MONGODB_URL)
}

connecDB()
.then(()=>console.log("DB connedted.."))
.catch((err)=>console.error(err))

module.exports=connecDB
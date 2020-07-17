const express=require('express')
const cors=require('cors')
const dotenv=require('dotenv')
// const studentRoute=require('./routes/students')
// const projectRoute=require('./routes/projects')

dotenv.config()
const db = require('./db')
const server=express()
server.use(cors())
server.use(express.json())
// server.get('/' ,(req,res)=>{
//     res.send('ere')
// })


// server.use('/students',studentRoute)
// server.use('/projects',projectRoute)
server.listen(process.env.PORT||3453,()=>console.log('RUNNING ON',process.env.PORT||3453))
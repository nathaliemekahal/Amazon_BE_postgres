const express=require('express')
const cors=require('cors')
const dotenv=require('dotenv')
const productRoute=require('./routes/products')
const reviewRoute=require('./routes/reviews')

dotenv.config()
const db = require('./db')
const server=express()
server.use(cors())
server.use(express.json())
// server.get('/' ,(req,res)=>{
//     res.send('ere')
// })


server.use('/products',productRoute)
server.use('/reviews',reviewRoute)
server.listen(process.env.PORT||3453,()=>console.log('RUNNING ON',process.env.PORT||3453))
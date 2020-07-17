const express= require('express')
const db= require('../../db')
const uniqid=require('uniqid')
const router=express.Router()
const { join } = require("path")
const multer = require("multer")
const {readFile, writeFile, createReadStream } = require("fs-extra")
const upload = multer({})


router.get('/',async(req,res)=>{
    const order = req.query.order || "asc"
    const offset = req.query.offset || 0
    const limit = req.query.limit || 10

    // removing them from Query since otherwise I'll automatically filter on them
    delete req.query.order
    delete req.query.offset
    delete req.query.limit

    let query = 'SELECT * FROM "Products" ' 

    const params = []
    for (queryParam in req.query) { 
        params.push(req.query[queryParam])

        if (params.length === 1) 
            query += `WHERE ${queryParam} = $${params.length} `
        else
            query += ` AND ${queryParam} = $${params.length} `
    }

    query += " ORDER BY _id " + order 

    params.push (limit)
    query += ` LIMIT $${params.length} `
    params.push(offset)
    query += ` OFFSET $${params.length}`
   
    console.log(query)

    //you can also specify just the fields you are interested in, like:
    //SELECT asin, category, img, title, price FROM "Books" 
    const response = await db.query(query, params)
    res.send(response.rows)
    // const response= await db.query(`SELECT * FROM "Students"`)
    // res.send(response.rows)
})
router.get('/:id',async (req,res)=>{
    const response= await db.query(`SELECT * FROM "Products" WHERE _id=$1`,[req.params.id])
    res.send(response.rows)
})
router.post('/',async(req,res)=>{
    const response=await db.query
    (`INSERT INTO "Products"
    (name,description,brand,"imageurl",price,category,"createdat") VALUES($1,$2,$3,$4,$5,$6,$7)
    RETURNING *`,
    [req.body.name,req.body.description,req.body.brand,req.body.imageUrl,req.body.price,req.body.category
    ,new Date()])
    res.send(response.rows[0])
})


router.put('/:id',async(req,res)=>{
    try {
        let params=[]
        let query= 'UPDATE "Products" SET '

        for(bodyParams in req.body){
        query+=
        (params.length>0? ", ": '') + bodyParams +' = $'+(params.length+1)
        params.push(req.body[bodyParams])
        }
        params.push(req.params.id)
        query+=' WHERE _id = $'+params.length + ' RETURNING *'

        console.log(query)
        const result = await db.query(query, params)
        res.send(result.rows)
        
    } catch (error) {
        console.log(error)
    }
})


router.delete("/:id", async (req, res) => {
    const response = await db.query(`DELETE FROM "Products" WHERE _id = $1`, [ req.params.id ])

    if (response.rowCount === 0)
        return res.status(404).send("Not Found")
    
    res.send("OK")
})
productsPath = join(__dirname, "../../../../Amazon_CRUD_express/amazon/public/img/products")


router.post("/:id/uploadPhoto", upload.single("avatar"), async (req, res) => {
    try {
      
      await writeFile(
        join(productsPath, req.params.id+'.'+req.file.originalname.split('.').pop()),
        req.file.buffer
      )
     
      // const studentsArray= JSON.parse(fs.readFileSync(studentsFilePath).toString())
      // studentsArray.forEach(student =>{
        // if(student.id === req.params.id){
          imageurl =`http://localhost:3000/img/products/${req.params.id}.${req.file.originalname.split(".").pop()}`
        // }
        let response= await db.query(
            `
        UPDATE "Products" SET imageurl=$1 WHERE "_id"=${req.params.id}
       
        `,[imageurl])
    
        res.send('UPDATED')
      
      // })
  
    } catch (error) {
      console.log(error)
    }
    res.send("ok")
  })

module.exports=router
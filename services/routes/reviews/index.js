const express= require('express')
const db= require('../../db')
const uniqid=require('uniqid')
const router=express.Router()


router.post('/:productid',async(req,res)=>{
    const response=await db.query
    (`INSERT INTO "Reviews"
    (comment,rate,"productId",createdat) VALUES($1,$2,$3,$4)
    RETURNING *`,
    [req.body.comment,req.body.rate,req.params.productid,new Date()])
    res.send(response.rows[0])
})

router.get("/:productid",async(req,res)=>{
    const response=await db.query(`SELECT * FROM "Reviews" WHERE "productId"=$1`,[req.params.productid])
    res.send(response.rows)
})

router.put('/:productid/:reviewid',async(req,res)=>{
    try {
        let response= await db.query(
            `
        UPDATE "Reviews" SET _id=$1, comment=$2,rate=$3,"productId"=$4 WHERE "productId"=${req.params.productid}
        AND _id=${req.params.reviewid} 
        `,[req.params.reviewid,req.body.comment,req.body.rate,req.params.productid])
    
        res.send('UPDATED')
        
    } catch (error) {
        console.log(error)
    }
})

router.delete("/:productid/:reviewid", async (req, res) => {
    const response = await db.query
    (`DELETE FROM "Reviews" WHERE "productId"=$1 AND _id = $2`, [ req.params.productid,req.params.reviewid ])

    if (response.rowCount === 0)
        return res.status(404).send("Not Found")
    
    res.send("OK")
})

module.exports=router
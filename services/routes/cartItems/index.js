const express = require("express");
const db = require("../../db");
const router = express.Router();

router.post("/", async (req, res) => {
  const response = await db.query(
    `INSERT INTO carts (productid) VALUES ($1) RETURNING *`,
    [req.body.productid]
  );

  res.send(response.rows[0]);
});

router.get("/:productid", async (req, res) => {
  const response = await db.query(
    `SELECT name, brand, price as unitary_price
    FROM carts JOIN "Products" ON carts.productid = "Products"._id
    WHERE productid = $1
                                     `,
    [req.params.productid]
  );

  res.send(response.rows);
});

module.exports = router;

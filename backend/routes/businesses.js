const express = require("express");
const pool = require("../config/db"); // Adjust the path to your db.js file
const router = express.Router();
const privateFunctions = require('./utils/functions');
require("dotenv").config({ path: "./.env.local" });

router.get("/get/:userId", async (req, res) => {
  try {
    // No need to create/end connection. Just use the pool.
    const userId = req.params.userId ?? null;

    const [rows] = await pool.execute(
      `SELECT * FROM businesses WHERE user_clerk_id = '${userId}'`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).send("Server Error", error);
  }
});

router.get("/verify/:userId/business/:businessId", async (req, res) => {
  try {
    // No need to create/end connection. Just use the pool.
    const userId = req.params.userId ?? null;
    const businessId = req.params.businessId ?? null;

    const isVerified = await privateFunctions.verifyBusiness(userId, businessId);

    if(isVerified){
        res.json({success: true});
    }else{
        res.json({success: false, error: "This business is not verified!"});
    }
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).send("Server Error", error);
  }
});

router.post("/new/:userId", async (req, res) => {
  try {
    // No need to create/end connection. Just use the pool.
    const userId = req.params.userId ?? null;
    const businessName = req.body.name ?? null;
    const businessAddress = req.body.address ?? null;

    if (businessName) {
      const [result] = await pool.execute(
        `INSERT INTO businesses (name, address, user_clerk_id) VALUES ('${businessName}', '${businessAddress}', '${userId}')`
      );
      if (result.affectedRows > 0) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    } else {
      res.json({ error: `Missing Required Parameters` });
    }
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).send("Server Error", error);
  }
});

router.delete("/delete/:userId/business/:businessId", async (req, res) => {
  try {
    // No need to create/end connection. Just use the pool.
    const userId = req.params.userId ?? null;
    const businessId = req.params.businessId ?? null;

    const isVerified = await privateFunctions.verifyBusiness(userId, businessId);

      if(isVerified){
          const [result] = await pool.execute(`DELETE FROM businesses WHERE id = ${businessId} AND user_clerk_id = '${userId}'`);

          if(result.affectedRows = 1){
              res.json({success: true});
          }else{
            res.json({success: false, error: "Error while deleting business"});
          }
      }else{
        res.json({error: "You are not allowed to delete this business!"});
      }

  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).send("Server Error", error);
  }
});

module.exports = router;

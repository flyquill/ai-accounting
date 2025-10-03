const express = require("express");
const pool = require("../config/db"); // Adjust the path to your db.js file
const router = express.Router();
require("dotenv").config({ path: "./.env.local" });
const privateFunctions = require('./utils/functions');

router.get("/get/:userId/business/:businessId", async (req, res) => {
  try {
    // No need to create/end connection. Just use the pool.
    const userId = req.params.userId ?? null;
    const businessId = req.params.businessId ?? null;

    const isVerified = await privateFunctions.verifyBusiness(userId, businessId);

    if (isVerified) {
      const [rows] = await pool.execute(
        `SELECT * FROM accounts WHERE business_id = ${businessId}`
      );
      res.json(rows);
    } else {
      res.json({ error: `Missing Required Parameters` });
    }
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).send("Server Error", error);
  }
});


router.post("/new/:userId/business/:businessId", async (req, res) => {
  try {
    // No need to create/end connection. Just use the pool.
    const userId = req.params.userId ?? null;
    const businessId = req.params.businessId ?? null;
    const accountName = req.body.name ?? null;
    const accountAddress = req.body.address ?? null;
    const accountPhone = req.body.phone ?? null;
    const accountType = req.body.type ?? null;
    const openingBalance = req.body.openingBalance ?? null;

    const isVerified = await privateFunctions.verifyBusiness(userId, businessId);

    if (accountName && isVerified) {
      const [result] = await pool.execute(
        `INSERT INTO accounts (name, address, phone, type, opening_balance, business_id) VALUES ('${accountName}', '${accountAddress}', '${accountPhone}', '${accountType}', '${openingBalance}', '${businessId}')`
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

module.exports = router;

const express = require('express');
const pool = require('../config/db'); // Adjust the path to your db.js file
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // No need to create/end connection. Just use the pool.
        const [rows] = await pool.execute('SELECT * FROM businesses');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching businesses:', error);
        res.status(500).send('Server Error', error);
    }
});

router.get('/:id', (req, res) => {
    res.send(`Businesses page ${req.params.id}`)
})


module.exports = router;
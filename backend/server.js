// Import required packages
const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.listen(3000);

app.get('/', (req, res) => {
    res.json({status: false})
})

const businessesRouter = require('./routes/businesses');

app.use('/businesses', businessesRouter)
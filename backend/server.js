// Import required packages
const express = require('express');
const cors = require('cors'); // Still need to import the cors package itself
const app = express();

const corsOptions = require('./config/corsOptions'); // <-- Import your custom options

app.use(cors(corsOptions)); // <-- Use the imported options

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000);

app.get('/', (req, res) => {
    res.json({status: false})
})

const businessesRouter = require('./routes/businesses');

app.use('/businesses', businessesRouter)
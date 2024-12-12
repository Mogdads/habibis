import express from 'express'
import router from './endpoints.js';
import pool from './utils.js';
require('dotenv').config();


//import { initaliseData } from './utils.js';
import cors from 'cors';



//will add cors to the main branch soon
const app = express();
app.use(express.json());
app.use(cors()); //Allows requests from different ports - I get a fetch error otherwise
app.use('/api', router);


// test the database connection
async function testConnection() {
    // commented out for tests, use locally if needed
    // await initaliseData(); 

    try {
        const res = await pool.query('SELECT NOW()');
        console.log("✅ Database connected successfully at: ", res.rows[0].now);
    } catch (err) {
        console.error("❌ Database connection failed: ", err.message);
        throw new Error(err.message);    
    }   
} 

// start the server 
const port = 3000;
const server = app.listen(port, async () => {
    console.log(`🚀 Server running on port ${port}.`);
    await testConnection();
});

export { app, server };

// backend logging
const logger = require('./logger');

app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.post('/order', async (req, res) => {
  try {
    // Logic to create order
    logger.info(`Order created successfully: ${JSON.stringify(req.body)}`);
    res.status(201).send({ message: 'Order created' });
  } catch (error) {
    logger.error(`Order creation failed: ${error.message}`);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

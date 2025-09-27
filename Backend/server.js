import express from 'express';
import processRoute from './Routes/processRoute.js'; // Import the new router
import { VarEnv } from './configurations/VarEnv.js';

const app = express();
const port = VarEnv.PORT;

// Middleware to parse text and JSON bodies
// These must be used before mounting the router
app.use(express.text());
app.use(express.json());

// Mount the router. Any request to /api will be handled by processRoute.js
app.use('/api', processRoute);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
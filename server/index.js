const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const ConnectDB = require('./db/ConnectDB.js');
const app = express();
const router = require('./routes/DBOperRoutes'); // or contactRoutes
const bodyParser = require('body-parser');

dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

let pool;

(async () => {
    pool = await ConnectDB();

    app.use((req, res, next) => {
        req.pool = pool;
        next();
    });

    // ✅ Mount your API routes here
    app.use("/api/contacts", router);

    // Optional: root test route
    app.get("/", (req, res) => {
        res.status(200).send("OK");
    });

    app.listen(port,"0.0.0.0", () => {
        console.log(`Example app listening on port http://localhost:${port}`);
    });
})();


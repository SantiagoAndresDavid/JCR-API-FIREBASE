const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();

const serviceAccount = require("./admin-credentials.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://restapi-js.firebaseio.com",
});

app.use(cors({origin: true}));

app.get("/hello-world", (req, res) => {
  return res.status(200).json({message: "Hello World!"});
});

// ROUTES
app.use(require("./routes/products.routes"));

exports.app = functions.https.onRequest(app);

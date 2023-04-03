const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");

const app = express();


const serviceAccount = require("./admin-credentials.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://restapi-js.firebaseio.com",
});
const db = admin.firestore();

app.get("/hello-world", (req, res) => {
  return res.status(200).json({message: "Hello World!"});
});

app.post(`/api/products`, async (req, res) => {
  try {
    await db.collection("products")
        .doc("/" + req.body.id + "/")
        .create({name: req.body.name});
    return res.status(200).json();
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.get(`/api/products/:product_id`, async (req, res) => {
  try {
    const doc = db.collection("products").doc(req.params.product_id);
    const item = await doc.get();
    const response = item.data();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const query = db.collection("products");
    const querySnapshot = await query.get();
    const docs = querySnapshot.docs;
    const response = docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.put("/api/products/:product", async (req, res) => {
  try {
    const document = db.collection("products").doc(req.params.product);
    await document.update({
      name: req.body.name,
    });
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json();
  }
});
exports.app = functions.https.onRequest(app);


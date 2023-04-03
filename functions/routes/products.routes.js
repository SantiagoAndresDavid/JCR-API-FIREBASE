const {Router} = require("express");
// eslint-disable-next-line new-cap
const router = Router();

const admin = require("firebase-admin");
const db = admin.firestore();

router.post(`/api/products`, async (req, res) => {
  try {
    await db.collection("products")
        .doc("/" + req.body.id + "/")
        .create({name: req.body.name});
    return res.status(200).json();
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get(`/api/products/:product_id`, async (req, res) => {
  try {
    const doc = db.collection("products").doc(req.params.product_id);
    const item = await doc.get();
    const response = item.data();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get("/api/products", async (req, res) => {
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

router.put("/api/products/:product", async (req, res) => {
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
router.delete("/api/products/:product", async (req, res) => {
  try {
    const doc = db.collection("products").doc(req.params.product);
    await doc.delete();
    return res.status(200).json();
  } catch (error) {
    return res.status(500).send(error);
  }
});
module.exports = router;

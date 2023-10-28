import express from "express";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Hello World!" }).status(200); // the 'status' is unnecessary but wanted to show you how to define a status
});
app.listen(3001);

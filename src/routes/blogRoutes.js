import { Router } from "express";
import client from "../grpc/client";

const router = Router();

router.get("/blogs", (req, res) => {
  client.getAll(null, (err, data) => {
    if (!err) {
      res.json(data);
    }
  });
});

router.post("/addBlog", (req, res) => {
  const { title, author, body } = req.body;
  const blogObj = { title, author, body };
  client.insert(blogObj, (err, data) => {
    err ? console.log(err) : res.json(data);
  });
});

router.put("/updateBlog", (req, res) => {
  const { id, title, author, body } = req.body;
  const blogObj = { id, title, author, body };
  client.update(blogObj, (err, data) => {
    err ? console.log(err) : res.json(data);
  });
});

router.post("/deleteBlog", (req, res) => {
  const { id } = req.body;
  client.remove({ id }, (err, _) => {
    err ? console.log(err) : res.json({ data: "Blog Removed" });
  });
});

export default router;

import mongoose from "mongoose";
import shortid from "shortid";

const blogSchema = mongoose.Schema({
  _id: { type: String, default: shortid.generate },
  author: String,
  title: String,
  body: String,
});

const Blog = mongoose.model("blog", blogSchema);

export default Blog;

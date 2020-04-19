import grpc from "grpc";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { loadSync } from "@grpc/proto-loader";
import Blog from "../models/Blog";

dotenv.config();

const PROTO_PATH = "src/grpc/blogs.proto";
const GRPC_PORT = process.env.GRPC_PORT;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;

mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}`, {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});

let packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
  includeDirs: ["."],
});

let blogsProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(blogsProto.BlogService.service, {
  getAll: (_, callback) => {
    Blog.find({})
      .then((blogs) => {
        callback(null, { data: blogs });
      })
      .catch((err) => console.log(err));
  },
  get: (call, callback) => {
    const { id } = call.request;
    Blog.find({ _id: id })
      .then((blog) => {
        blog
          ? callback(null, { data: blog })
          : callback({ code: grpc.status.NOT_FOUND, details: "Not found" });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  insert: (call, callback) => {
    const blog = call.request;
    Blog.create(blog)
      .then((createdBlog) => {
        callback(null, { data: createdBlog });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  update: (call, callback) => {
    const { id, author, title, body } = call.request;
    Blog.findOneAndUpdate(
      { _id: id },
      { author: author, title: title, body: body }
    )
      .then((blog) => {
        callback(null, { data: blog });
      })
      .catch((err) => {
        console.log(err);
        callback({ code: grpc.status.NOT_FOUND, details: "Not found" });
      });
  },
  remove: (call, callback) => {
    const { id } = call.request;
    Blog.findOneAndDelete({ _id: id })
      .then((blog) => {
        callback(null, {});
      })
      .catch((err) => {
        console.log(err);
        callback({ code: grpc.status.NOT_FOUND, details: "Not found" });
      });
  },
});

server.bind(`localhost:${GRPC_PORT}`, grpc.ServerCredentials.createInsecure());
console.log("Server running on localhost:30043");
server.start();
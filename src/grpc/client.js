import grpc from "grpc";
import dotenv from "dotenv";
import protoLoader from "@grpc/proto-loader";

dotenv.config();
const GRPC_PORT = process.env.GRPC_PORT;
const PROTO_PATH = "./blogs.proto";

let packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const BlogService = grpc.loadPackageDefinition(packageDefinition).BlogService;
const client = new BlogService(
  `localhost:${GRPC_PORT}`,
  grpc.credentials.createInsecure()
);

export default client;

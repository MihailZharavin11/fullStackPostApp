import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import {
  loginValidation,
  registerValidation,
  postValidation,
} from "./validations/validations.js";
import checkAuth from "./utils/checkAuth.js";
import { register, getMe, login } from "./controllers/UserController.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "./controllers/PostController.js";

mongoose
  .connect(
    `mongodb+srv://admin:123qwerty@cluster0.bdyu00y.mongodb.net/blog?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("DB started!");
  })
  .catch((err) => {
    console.log("DB Error", err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());

app.post("/auth/login", loginValidation, login);
app.post("/auth/register", registerValidation, register);
app.get("/auth/me", checkAuth, getMe);

app.get("/posts", getAllPosts);
app.get("/post/:id", getPost);
app.post("/posts", checkAuth, postValidation, createPost);
app.delete("/post/:id", checkAuth, deletePost);
app.patch("/post/:id", checkAuth, updatePost);

app.post("/upload", checkAuth, upload.single("image"), (req, res) =>
  res.json({
    url: `/uploads/${req.file.originalname}`,
  })
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server started!");
});

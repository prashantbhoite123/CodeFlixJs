import express from "express"
import { isAuthentication } from "../middlewares/auth.Middleware.js"
import {
  create,
  deletepost,
  getPosts,
  updatepost,
} from "../controllers/post.controller.js"

const router = express.Router()

router.post("/create", isAuthentication, create)
router.get("/getposts", getPosts)
router.delete("/deletepost/:postId/:userId", isAuthentication, deletepost)
router.put("/updatepost/:postId/:userId", isAuthentication, updatepost)

export default router

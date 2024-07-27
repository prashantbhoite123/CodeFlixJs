import express from "express"
import { isAuthentication } from "../middlewares/auth.Middleware.js"
import {
  createComment,
  deleteComment,
  editComment,
  getcomment,
  getPostComments,
  likeComment,
} from "../controllers/comment.controller.js"

const router = express.Router()

router.post("/create", isAuthentication, createComment)
router.get("/getpostcomments/:postId", getPostComments)
router.put("/likecomment/:commentId", isAuthentication, likeComment)
router.put("/editcomment/:commentId", isAuthentication, editComment)
router.delete("/deletecomment/:commentId", isAuthentication, deleteComment)
router.get("/getcomment", isAuthentication, getcomment)
export default router

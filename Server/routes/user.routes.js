import express from "express"
import {
  deleteUser,
  getuser,
  getUsers,
  signOut,
  test,
  updateUser,
} from "../controllers/user.controllers.js"
import { isAuthentication } from "../middlewares/auth.Middleware.js"

const router = express.Router()

router.get("/test", test)

router.put("/update/:userId", isAuthentication, updateUser)
router.delete("/delete/:userId", isAuthentication, deleteUser)
router.get("/signout", signOut)
router.get("/getusers", isAuthentication, getUsers)
router.get("/:userId", getuser)

export default router

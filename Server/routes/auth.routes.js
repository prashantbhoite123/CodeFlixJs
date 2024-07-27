import express from "express"
import { googleAuth, signin, signup } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/googleAuth", googleAuth)

export default router

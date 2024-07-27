import { User } from "../Models/user.model.js"
import { errorHandler } from "../utils/error.handler.js"
import jwt from "jsonwebtoken"

export const isAuthentication = async (req, res, next) => {
  try {
    const { token } = req.cookies
    if (!token) {
      return next(errorHandler(401, "Unauthorized"))
    }
    const decode = jwt.verify(token, process.env.SECREY_KEY)
    const user = await User.findById(decode._id)
    if (!user) {
      return next(errorHandler(403, "Unauthoride"))
    }
    req.user = user
    next()
  } catch (e) {
    console.log(`Error While Authentication api:${e}`)
  }
}

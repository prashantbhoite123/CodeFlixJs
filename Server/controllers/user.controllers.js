import { errorHandler } from "../utils/error.handler.js"
import bcryptjs from "bcryptjs"
import { User } from "../Models/user.model.js"

export const test = (req, res) => {
  res.json({ message: "api Working" })
}

export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to update this user"))
    }
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, "Password must be at least 6 characters"))
      }
      req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }

    if (req.body.username) {
      const existUserEmail = await User.findOne({ username: req.body.username })
      if (existUserEmail) {
        return next(errorHandler(400, "User Already exist"))
      }
      if (req.body.username.length < 7 || req.body.username.length > 20) {
        return next(
          errorHandler(400, "Username must be between 7 and 20 charector")
        )
      }
      if (req.body.username.includes(" ")) {
        return next(errorHandler(400, "Username cannot contain spaces"))
      }
      if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(400, "Username must be lowercase"))
      }
      if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        return next(
          errorHandler(400, "Username can only contain letters and numbers")
        )
      }
    }
    const userUpdated = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePic: req.body.profilePic,
          password: req.body.password,
        },
      },
      { new: true }
    )
    const { password, ...rest } = userUpdated._doc
    res.status(200).json(rest)
  } catch (e) {
    console.log(`Error While Update User :${e}`)
  }
}

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allow to delete this account"))
  }
  try {
    const { userId } = req.params
    await User.findByIdAndDelete(userId)
    res.status(200).json({ success: true, message: "User has been Deleted" })
  } catch (e) {
    next(e)
  }
}

export const signOut = (req, res, next) => {
  try {
    res
      .clearCookie("token")
      .status(200)
      .json({ success: false, message: "User Signout successFull" })
  } catch (e) {
    next(e)
  }
}

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are Not allowed to see all users"))
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9

    const sortDirection = req.query.sort === "asc" ? 1 : -1

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc
      return rest
    })

    const totalUsers = await User.countDocuments()

    const now = new Date()
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    })
  } catch (e) {
    next(e)
  }
}

export const getuser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)

    if (!user) {
      return next(errorHandler(403, "User Not Found"))
    }
    const { password, ...rest } = user._doc
    res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
}

import { User } from "../Models/user.model.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.handler.js"
import jwt from "jsonwebtoken"

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    const user = await User.findOne({ email })
    if (user) {
      return next(errorHandler(400, "User Already exist"))
    }
    if (
      !username ||
      !email ||
      !password ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      return next(errorHandler(500, "All Field required"))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    })
    await newUser.save()
    res.json({ message: "Sing up successFull" })
  } catch (e) {
    next(errorHandler(400, `:${e}`))
  }
}

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password || email === "" || password === "") {
      next(errorHandler(400, "All field are required"))
    }

    const validUser = await User.findOne({ email })
    if (!validUser) {
      return next(errorHandler(404, "User Not found"))
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"))
    }

    const { password: abc, ...rest } = validUser._doc
    const token = jwt.sign(
      { _id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.SECREY_KEY
    )
    res
      .cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
      .status(200)
      .json(rest)
  } catch (error) {
    next(error)
  }
}

export const googleAuth = async (req, res, next) => {
  try {
    const { username, email, profilePic } = req.body

    const user = await User.findOne({ email })
    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.SECREY_KEY)
      const { password, ...rest } = user._doc
      res
        .cookie("token", token, {
          httpOnly: true,
        })
        .json(rest)
    } else {
      const getGeneratePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8)

      const hashPassword = bcryptjs.hashSync(getGeneratePassword, 10)
      const newUser = new User({
        username,
        email,
        profilePic,
        password: hashPassword,
      })

      await newUser.save()
      const token = jwt.sign(
        { _id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.SECREY_KEY
      )
      const { password, ...rest } = newUser._doc
      console.log("Rest chai aur code: ", rest)
      res
        .cookie("token", token, {
          httpOnly: true,
        })
        .json(rest)
    }
  } catch (e) {
    console.log(`Error While googleAuth :${e}`)
  }
}

// export const googleAuth = async (req, res, next) => {
//   try {
//     const { name, email, profilePic } = req.body
//     const existUser = await User.findOne({ email })
//     if (existUser) {
//       const token = jwt.sign({ _id: existUser._id }, process.env.SECRETKEY, {
//         expiresIn: "1d",
//       })

//       const { password, ...rest } = existUser._doc

//       return res
//         .cookie("token", token, {
//           httpOnly: true,
//           maxAge: 24 * 60 * 60 * 1000,
//         })
//         .status(200)
//         .json(rest)
//     }
//     const password = Math.floor(
//       Math.random() * 8000000000 + 8000000000
//     ).toString()
//     const bcryptjsPassword = bcryptjs.hashSync(password, 10)

//     const user = await User.create({
//       name,
//       email,
//       profilePic,
//       password: bcryptjsPassword,
//     })

//     const { password: abc, ...rest } = user._doc
//     const token = jwt.sign({ _id: existUser._id }, process.env.SECRETKEY, {
//       expiresIn: "1d",
//     })

//     return (
//       res,
//       cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
//         .status(200)
//         .json(rest)
//     )
//   } catch (e) {
//     console.log(`Error While GoogleAuth APi :${e}`)
//   }
// }

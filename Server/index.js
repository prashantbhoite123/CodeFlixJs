import express from "express"
import { databaseConnnection } from "./Data/Database.js"
import router from "./routes/user.routes.js"
import authRoute from "./routes/auth.routes.js"
import postRoute from "./routes/post.routes.js"
import commentRoute from "./routes/comment.routes.js"
import "dotenv/config"
import { errorMiddleware } from "./middlewares/error.middleware.js"
import cookieParser from "cookie-parser"
import path from "path"

const app = express()

// middleWare //
app.use(cookieParser())
app.use(express.json())
databaseConnnection()
// Routes//
const __dirname = path.resolve()

app.use("/api/user", router)
app.use("/api/auth", authRoute)
app.use("/api/post", postRoute)
app.use("/api/comment", commentRoute)

app.use(express.static(path.join(__dirname, "/client/dist")))
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"))
})

app.use(errorMiddleware)
app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}`)
})

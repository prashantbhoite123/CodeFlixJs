import mongoose from "mongoose"

export const databaseConnnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: "Mern_Blog" })
    .then(() => console.log(`Database Connected successfully`))
    .catch((e) => console.log(`Error While Database Connection :${e}`))
}

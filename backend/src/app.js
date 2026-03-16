import express from "express"
import routes from "./routes/index.js"
import cookieParser from "cookie-parser"
import { errorHandler } from "./middlewares/global.middleware.js"

const app = express()

app.use(express.json())

app.use(cookieParser())

app.use("/api", routes)

app.use(errorHandler)

app.use((req, res) => {
  return res.status(404).json({ message: "Route not found" })
})

export default app

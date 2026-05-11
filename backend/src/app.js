import express from "express"
import routes from "./routes/index.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { errorHandler } from "./middlewares/global.middleware.js"

const app = express()

app.use(cookieParser())
app.use(express.json())

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://installing-fitness-arranged-strap.trycloudflare.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

app.use("/api", routes)

app.use(errorHandler)

app.use((req, res) => {
  return res.status(404).json({ message: "Route not found" })
})

export default app

import express from "express"
import routes from "./routes/index.js"

const app = express()

app.use(express.json())

app.use("/api", routes)

app.use((req, res) => {
  return res.status(404).json({ message: "Route not found" })
})

export default app

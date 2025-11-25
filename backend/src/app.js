const express = require("express")
const routes = require("./routes/index")

const app = express()

app.use(express.json())

app.use("/api", routes)

app.use((req, res) => {
  return res.status(404).json({ message: "Route not found" })
})

module.exports = app

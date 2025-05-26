const connect = require('./connect.js') //fiecare require da run la acel file insane
const express = require('express')
const cors = require('cors')
const recipes = require('./recipesRoutes.js')
const users = require("./userRoutes.js")
const comments = require("./commentsRoutes.js")
const awsRoutes = require("./awsRoutes.js")
const multer = require("multer")
const upload = multer()

const app = express()

const PORT = 3000

app.use(cors())
app.use(express.json())

app.use(upload.any())
app.use(recipes)
app.use(users)
app.use(awsRoutes)
app.use(comments)

app.listen(PORT, () => {
    connect.connectToServer()
    console.log(`Server is running on port ${PORT}`)
})


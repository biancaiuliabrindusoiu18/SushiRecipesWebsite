const express = require("express")
const database = require("./connect.js")
const ObjectId = require("mongodb").ObjectId
const jwt = require("jsonwebtoken")
require("dotenv").config({ path: "./config.env" })

const commentRoutes = express.Router()

//CRUDs
//create one comment---post
commentRoutes.route("/comments").post(verifyToken, async (request, response) => {
  const db = database.getDb()

  const mongoObject = {
    recipeId: request.body.recipeId,
    userId: request.user._id,
    userName: request.user.name,
    comment: request.body.comment,
    dateCreated: new Date()
  }

  try {
    const data = await db.collection("comments").insertOne(mongoObject)
    response.json(data)
  } catch (error) {
    response.status(500).json({ error: "Failed to create comment" })
  }
})

//retrieve all comments for a recipe--get
//..../comments/recipe/1234
commentRoutes.route("/comments/recipe/:recipeId").get(verifyToken, async (request, response) => {
  const db = database.getDb()

  try {
    const data = await db
      .collection("comments")
      .find({ recipeId: request.params.recipeId })
      .sort({ dateCreated: -1 }) // newest first
      .toArray()

    response.json(data)
  } catch (error) {
    response.status(500).json({ error: "Failed to fetch comments" })
  }
})

//retrieve all comments--get
//..../comments
commentRoutes.route("/comments").get(verifyToken, async (request, response) => {
  const db = database.getDb()

  try {
    const data = await db.collection("comments").find({}).sort({ dateCreated: -1 }).toArray()

    if (data.length > 0) {
      response.json(data)
    } else {
      response.json([])
    }
  } catch (error) {
    response.status(500).json({ error: "Failed to fetch comments" })
  }
})

//retrieve one comment--get
//..../comments/1234
commentRoutes.route("/comments/:id").get(verifyToken, async (request, response) => {
  const db = database.getDb()

  try {
    const data = await db.collection("comments").findOne({ _id: new ObjectId(request.params.id) })

    if (data && Object.keys(data).length > 0) {
      response.json(data)
    } else {
      response.status(404).json({ error: "Comment not found" })
    }
  } catch (error) {
    response.status(500).json({ error: "Failed to fetch comment" })
  }
})

//update one comment---put
commentRoutes.route("/comments/:id").put(verifyToken, async (request, response) => {
  const db = database.getDb()

  try {
    // First check if the comment belongs to the user
    const existingComment = await db.collection("comments").findOne({ _id: new ObjectId(request.params.id) })

    if (!existingComment) {
      return response.status(404).json({ error: "Comment not found" })
    }

    if (existingComment.userId !== request.user._id) {
      return response.status(403).json({ error: "You can only edit your own comments" })
    }

    const mongoObject = {
      $set: {
        comment: request.body.comment,
        dateUpdated: new Date(),
      },
    }

    const data = await db.collection("comments").updateOne({ _id: new ObjectId(request.params.id) }, mongoObject)
    response.json(data)
  } catch (error) {
    response.status(500).json({ error: "Failed to update comment" })
  }
})

//delete one comment ---delete
commentRoutes.route("/comments/:id").delete(verifyToken, async (request, response) => {
  const db = database.getDb()

  try {
    // First check if the comment belongs to the user
    const existingComment = await db.collection("comments").findOne({ _id: new ObjectId(request.params.id) })

    if (!existingComment) {
      return response.status(404).json({ error: "Comment not found" })
    }

    if (existingComment.userId !== request.user._id) {
      return response.status(403).json({ error: "You can only delete your own comments" })
    }

    const data = await db.collection("comments").deleteOne({ _id: new ObjectId(request.params.id) })
    response.json(data)
  } catch (error) {
    response.status(500).json({ error: "Failed to delete comment" })
  }
})

function verifyToken(request, response, next) {
  const authHeader = request.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return response.status(401).json({ message: "token missing" })
  }

  jwt.verify(token, process.env.SECRETKEY, (error, user) => {
    if (error) {
      return response.status(403).json({ message: "token invalid" })
    }
    request.user = user
    next()
  })
}

module.exports = commentRoutes

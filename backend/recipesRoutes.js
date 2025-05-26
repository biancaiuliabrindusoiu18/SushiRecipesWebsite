const express = require('express');
const database = require('./connect.js')
const ObjectId = require('mongodb').ObjectId
const jwt = require('jsonwebtoken')
require('dotenv').config({path:"./config.env"});

let recipeRoutes = express.Router()


//CRUDs
//create one---post
recipeRoutes.route("/recipes").post( verifyToken,async (request, response)  => {
    let db=database.getDb()

    let ingredients = request.body.ingredients
  let instructions = request.body.instructions

  // ✨ Parsează stringurile JSON în array-uri
  if (typeof ingredients === "string") {
    try {
      ingredients = JSON.parse(ingredients)
    } catch {
      return response.status(400).json({ message: "Invalid ingredients format" })
    }
  }

  if (typeof instructions === "string") {
    try {
      instructions = JSON.parse(instructions)
    } catch {
      return response.status(400).json({ message: "Invalid instructions format" })
    }
  }

    let mongoObject = {
        title: request.body.title,
        instructions: request.body.instructions,
        ingredients: request.body.ingredients,
        author: request.user._id,
        dateCreated : request.body.dateCreated,
        timeNeeded: request.body.timeNeeded,
        imageID: request.body.imageID,
        faves: [],
    }
    let data = await db.collection("recipes").insertOne(mongoObject)
    response.json(data)
})

//retrieve all--get
//..../recipes
recipeRoutes.route("/recipes").get( verifyToken,async (request, response)  => {
    let db=database.getDb()
    let data = await db.collection("recipes").find({}).toArray()
    if(data.length >0){
        response.json(data)
    } else {
        throw new Error("No data found")
    }
})
//retrieve one--get
//..../recipes/1234
recipeRoutes.route("/recipes/:id").get( verifyToken, async (request, response)  => {
    let db=database.getDb()
    let data = await db.collection("recipes").findOne({_id:new ObjectId(request.params.id)})
    if(data && Object.keys(data).length >0){ //empty object
        response.json(data)
    } else {
        throw new Error("No data found")
    }
})

//update one---put
recipeRoutes.route("/recipes/:id").put( verifyToken,async (request, response)  => {
    let db=database.getDb()
    let mongoObject = {
        $set: {
        title: request.body.title,
        instructions: request.body.instructions,
        ingredients: request.body.ingredients,
        author: request.body.author,
        dateCreated : request.body.dateCreated,
        imageID: request.body.imageID,
        faves: request.body.faves,
        }
    }
    let data = await db.collection("recipes").updateOne({_id: new ObjectId(request.params.id)},mongoObject)
    response.json(data)
})

//delete one ---delete
recipeRoutes.route("/recipes/:id").delete( verifyToken, async (request, response)  => {
    let db=database.getDb()
    let data = await db.collection("recipes").deleteOne({_id:new ObjectId(request.params.id)})
    response.json(data)
})

function verifyToken(request, response, next) {
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] //ca sa iau ce e dupa bearer ptr ca split spatiu separa dupa spatiu
    if(!token){
        return response.status(401).json({message: "token missing"})
    }

    jwt.verify(token, process.env.SECRETKEY, (error, user)=> {
        if(error){
            return response.status(403).json({message: "token invalid"})
        }
        request.user = user
        next()
    })


}

// ADD/REMOVE from favorites
recipeRoutes.route("/recipes/:id/favorite").post(verifyToken, async (request, response) => {
  const db = database.getDb()
  const recipeId = request.params.id
  const userId = request.user._id

  try {
    const recipe = await db.collection("recipes").findOne({ _id: new ObjectId(recipeId) })

    if (!recipe) {
      return response.status(404).json({ message: "Recipe not found" })
    }

    const faves = recipe.faves || []
    const isFavorited = faves.includes(userId)

    console.log("Toggle favorite:", {
      recipeId,
      userId,
      currentFaves: faves,
      isFavorited,
    })

    let updateOperation
    if (isFavorited) {
      // Remove from favorites
      updateOperation = { $pull: { faves: userId } }
    } else {
      // Add to favorites
      updateOperation = { $addToSet: { faves: userId } }
    }

    const updateResult = await db.collection("recipes").updateOne({ _id: new ObjectId(recipeId) }, updateOperation)

    console.log("Update result:", updateResult)

    // Get updated recipe to return current faves
    const updatedRecipe = await db.collection("recipes").findOne({ _id: new ObjectId(recipeId) })

    response.json({
      success: true,
      isFavorited: !isFavorited,
      faves: updatedRecipe.faves || [],
      message: isFavorited ? "Removed from favorites" : "Added to favorites",
    })
  } catch (error) {
    console.error("Error updating favorites:", error)
    response.status(500).json({ message: "Failed to update favorites" })
  }
})

// GET user's favorite recipes
recipeRoutes.route("/recipes/favorites/user").get(verifyToken, async (request, response) => {
  const db = database.getDb()
  const userId = request.user._id

  try {
    const data = await db
      .collection("recipes")
      .find({
        faves: { $in: [userId] },
      })
      .toArray()

    response.json(data)
  } catch (error) {
    console.error("Error fetching favorites:", error)
    response.status(500).json({ message: "Failed to fetch favorites" })
  }
})



module.exports = recipeRoutes

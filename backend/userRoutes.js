const express = require('express');
const database = require('./connect.js')
const ObjectId = require('mongodb').ObjectId
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config({path:"./config.env"});

let userRoutes = express.Router()
const SALT_ROUNDS=10


//CRUDs
//create one---post
userRoutes.route("/users").post(async (request, response)  => {
    let db=database.getDb()

    const takenEmail = await db.collection("users").findOne({email: request.body.email})

    if(takenEmail) {
        response.json({message: "Email already taken"})
    } else {

        const hash =  await bcrypt.hashSync(request.body.password, SALT_ROUNDS)

        let mongoObject = {
            name: request.body.name,
            bio: request.body.bio,
            email: request.body.email,
            password: hash,
            joinDate: new Date(),
            posts : []
        }
        let data = await db.collection("users").insertOne(mongoObject)
        response.json(data)
    }
})

//retrieve all--get
//..../users
userRoutes.route("/users").get(async (request, response)  => {
    let db=database.getDb()
    let data = await db.collection("users").find({}).toArray()
    if(data.length >0){
        response.json(data)
    } else {
        throw new Error("No data found")
    }
})
//retrieve one--get
//..../users/1234
userRoutes.route("/users/:id").get(async (request, response)  => {
    let db=database.getDb()
    let data = await db.collection("users").findOne({_id:new ObjectId(request.params.id)})
    if(data && Object.keys(data).length >0){ //empty object
        response.json(data)
    } else {
        throw new Error("No data found")
    }
})

//update one---put
userRoutes.route("/users/:id").put(async (request, response)  => {
    let db=database.getDb()
    let mongoObject = {
        $set: {
        name: request.body.name,
        email: request.body.email,
        bio: request.body.bio,
        password: request.body.password,
        joinDate: request.body.joinDate,
        posts : request.body.posts
        }
    }
    let data = await db.collection("users").updateOne({_id: new ObjectId(request.params.id)},mongoObject)
    response.json(data)
})

//delete one ---delete
userRoutes.route("/users/:id").delete(async (request, response)  => {
    let db=database.getDb()
    let data = await db.collection("users").deleteOne({_id:new ObjectId(request.params.id)})
    response.json(data)
})


//login 
userRoutes.route("/users/login").post(async (request, response)  => {
    let db=database.getDb()

    const user = await db.collection("users").findOne({email: request.body.email})

    if(user){
        let confirmation = await bcrypt.compare(request.body.password, user.password)
        if(confirmation){
            const token = jwt.sign(user, process.env.SECRETKEY, {expiresIn: "1h"})
            response.json({success:true, token})
        } else {
            response.json({success:false, message: "Incorrect password"})
        }
    } else {
        response.json({success:false, message: "User not found"})
    }
})


  




module.exports = userRoutes

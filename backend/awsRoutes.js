const express = require('express');
const database = require('./connect.js')
const ObjectId = require('mongodb').ObjectId
const jwt = require('jsonwebtoken')
require('dotenv').config({path:"./config.env"});

const {S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3')

let awsRoutes = express.Router()
const s3Bucket = "blogstorageproiect"

const s3Client = new S3Client({
    region : "eu-north-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
})


//CRUDs
//create one---post
awsRoutes.route("/images").post(verifyToken, async (request, response)  => {
    const file=request.files[0]
    const bucketParams = {
        Bucket: s3Bucket,
        Key: file.originalname,
        Body: file.buffer
    }

    const data = await s3Client.send(new PutObjectCommand(bucketParams))

    response.json(data)
})


//retrieve one--get
//..../posts/1234
awsRoutes.route("/images/:id").get(verifyToken, async (request, response)  => {
    const id = request.params.id
    const bucketParams = {
        Bucket: s3Bucket,
        Key: id
    }

    const data = await s3Client.send(new GetObjectCommand(bucketParams))

    const contentType=data.ContentType
    const srcString = await data.Body.transformToString('base64')
    const imageSource = `data:${contentType};base64,${srcString}`


    response.json(imageSource)
})


//delete one ---delete



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

module.exports = awsRoutes

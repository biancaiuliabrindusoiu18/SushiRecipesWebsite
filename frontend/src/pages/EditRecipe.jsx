"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getRecipe, updateRecipe, getImage } from "../API.js"
import * as jwt_decode from "jwt-decode"

export function EditRecipe() {
  const [title, setTitle] = useState("")
  const [ingredients, setIngredients] = useState("")
  const [instructions, setInstructions] = useState("")
  const [timeNeeded, setTimeNeeded] = useState("")
  const [file, setFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [currentImageUrl, setCurrentImageUrl] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [recipe, setRecipe] = useState(null)

  const inputFile = useRef(null)
  const navigate = useNavigate()
  const params = useParams()
  const recipeId = params.id

  const MAX_FILE_SIZE = 1024 * 1024 * 5 // 5MB

  useEffect(() => {
    async function loadRecipe() {
      try {
        setPageLoading(true)
        const token = sessionStorage.getItem("User")

        if (!token) {
          setError("User not authenticated")
          navigate("/")
          return
        }

        const decodedUser = jwt_decode.jwtDecode(token)
        const recipeData = await getRecipe(recipeId)

        if (!recipeData) {
          setError("Recipe not found")
          return
        }

        // Check if user owns this recipe
        if (recipeData.author !== decodedUser._id) {
          setError("You can only edit your own recipes")
          return
        }

        setRecipe(recipeData)
        setTitle(recipeData.title || "")
        setTimeNeeded(recipeData.timeNeeded || "")

        // Handle ingredients
        if (Array.isArray(recipeData.ingredients)) {
          setIngredients(recipeData.ingredients.join(", "))
        } else if (typeof recipeData.ingredients === "string") {
          try {
            const parsed = JSON.parse(recipeData.ingredients)
            if (Array.isArray(parsed)) {
              setIngredients(parsed.join(", "))
            } else {
              setIngredients(recipeData.ingredients)
            }
          } catch {
            setIngredients(recipeData.ingredients)
          }
        }

        // Handle instructions
        if (Array.isArray(recipeData.instructions)) {
          setInstructions(recipeData.instructions.join("\n"))
        } else if (typeof recipeData.instructions === "string") {
          try {
            const parsed = JSON.parse(recipeData.instructions)
            if (Array.isArray(parsed)) {
              setInstructions(parsed.join("\n"))
            } else {
              setInstructions(recipeData.instructions)
            }
          } catch {
            setInstructions(recipeData.instructions)
          }
        }

        // Load existing image
        if (recipeData.imageID) {
          try {
            const imageData = await getImage(recipeData.imageID)
            if (imageData) {
              setCurrentImageUrl(imageData)
            }
          } catch (imgError) {
            console.error("Error loading current image:", imgError)
          }
        }
      } catch (err) {
        console.error("Error loading recipe:", err)
        setError("Failed to load recipe")
      } finally {
        setPageLoading(false)
      }
    }

    loadRecipe()
  }, [recipeId, navigate])

  async function handleSubmit(e) {
    e.preventDefault()

    if (!title || !ingredients || !instructions || !timeNeeded) {
      setError("Please fill in all fields")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const recipeData = {
        title: title,
        ingredients: ingredients.split(",").map((item) => item.trim()),
        instructions: instructions.split("\n").map((step) => step.trim()),
        timeNeeded: timeNeeded,
        author: recipe.author,
        likes: recipe.likes,
        dateCreated: recipe.dateCreated,
        imageID: recipe.imageID, // Keep existing imageID
        faves: recipe.faves || [],
      }

      // If new file is uploaded, handle it
      if (file) {
        recipeData.file = file
        recipeData.imageID = file.name // Update imageID to new file name
      }

      await updateRecipe(recipeId, recipeData)
      navigate("/profile")
    } catch (err) {
      setError("Error updating recipe. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
    if (fileExtension !== ".jpg" && fileExtension !== ".png" && fileExtension !== ".jpeg") {
      setError("Please upload a valid image file (jpg, png, jpeg)")
      inputFile.current.value = ""
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 5MB")
      inputFile.current.value = ""
      return
    }

    setFile(file)
    setError(null)

    // Create image preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  if (pageLoading) {
    return (
      <div className="edit-recipe-page">
        <div className="loading">
          <p>Loading recipe...</p>
        </div>
      </div>
    )
  }

  if (error && !recipe) {
    return (
      <div className="edit-recipe-page">
        <div className="error">
          <p>{error}</p>
          <button onClick={() => navigate("/profile")} className="submit-button">
            Back to Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="edit-recipe-page">
      <h1 className="page-title">Edit Recipe</h1>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-group">
          <label htmlFor="title">Recipe Title</label>
          <input
            id="title"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            maxLength={100}
            required
            placeholder="Enter a descriptive title for your sushi recipe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ingredients">Ingredients</label>
          <textarea
            id="ingredients"
            onChange={(e) => setIngredients(e.target.value)}
            value={ingredients}
            maxLength={1000}
            required
            placeholder="List ingredients separated by commas (e.g., 200g sushi rice, 100g fresh salmon, 4 nori sheets)"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Cooking Instructions</label>
          <textarea
            id="instructions"
            onChange={(e) => setInstructions(e.target.value)}
            value={instructions}
            maxLength={5000}
            required
            placeholder="Enter step-by-step instructions, with each step on a new line"
            rows="8"
          />
        </div>

        <div className="form-group">
          <label htmlFor="timeNeeded">Preparation Time (minutes)</label>
          <input
            id="timeNeeded"
            type="number"
            onChange={(e) => setTimeNeeded(e.target.value)}
            value={timeNeeded}
            min="1"
            required
            placeholder="How long does it take to prepare this recipe?"
          />
        </div>

        <div className="form-group">
          <label htmlFor="recipeImage">Recipe Image</label>
          <input
            id="recipeImage"
            type="file"
            onChange={handleFileUpload}
            ref={inputFile}
            accept="image/jpeg, image/png"
          />
          <p className="input-help">Upload a new image to replace the current one (max 5MB)</p>

          {/* Show current image or new preview */}
          {(imagePreview || currentImageUrl) && (
            <div className="image-preview">
              <img src={imagePreview || currentImageUrl || "/placeholder.svg"} alt="Recipe preview" />
              {imagePreview && <p className="preview-text">New image preview</p>}
              {!imagePreview && currentImageUrl && <p className="preview-text">Current image</p>}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate("/profile")} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Updating Recipe..." : "Update Recipe"}
          </button>
        </div>
      </form>
    </div>
  )
}

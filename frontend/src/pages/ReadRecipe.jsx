"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getRecipe, getImage, getUser } from "../API.js"
import axios from "axios"
import * as jwt_decode from "jwt-decode" 
import { Edit } from "lucide-react"
import { Comments } from "../components/Comments.jsx"
import { FavoriteButton} from "../components/FavoriteButton.jsx"



export function ReadRecipe() {
  const [recipe, setRecipe] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [user, setUser] = useState(null)

  const params = useParams()
  const navigate = useNavigate()
  const id = params.id

  const [loggedInUser, setLoggedInUser] = useState(null)

  useEffect(() => {
    const token = sessionStorage.getItem("User")
    if (token) {
      const decodedUser = jwt_decode.jwtDecode(token)
      setLoggedInUser(decodedUser)
    }
  }, [])


  useEffect(() => {
    async function loadRecipe() {
      try {
        const data = await getRecipe(id)
        console.log("Recipe loaded:", data)
        if (data) {
          setRecipe(data)

          // Check ownership
          try {
            const token = sessionStorage.getItem("User")
            if (token) {
              const decodedUser = jwt_decode.jwtDecode(token)
              console.log("Decoded user:", decodedUser)
              setIsOwner(data.author === decodedUser._id)
            } else {
              setIsOwner(false)
            }
          } catch (error) {
            console.error("Error checking ownership:", error)
            setIsOwner(false)
          }

          // Load image if any
          if (data.imageID) {
            try {
              const imageData = await getImage(data.imageID)
              console.log("Image loaded:")
              if (imageData) setImageUrl(imageData)
            } catch (imgError) {
              console.error("Error loading recipe image:", imgError)
            }
          }
        }
      } catch (err) {
        console.error("Error loading recipe:", err)
      }
    }
    loadRecipe()
    
  }, [id])

  useEffect(() => {
    if (recipe?.author) {
      async function loadUser() {
        try {
          const userData = await getUser(recipe.author)
          console.log("Author data loaded:", userData)
          if (userData) setUser(userData)
        } catch (error) {
          console.error("Error loading author:", error)
        }
      }
      

      loadUser()
      
    }
  }, [recipe])

  if (!recipe) {
    return (
      <div className="loading">
        <p>Loading recipe...</p>
      </div>
    )
  }

  
  const handleFavoriteChange = (recipeId, isFavorited, newFaves) => {
    console.log("handleFavoriteChange called:", {
      recipeId,
      isFavorited,
      newFaves,
      userId: user?._id,
    })

    // Update the recipe state with the new faves array from the server
    setRecipe((prevRecipe) => {
      if (!prevRecipe) return prevRecipe

      const updatedRecipe = {
        ...prevRecipe,
        faves: newFaves || prevRecipe.faves || [],
      }

      console.log("Updated recipe faves:", updatedRecipe.faves)
      return updatedRecipe
    })
  }

// Format the date
  const formattedDate = recipe?.dateCreated
    ? new Date(recipe.dateCreated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""

  const parseIngredients = (ingredients) => {
    if (Array.isArray(ingredients)) {
      return ingredients
    } else if (typeof ingredients === "string") {
      try {
        const parsed = JSON.parse(ingredients)
        return Array.isArray(parsed) ? parsed : ingredients.split(",").map((item) => item.trim())
      } catch (e) {
        return ingredients.split(",").map((item) => item.trim())
      }
    }
    return ["No ingredients listed"]
  }

  const parseInstructions = (instructions) => {
    if (Array.isArray(instructions)) {
      return instructions
    } else if (typeof instructions === "string") {
      try {
        const parsed = JSON.parse(instructions)
        return Array.isArray(parsed) ? parsed : instructions.split("\n").map((step) => step.trim())
      } catch (e) {
        return instructions.split("\n").map((step) => step.trim())
      }
    }
    return ["No instructions listed"]
  }

  return (
    <div className="recipe-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M12 19L5 12L12 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to recipes
      </button>
      <div className="recipe-actions-right">
            </div>
      {loggedInUser && recipe  && !isOwner && (
                  <FavoriteButton
                    user={loggedInUser}
                    recipe={recipe}
                    onFavoriteChange={(recipeId, isFavorited, updatedFaves) => {
                      setRecipe(prev => ({
                        ...prev,
                        faves: updatedFaves,
                      }))
                    }}
                  />
                )}
      <div className="recipe-detail-header">
        <h1>{recipe.title}</h1>
        
        {isOwner && (
          <Link to={`/editrecipe/${recipe._id}`} className="edit-button">
            <Edit size={16} />
            Edit Recipe
          </Link>
        )}

        <div className="recipe-detail-image">
          <img src={imageUrl || "/placeholder.svg?height=400&width=800"} alt={recipe.title || "Recipe image"} />
        </div>

        <div className="recipe-author-info">
          <p className="author-name">By {isOwner ? "me" : user?.name || "Chef"}</p>
          {user?.bio && <p className="author-bio">About: {user.bio}</p>}
        </div>

        <div className="recipe-detail-meta">
          <span>Preparation time: {recipe.timeNeeded || "30"} minutes</span>
          <span>Created: {formattedDate}</span>
        </div>
        
      </div>

      <div className="recipe-detail-section">
        <h3>Ingredients</h3>
        <ul className="ingredients-list">
          {parseIngredients(recipe.ingredients).map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>

      <div className="recipe-detail-section">
        <h3>Instructions</h3>
        <ol className="instructions-list">
          {parseInstructions(recipe.instructions).map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
          <div className="recipe-detail-section">
            <Comments recipeId={recipe._id} recipe={recipe} />
          </div>
    </div>
  )
}

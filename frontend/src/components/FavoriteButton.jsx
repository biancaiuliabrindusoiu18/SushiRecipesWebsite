"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { toggleFavorite } from "../API.js"
import * as jwt_decode from "jwt-decode"



export function FavoriteButton({ user,recipe, onFavoriteChange }) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    if (user && recipe) {
      const faves = recipe.faves || []
      // Convert both to strings for comparison since MongoDB might return different types
      const favorited = faves.some((faveId) => String(faveId) === String(user._id))

      console.log("FavoriteButton useEffect:", {
        userId: user._id,
        userIdType: typeof user._id,
        recipeFaves: faves,
        favesTypes: faves.map((f) => typeof f),
        isFavorited: favorited,
        recipeId: recipe._id,
      })

      setIsFavorited(favorited)
    } else {
      setIsFavorited(false)
    }
  }, [user, recipe, recipe?.faves])

  const handleToggleFavorite = async (e) => {
    e.preventDefault() // Prevent navigation if button is inside a link
    e.stopPropagation()

    if (!user) {
      alert("Please log in to add favorites")
      return
    }

    try {
      setIsLoading(true)
      console.log("Toggling favorite for recipe:", recipe._id)

      const response = await toggleFavorite(recipe._id)
      console.log("Toggle response:", response)

      if (response.success) {
        setIsFavorited(response.isFavorited)
        console.log("Updated isFavorited to:", response.isFavorited)

        // Call callback if provided (for updating parent components)
        if (onFavoriteChange) {
          onFavoriteChange(recipe._id, response.isFavorited, response.faves)
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      alert("Failed to update favorite. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null // Don't show favorite button if user is not logged in
  }

  console.log("Rendering FavoriteButton:", {
    isFavorited,
    isLoading,
    recipeId: recipe?._id,
    userId: user?._id,
  })

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`favorite-button ${isFavorited ? "favorited" : ""} ${isLoading ? "loading" : ""}`}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart size={20} fill={isFavorited ? "currentColor" : "none"} className="heart-icon" />
    </button>
  )
}

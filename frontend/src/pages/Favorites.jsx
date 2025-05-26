"use client"

import { useEffect, useState } from "react"
import { getFavoriteRecipes } from "../API.js"
import { RecipeCard } from "../components/RecipeCard.jsx"
import { Heart } from "lucide-react"

export function Favorites() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadFavoriteRecipes() {
      try {
        setLoading(true)
        const data = await getFavoriteRecipes()

        if (data && data.length > 0) {
          // Sort by date added to favorites (newest first)
          data.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
          setFavoriteRecipes(data)
        } else {
          setFavoriteRecipes([])
        }
      } catch (err) {
        console.error("Error loading favorite recipes:", err)
        setError("Failed to load favorite recipes. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadFavoriteRecipes()
  }, [])

  return (
    <div className="favorites-page">
      <div className="page-header">
        <h1 className="page-title">
          <Heart size={32} className="heart-icon" />
          My Favorite Recipes
        </h1>
        <p className="page-subtitle">Your collection of beloved sushi recipes</p>
      </div>

      {loading && (
        <div className="loading">
          <p>Loading your favorite recipes...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && favoriteRecipes.length === 0 && (
        <div className="no-favorites">
          <Heart size={64} className="empty-heart" />
          <h3>No favorite recipes yet</h3>
          <p>Start exploring recipes and add them to your favorites by clicking the heart icon!</p>
        </div>
      )}

      {!loading && !error && favoriteRecipes.length > 0 && (
        <>
          <div className="favorites-stats">
            <p>
              You have {favoriteRecipes.length} favorite recipe{favoriteRecipes.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="recipes-container">
            {favoriteRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

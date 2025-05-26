
"use client"

import { useState, useEffect } from "react"
import { getRecipes } from "../API.js"
import { RecipeCard } from "../components/RecipeCard"
import * as jwt_decode from "jwt-decode"

export function Profile() {
  const [recipes, setRecipes] = useState([])
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true)
        const token = sessionStorage.getItem("User")

        if (!token) {
          setError("User not authenticated")
          return
        }

        const decodedUser = jwt_decode.jwtDecode(token)
        setUser(decodedUser)

        const allRecipes = await getRecipes()
        if (allRecipes && allRecipes.length > 0) {
          const filteredRecipes = allRecipes.filter((recipe) => recipe.author === decodedUser._id)
          setRecipes(filteredRecipes)
        } else {
          setRecipes([])
        }
      } catch (err) {
        console.error("Error loading profile data:", err)
        setError("Failed to load profile data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  // Format join date
  const joinDate = user.joinDate
    ? new Date(user.joinDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A"

  return (
    <div className="profile-page">
      <h1 className="page-title">My Profile</h1>

      {loading && (
        <div className="loading">
          <p>Loading profile...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="profile-header">
            <div className="profile-info">
              <div className="profile-field">
                <div className="profile-field-label">Name</div>
                <div className="profile-field-value">{user.name || "N/A"}</div>
              </div>

              <div className="profile-field">
                <div className="profile-field-label">Email</div>
                <div className="profile-field-value">{user.email || "N/A"}</div>
              </div>

              <div className="profile-field">
                <div className="profile-field-label">Bio</div>
                <div className="profile-field-value">{user.bio || "No bio provided"}</div>
              </div>

              <div className="profile-field">
                <div className="profile-field-label">Joined</div>
                <div className="profile-field-value">{joinDate}</div>
              </div>
            </div>
          </div>

          <div className="profile-recipes">
            <h2>My Recipes</h2>

            {recipes.length === 0 ? (
              <p>You haven't created any recipes yet.</p>
            ) : (
              <div className="recipes-container">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

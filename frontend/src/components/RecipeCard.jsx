
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getImage, getUser } from "../API.js"; // Asigură-te că ai importat funcția getUser
import {Edit} from "lucide-react";
import * as jwt_decode from "jwt-decode";

export function RecipeCard({ recipe }) {
  const [imageUrl, setImageUrl] = useState("/placeholder.svg?height=200&width=300");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Adăugăm starea pentru utilizator
  const [isOwner, setIsOwner] = useState(false); // Stare pentru a verifica dacă utilizatorul curent deține rețeta

  useEffect(() => {
    async function loadImage() {
      if (recipe.imageID) {
        try {
          const imageData = await getImage(recipe.imageID);
          if (imageData) {
            setImageUrl(imageData);
          }
        } catch (error) {
          console.error("Error loading image:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    async function loadUser() {
      const userData = await getUser(recipe.author); // Apelezi funcția getUser cu ID-ul utilizatorului
      if (userData) {
        setUser(userData);
      }
    }

    // Check if current user owns this recipe
    function checkOwnership() {
      try {
        const token = sessionStorage.getItem("User")
        if (token) {
          const decodedUser = jwt_decode.jwtDecode(token)
          setIsOwner(recipe.author === decodedUser._id)
        }
      } catch (error) {
        console.error("Error checking ownership:", error)
      }
    }

    loadImage();
    loadUser(); // Încarci utilizatorul după ce componentele s-au montat
    checkOwnership(); // Verifici dacă utilizatorul curent deține rețeta
  }, [recipe]);

  const date = new Date(recipe.dateCreated);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="recipe-card">
      <div className="recipe-image">
        {loading ? (
          <div className="image-loading">Loading...</div>
        ) : (
          <img src={imageUrl || "/placeholder.svg"} alt={recipe.title} />
        )}
      </div>
      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.title}</h3>
        <div className="recipe-meta">
          <span>{recipe.timeNeeded || "30"} min</span>
          <span>{formattedDate}</span>
        </div>
        <div className="recipe-footer">
          <span className="recipe-author">
            By {isOwner ? "me" : user ? user.name : "Chef"}
          </span>
          <Link to={`/readrecipe/${recipe._id}`} className="view-recipe">
            View Recipe
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M12 5L19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}


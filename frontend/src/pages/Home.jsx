import {getRecipes} from "../API.js";
import {getImage} from "../API.js";

import { useEffect, useState } from "react";

import { RecipeCard } from "../components/RecipeCard.jsx";
import { ImageSlider } from "../components/imageSlider.jsx";

import {Link} from "react-router-dom";

export function Home() {

    const[recipes, setRecipes] = useState([]);
    const [sliderImages, setSliderImages] = useState([])

    useEffect(() => {
    async function loadAllPosts() {
        const data = await getRecipes();
        console.log("Fetched recipes:", data);

        data.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
        setRecipes(data);

        const imagePromises = data
            .slice(0, 5)
            .filter((recipe) => recipe.imageID)
            .map(async (recipe) => {
                try {
                    console.log("Fetching image for ID:", recipe.imageID);
                    const imageData = await getImage(recipe.imageID);
                    console.log("Image data for ID", recipe.imageID, "=>", imageData);
                    return imageData;
                } catch (error) {
                    console.error("Error loading slider image:", error);
                    return null;
                }
            });

        const images = await Promise.all(imagePromises);
        console.log("All fetched images:", images);

        const validImages = images.filter((img) => img !== null);
        console.log("Valid images:", validImages);

        setSliderImages(validImages);
    }

    loadAllPosts();
}, []);


  // Slider data
    
  return (
    <div className="home-page">
       <ImageSlider images={sliderImages} autoPlay={true} autoPlayInterval={6000} />
          {/* <h1 className="hero-title">Discover the Art of Sushi Making</h1>
          <p className="hero-subtitle">
            Explore authentic Japanese sushi recipes, from traditional maki to creative fusion rolls. Learn techniques
            from master chefs and create restaurant-quality sushi at home.
          </p>
          <Link to="/createrecipe" className="hero-button">
            Share your recipe with the world
          </Link> */}
      

      <h2 className="section-title">Featured Recipes</h2>


      {recipes.length === 0 && (
        <div className="no-recipes">
          <p>No recipes found. Be the first to create a recipe!</p>
        </div>
      )}
        {recipes.length > 0 && (
        <div className="recipes-container">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
        )}
    </div>
  )
}


import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { createRecipe } from "../API.js"

export function CreateRecipe() {
  const [title, setTitle] = useState("")
  const [ingredients, setIngredients] = useState("")
  const [instructions, setInstructions] = useState("")
  const [timeNeeded, setTimeNeeded] = useState("")
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)

  const inputFile = useRef(null)
  const navigate = useNavigate()

  const MAX_FILE_SIZE = 1024 * 1024 * 5 // 5MB

  async function handleSubmit(e) {
    e.preventDefault()

    try {
        const recipeData = {
            title: title,
            ingredients: ingredients.split(",").map(item => item.trim()), //  split pe virgulă
            instructions: instructions.split("\n").map(step => step.trim()), //  split pe linii
            timeNeeded: timeNeeded,
            author: null,
           // likes:0,
            dateCreated: new Date(),
            file: file,
          }
          

      await createRecipe(recipeData)
      navigate("/profile")
    } catch (err) {
      setError("Error creating recipe. Please try again.")
      console.error(err)
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
    if (fileExtension !== ".jpg" && fileExtension !== ".png" && fileExtension !== ".jpeg") {
      setError("Please upload a valid image file (jpg, png, jpeg)")
      inputFile.current.value = ""
      inputFile.current.type = "file"
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 5MB")
      inputFile.current.value = ""
      inputFile.current.type = "file"
      return
    }

    setFile(file)
    setError(null)
  }

  return (
    <div className="create-recipe-page">
      <h1>Create New Recipe</h1>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-group">
          <label>Recipe Title:</label>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
            name="title"
            placeholder="Enter recipe title"
          />
        </div>

        <div className="form-group">
          <label>Ingredients:</label>
          <textarea
            onChange={(e) => setIngredients(e.target.value)}
            maxLength={1000}
            required
            name="ingredients"
            placeholder="Enter ingredients -200g salmon-(separated by commas)"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Cooking Instructions:</label>
          <textarea
            onChange={(e) => setInstructions(e.target.value)}
            maxLength={5000}
            required
            name="instructions"
            placeholder="Enter cooking instructions (separated by new lines)"
            rows="10"
          />
        </div>

        <div className="form-group">
          <label>Time Needed (minutes):</label>
          <input
            type="number"
            onChange={(e) => setTimeNeeded(e.target.value)}
            min="1"
            required
            name="timeNeeded"
            placeholder="Enter time needed in minutes"
          />
        </div>

        <div className="form-group">
          <label>Recipe Image:</label>
          <input type="file" onChange={handleFileUpload} ref={inputFile}  />
        </div>

        <button type="submit" className="submit-button">
          Create Recipe
        </button>
      </form>
    </div>
  )
}



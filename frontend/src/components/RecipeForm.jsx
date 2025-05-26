"use client"

import { useState } from "react"

function RecipeForm({ recipe, onSubmit, isEditing = false }) {
  const [formData, setFormData] = useState({
    title: recipe?.title || "",
    ingredients: recipe?.ingredients || "",
    instructions: recipe?.instructions || "",
    timeNeeded: recipe?.timeNeeded || "",
    image: null,
    imagePreview: recipe?.image || "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.ingredients.trim()) {
      newErrors.ingredients = "Ingredients are required"
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = "Instructions are required"
    }

    if (!formData.timeNeeded) {
      newErrors.timeNeeded = "Time needed is required"
    } else if (isNaN(formData.timeNeeded) || formData.timeNeeded <= 0) {
      newErrors.timeNeeded = "Time must be a positive number"
    }

    if (!isEditing && !formData.image) {
      newErrors.image = "Image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(formData)
      // Reset form if it's not editing
      if (!isEditing) {
        setFormData({
          title: "",
          ingredients: "",
          instructions: "",
          timeNeeded: "",
          image: null,
          imagePreview: "",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter recipe title"
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="ingredients">Ingredients</label>
        <textarea
          id="ingredients"
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          placeholder="Enter ingredients (separated by commas)"
          rows="4"
        />
        {errors.ingredients && <span className="error">{errors.ingredients}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          placeholder="Enter cooking instructions"
          rows="6"
        />
        {errors.instructions && <span className="error">{errors.instructions}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="timeNeeded">Time Needed (minutes)</label>
        <input
          type="number"
          id="timeNeeded"
          name="timeNeeded"
          value={formData.timeNeeded}
          onChange={handleChange}
          placeholder="Enter time needed in minutes"
          min="1"
        />
        {errors.timeNeeded && <span className="error">{errors.timeNeeded}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="image">Recipe Image</label>
        <input type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" />
        {errors.image && <span className="error">{errors.image}</span>}

        {formData.imagePreview && (
          <div className="image-preview">
            <img src={formData.imagePreview || "/placeholder.svg"} alt="Recipe preview" />
          </div>
        )}
      </div>

      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : isEditing ? "Update Recipe" : "Create Recipe"}
      </button>
    </form>
  )
}

export default RecipeForm

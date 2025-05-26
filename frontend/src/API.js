import axios from 'axios';

const url = 'http://localhost:3000';

export async function getRecipes() {

    const token = sessionStorage.getItem("User")
    const response = await axios.get(`${url}/recipes`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if(response.status === 200) {
        return response.data
    } else {
        return
    }
}

// export async function getRecipe(id) {

//     const response = await axios.get(`${url}/recipes/${id}`)

//     const recipe = response.data
//     const data = await getImage(response.data.imageID)
    
//     recipe.image=data
//     return recipe
// }

export async function getRecipe(id) {
    const token = sessionStorage.getItem("User")
    const response = await axios.get(`${url}/recipes/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const recipe = response.data
    const data = await getImage(response.data.imageID)
    
    recipe.image = data
    return recipe
}

export async function createRecipe(recipe) {

    const data = createImage(recipe.file)
    const imageID = recipe.file.name

    recipe.imageID=imageID

    const response = await axios.post(`${url}/recipes`, recipe)
    return response
}

export async function updateRecipe(id, recipe) {
    const response = await axios.put(`${url}/recipes/${id}`, recipe)
    return response
}

export async function deleteRecipe(id) {
    const response = await axios.delete(`${url}/recipes/${id}`)
    return response
}


//users

export async function getUser(id) {
    const response = await axios.get(`${url}/users/${id}`)
    if(response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function createUser(user) {
    const response = await axios.post(`${url}/users`, user)
    return response
}

export async function updateUser(id, user) {
    const response = await axios.put(`${url}/users/${id}`, user)
    return response
}

//auth
export async function verifyUser(user) {
    const response = await axios.post(`${url}/users/login`, user)
    if(response.data.success) {
        return response.data.token
    } else {
        return
    }
}


//images

export async function createImage(file){
    const formData = new FormData()
    formData.append('image', file)
    const response = await axios.post(`${url}/images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

    return response 
}

export async function getImage(id){
    const response = await axios.get(`${url}/images/${id}`)
    return response.data
}


//comments
export async function getComments(recipeId) {
  const token = sessionStorage.getItem("User")

  try {
    const response = await axios.get(`${url}/comments/recipe/${recipeId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error("Error fetching comments:", error)
  }

  return []
}

export async function createComment(comment) {
  const token = sessionStorage.getItem("User")

  try {
    const response = await axios.post(`${url}/comments`, comment, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    console.error("Error creating comment:", error)
    throw error
  }
}

export async function updateComment(id, comment) {
  const token = sessionStorage.getItem("User")

  try {
    const response = await axios.put(`${url}/comments/${id}`, comment, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    console.error("Error updating comment:", error)
    throw error
  }
}

export async function deleteComment(id) {
  const token = sessionStorage.getItem("User")

  try {
    const response = await axios.delete(`${url}/comments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    console.error("Error deleting comment:", error)
    throw error
  }
}


//favorites
export async function toggleFavorite(recipeId) {
  try {
    const response = await axios.post(`${url}/recipes/${recipeId}/favorite`)
    return response.data
  } catch (error) {
    console.error("Error toggling favorite:", error)
    throw error
  }
}

export async function getFavoriteRecipes() {
  try {
    const response = await axios.get(`${url}/recipes/favorites/user`)
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error("Error fetching favorite recipes:", error)
  }
  return []
}

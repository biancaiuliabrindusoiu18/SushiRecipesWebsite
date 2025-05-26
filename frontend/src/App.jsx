import { useState, useEffect} from 'react'
import './App.css'
import axios from 'axios'


import { Landing } from './pages/Landing.jsx'
import { Home } from './pages/Home.jsx'
import { CreateRecipe } from './pages/CreateRecipe.jsx'
import { ReadRecipe } from './pages/ReadRecipe.jsx'
import { Profile } from './pages/Profile.jsx'
import { EditRecipe } from './pages/EditRecipe.jsx'
import { Favorites } from './pages/Favorites.jsx'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


import { Layout } from './components/Layout'


function App() {
  
  //const [posts, setPosts] =useState()
  useEffect(() => {
    let token = sessionStorage.getItem("User")
    if(token){
      axios.defaults.headers.common['authorization'] = `Bearer ${token}`
    }
  }, [])

  
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Landing />} /> //ca sa fie direct directati aici
        <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
             <Route path="/favorites" element={<Favorites />} />
            <Route path="/createrecipe" element={<CreateRecipe />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/readrecipe/:id" element={<ReadRecipe />} />
            <Route path="/editrecipe/:id" element={<EditRecipe />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
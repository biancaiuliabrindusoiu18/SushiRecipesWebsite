import {verifyUser} from '../API.js'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

export function LogIn(){

    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const navigate =useNavigate()

    function handleChange(e){
        setUser({ 
            ...user, [e.target.name]: e.target.value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
       // console.log("Sending user:", user)
        let response = await verifyUser(user)
        //console.log(response)
        if(response){
            //console.log("User logged in successfully")
            navigate("/home")
            sessionStorage.setItem("User", response)
            axios.defaults.headers.common['authorization'] = `Bearer ${response}`
        }
        else{
            alert("login failed")
        }
    }

//     return(
//         <form onSubmit ={handleSubmit} className ="flex flex-col">
//             <input placeholder={"Email"} onChange={handleChange} name="email" required maxlenght={40} className="mb-4"/>
//             <input placeholder ={"Password"} onChange={handleChange} name="password" type="password" required maxlenght={20} className="mb-4"/>
//             <button type="submit" className="mb-4">Log in</button>
//         </form>
//     )
// }
return (
    <form onSubmit={handleSubmit}>

      <div className="form-group">
        <input type="email" placeholder="Email" onChange={handleChange} name="email" required maxLength={40} />
      </div>

      <div className="form-group">
        <input type="password" placeholder="Password" onChange={handleChange} name="password" required maxLength={20} />
      </div>

      <button type="submit" className="submit-button">
        Log In
      </button>
    </form>
  )
}

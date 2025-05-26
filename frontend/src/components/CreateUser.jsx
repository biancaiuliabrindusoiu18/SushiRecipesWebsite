import {createUser} from '../API.js'
import { useState } from 'react'

export function CreateUser(){

    const [user, setUser] = useState({
        name: "",
        bio: "",
        email: "",
        password: ""
    })

    function handleChange(e){
        setUser({ 
            ...user, [e.target.name]: e.target.value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
       // console.log("Sending user:", user)
        let response = await createUser(user)

        if (response.status === 200) {
            console.log("User created successfully")
            alert("User account created succesfully-go to login")
        } else {
            alert("User account could not be created")
        }
    }

//     return(
//         <form onSubmit ={handleSubmit} className="flex flex-col">
//             <input placeholder={"Name"} onChange={handleChange} name="name" required maxlenght={20} className="mb-2"/>
//             <input placeholder={"Bio"} onChange={handleChange} name="bio" required maxlenght={20} className="mb-2"/>
//             <input placeholder={"Email"} onChange={handleChange} name="email" required maxlenght={40}className="mb-2"/>
//             <input placeholder ={"Password"} onChange={handleChange} name="password" type="password" required maxlenght={20}className="mb-2"/>
//             <button type="submit" className="mb-2">Create Account</button>
//         </form>
//     )
// }
return (
    <form onSubmit={handleSubmit}>

      <div className="form-group">
        <input
          type="text"
          placeholder="Name"
          value={user.name}
          onChange={handleChange}
          name="name"
          required
          maxLength={20}
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Bio (Tell us about yourself)"
          value={user.bio}
          onChange={handleChange}
          name="bio"
          required
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          name="email"
          required
          maxLength={40}
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          name="password"
          required
          maxLength={20}
        />
      </div>

      <button type="submit" className="submit-button">
        Create Account
      </button>
    </form>
  )
}
// import {CreateUser} from '../components/CreateUser.jsx'
// import { LogIn } from '../components/LogIn.jsx';
// import { useState } from 'react'



// export function Landing() {

//     //view=0---login
//     //view=1---create user

//     const [view, setView] = useState(0)

//     return (
//         <div className="flex justify-center items-center w-screen h-screen">
//             {!view? 
//             <div className="flex flex-col w-96">
//                 <LogIn/> 
//                 <button onClick={()=> setView(!view)}> Create new account</button>
//             </div>: 
//             <div className="flex flex-col w-96">
//                 <CreateUser/>
//                 <button onClick={()=> setView(!view)}> Already have an account</button>
//             </div>}
//         </div>
//     );
// }

"use client"

import { useState } from "react"
import { CreateUser } from "../components/CreateUser.jsx"
import { LogIn } from "../components/LogIn.jsx"
import { SushiLogo } from "../components/SushiLogo"

export function Landing() {
  const [view, setView] = useState(0)

  return (
    <div className="landing-page">
      <div className="auth-container">
      <div className="navbar-logo" style={{ justifyContent: "center", marginBottom: "1.5rem" }}>
          <SushiLogo />
          <h1>SushiMaster</h1>
        </div>

        <h2>{view ? "Create Account" : "Login / Sign Up"}</h2>

        {!view ? (
          <div className="auth-form">
            <LogIn />
            <div className="auth-switch">
              <p>
                Don't have an account? <button onClick={() => setView(1)}>Sign up</button>
              </p>
            </div>
          </div>
        ) : (
          <div className="auth-form">
            <CreateUser />
            <div className="auth-switch">
              <p>
                Already have an account? <button onClick={() => setView(0)}>Log in</button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


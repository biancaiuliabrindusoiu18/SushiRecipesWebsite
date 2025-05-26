
// import { Link, useLocation } from "react-router-dom"
// import { pageData } from "./pageData";
// import { useNavigate } from "react-router-dom";

// export function Navbar({ user, onLogout }) {
    
//   const location = useLocation()
//   const navigate = useNavigate()

//   function handleLogout(){
//     sessionStorage.removeItem("User")
//     navigate("/")
// }

//   return (
//     <nav className="navbar">
//       <div className="navbar-logo">
//         <h1>Sushi Recipes</h1>
//       </div>

//       <div className="navbar-links">
//         <Link to="/home" className={location.pathname === "/home" ? "active" : ""}>
//           Home
//         </Link>
//         <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
//           Profile
//         </Link>
//         {/* <Link to="/favorites" className={location.pathname === "/favorites" ? "active" : ""}>
//           Favorites
//         </Link> */}
//         <Link to="/createrecipe" className={location.pathname === "/createrecipe" ? "active" : ""}>
//           Create Recipe
//         </Link>
//       </div>

//       <div className="navbar-user">
//         <button onClick={handleLogout} className="logout-btn">
//           Logout
//         </button>
//       </div>
//     </nav>
//   )
// }



import { Link, useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { SushiLogo } from "./SushiLogo"

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    sessionStorage.removeItem("User")
    navigate("/")
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <SushiLogo />
        <h1>SushiMaster</h1>
      </div>

      <div className="navbar-links">
        <Link to="/home" className={location.pathname === "/home" ? "active" : ""}>
          Home
        </Link>
        <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
          Profile
        </Link>
         <Link to="/favorites" className={location.pathname === "/favorites" ? "active" : ""}>
          Favorites
        </Link>
        <Link to="/createrecipe" className={location.pathname === "/createrecipe" ? "active" : ""}>
          Create Recipe
        </Link>
      </div>

      <div className="navbar-user">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  )
}


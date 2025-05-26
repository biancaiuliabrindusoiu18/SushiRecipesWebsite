import {Navbar} from "./Navbar.jsx";
import {Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";



export function Layout() {

    let user=sessionStorage.getItem("User")
    const navigate = useNavigate()

    useEffect(() => {
        if(!user){
            navigate("/")
        }
    }, [user])


    return (
        <>
            <Navbar />
            <main className="flex w-screen justify-center mt-60">
             <Outlet />
            </main>
           
        </>
    );
}
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { LoginContext } from "../context/Logincontext";
const Navbar = ({ islogin }) => {
  const navigate = useNavigate();
  const { setIslogin ,setDark } = useContext(LoginContext)
  const { dark } = useContext(LoginContext)
  const [menuOpen, setMenuOpen] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("notejwt");
    //!!token → true if a token exists
    // !!null → false if there is no token
    setIslogin(!!token); // Convert token to boolean
  }, []);



  const handleSignOut = () => {
    localStorage.removeItem("notejwt");
    localStorage.removeItem("noteuser");
    setIslogin(false);
    navigate("/login");
  };

  return (
    <nav className={` p-4 ${dark ? "bg-yellow-400 text-gray-900 hover:text-black" : "bg-gray-800 text-white"}`}>
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/">NoteApp</Link>
        </h1>

        <button
          className="lg:hidden block focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* theme */}
        {dark ? (<span className="material-symbols-outlined cursor-pointer items-center" onClick={() => setDark(false)}>
          dark_mode
        </span>) : (<span className="material-symbols-outlined cursor-pointer items-center" onClick={()=> setDark(true)}>
          light_mode
        </span>)}

        <ul
          className={`lg:flex lg:space-x-4 absolute lg:static ${dark ? "bg-yellow-400 text-gray-900" : "bg-gray-800 text-white"} w-full left-0 top-14 lg:w-auto lg:opacity-100 transition-opacity ${menuOpen ? "opacity-100" : "opacity-0 lg:opacity-100 hidden lg:flex"
            }`}
        >
          {islogin ? (
            <>
              <li>
                <Link to="/" className="block p-2 hover:text-gray-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/create-note" className="block p-2 hover:text-gray-500">
                  Create Note
                </Link>
              </li>
              <li>
                <Link to="/my-note" className="block p-2 hover:text-gray-500">
                  My Note
                </Link>
              </li>
              <li>
                <button
                  onClick={handleSignOut}
                  className="block p-2 hover:text-gray-500"
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/registration" className="block p-2 hover:text-gray-500">
                  Registration
                </Link>
              </li>
              <li>
                <Link to="/login" className="block p-2 hover:text-gray-500">
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

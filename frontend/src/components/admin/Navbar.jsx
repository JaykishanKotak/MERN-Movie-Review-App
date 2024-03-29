import React from "react";
import { Link, NavLink } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BiMoviePlay } from "react-icons/bi";
import { FaUserNinja } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useAuth, useTheme } from "../../hooks";

const Navbar = () => {
  const { handleLogout } = useAuth();

  return (
    <nav className="w-48 min-h-screen bg-secondary border-r border-gray-300 ">
      <div className="flex flex-col justify-between pl-5 sticky top-0 h-screen">
        <ul>
          <li className="mb-8">
            <Link to="/">
              <img src="./logo.png" alt="logo" className="h-14 p-2" />
            </Link>
          </li>
          <li>
            <NavItem to="/">
              {" "}
              <AiOutlineHome />
              <span>Home</span>
            </NavItem>
          </li>
          <li>
            <NavItem to="/movies">
              <BiMoviePlay /> <span>Movies</span>{" "}
            </NavItem>
          </li>
          <li>
            <NavItem to="/actors">
              {" "}
              <FaUserNinja />
              <span>Actors</span>
            </NavItem>
          </li>
        </ul>
        <div className="flex flex-col items-start p-5">
          <span className="font-semibold text-white text-xl">Admin</span>
          <button
            className="flex items-center text-dark-subtle text-sm hover:text-white transition space-x-1"
            onClick={handleLogout}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

const NavItem = ({ children, to }) => {
  {
    /* we can use functions inside classnName in Navlink but not in Link*/
  }
  const commonClasses =
    " flex items-center text-lg space-x-2 p-2 hover:opacity-80";
  return (
    <NavLink
      className={({ isActive }) =>
        (isActive ? "text-white" : "text-gray-400") + commonClasses
      }
      to={to}
    >
      {children}
    </NavLink>
  );
};

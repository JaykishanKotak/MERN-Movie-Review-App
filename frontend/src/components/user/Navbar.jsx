import React from "react";
import { BsFillSunFill } from "react-icons/bs";
import Container from "../Container";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useTheme } from "../../hooks";
import AppSearchForm from "../form/AppSearchForm.jsx";

const Navbar = () => {
  const { toggleTheme } = useTheme();

  const { authInfo, handleLogout } = useAuth();

  const { isLoggedIn } = authInfo;

  const naviagte = useNavigate();
  const handleSearchSubmit = (query) => {
    if (!query.trim()) {
      return;
    }
    naviagte("/movie/search?title=" + query);
  };
  return (
    <div className="bg-secondary shadow-sm shadow-gray-500">
      <Container className="p-2">
        <div className="flex justify-between items-center">
          <Link to="/">
            <img src="./logo.png" alt="" className="h-8 sm:h-10" />
          </Link>

          <ul className="flex items-center sm:space-x-4 space-x-2 ">
            <li>
              <button
                onClick={toggleTheme}
                className="dark:bg-white bg-dark-subtle p-1 rounded sm:text-2xl text-lg"
              >
                <BsFillSunFill className="text-secondary" />
              </button>
            </li>
            <li>
              {/* <input
                type="text"
                className="border-2 border-dark-subtle p-1 rounded bg-transparent text-xl outline-none focus:border-white transition text-white"
                placeholder="....Search Here"
              />*/}
              <AppSearchForm
                placeholder="Search "
                inputClassName="border-dark-subtle focus:border-white text-white sm:w-auto w-40 sm:text-lg "
                onSubmit={handleSearchSubmit}
              />
            </li>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-white font-semibold text-lg"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth/signin"
                className="text-white font-semibold text-lg"
              >
                Login
              </Link>
            )}
          </ul>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;

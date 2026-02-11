import React, { useState } from "react";
import lnmiitLogo from "./download.png";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const role = localStorage.getItem("role");
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center">
          <img src={lnmiitLogo} className="h-8 mr-3" alt="LNMIIT Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            LH Management
          </span>
        </div>
        <button
          onClick={toggleMobileMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`w-full md:w-auto text-center ${
            mobileMenuOpen ? "" : " max-md:hidden"
          }`}
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 pl-3 pr-4  bg-blue-700 rounded md:bg-transparent md:text-blue-700 text-white md:p-0 dark:text-white md:dark:text-blue-500"
                    : "block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover-bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover-text-blue-500 dark:hover-bg-gray-700 dark:hover-text-white md:dark:hover-bg-transparent"
                }
              >
                Home
              </NavLink>
            </li>
            {role === "gsec" && (
              <li>
                <NavLink
                  to="/book"
                  className={({ isActive }) =>
                    isActive
                      ? "block py-2 pl-3 pr-4  bg-blue-700 rounded md:bg-transparent md:text-blue-700 text-white md:p-0 dark:text-white md:dark:text-blue-500"
                      : "block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover-bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover-text-blue-500 dark:hover-bg-gray-700 dark:hover-text-white md:dark:hover-bg-transparent"
                  }
                >
                  Book an LT
                </NavLink>
              </li>
            )}
            {role === "gsec" && (
              <li>
                <NavLink
                  to="/reqLogs"
                  className={({ isActive }) =>
                    isActive
                      ? "block py-2 pl-3 pr-4  bg-blue-700 rounded md:bg-transparent md:text-blue-700 text-white md:p-0 dark:text-white md:dark:text-blue-500"
                      : "block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover-bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover-text-blue-500 dark:hover-bg-gray-700 dark:hover-text-white md:dark:hover-bg-transparent"
                  }
                >
                  Request Log
                </NavLink>
              </li>
            )}
            {(role==='systemAdministrator' || role==='assistantRegistrar' || role==='facultyMentor') && (
              <li>
                <NavLink
                  to="/requests"
                  className={({ isActive }) =>
                    isActive
                      ? "block py-2 pl-3 pr-4  bg-blue-700 rounded md:bg-transparent md:text-blue-700 text-white md:p-0 dark:text-white md:dark:text-blue-500"
                      : "block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover-bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover-text-blue-500 dark:hover-bg-gray-700 dark:hover-text-white md:dark:hover-bg-transparent"
                  }
                >
                  Requests
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to="/logout"
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 pl-3 pr-4  bg-blue-700 rounded md:bg-transparent md:text-blue-700 text-white md:p-0 dark:text-white md:dark:text-blue-500"
                    : "block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover-bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover-text-blue-500 dark:hover-bg-gray-700 dark:hover-text-white md:dark:hover-bg-transparent"
                }
              >
                Logout
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

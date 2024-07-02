import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import ManageAccount from "./ManageAccount";

const NavBar = () => {
  const [chosen, setChosen] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const handleChosen = (id) => {
    setChosen(id);
  };

  const handleStyle = (id) => {
    return chosen === id ? "text-blue-400" : "";
  };

  return (
    <header className="flex items-center justify-between border-b-2 border-gray-200/40 px-10 py-7 md:px-28 lg:px-48">
      <Link to="/">
        <h1 className="text-lg font-bold">Auth App</h1>
      </Link>

      <nav>
        <ul className="flex items-center gap-5 font-medium sm:gap-12 md:gap-14">
          <li>
            <NavLink
              to="/"
              onClick={() => handleChosen(0)}
              className={handleStyle(0)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              onClick={() => handleChosen(1)}
              className={handleStyle(1)}
            >
              About
            </NavLink>
          </li>
          <li>
            {currentUser ? (
              <div className="group relative">
                <img
                  src={currentUser.user?.profilePic}
                  alt="profile"
                  className="w-10 rounded-full"
                />
                <ManageAccount style="group-hover:translate-y-[20%] group-hover:opacity-100" handleChosen={handleChosen} ></ManageAccount>
              </div>
            ) : (
              <NavLink
                to="/signin"
                onClick={() => handleChosen(2)}
                className={handleStyle(2)}
              >
                Signin
              </NavLink>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;

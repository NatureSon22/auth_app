import { NavLink, useNavigate } from "react-router-dom";
import Popup from "./Popup";
import propTypes from "prop-types";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signOut } from "../states/user/userSlice";

const ManageAccount = ({ style, handleChosen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await axios.get("/api/auth/signout");
    dispatch(signOut());
    navigate("/signin");
    handleChosen(2);
  };

  return (
    <Popup style={`right-0 md:left-0 bg-white ${style} `}>
      <div className="space-y-1 px-2 py-1">
        <NavLink to="/profile">
          <div>View Profile</div>{" "}
        </NavLink>
        <div className="cursor-pointer" onClick={() => handleSignOut()}>
          Sign Out
        </div>
      </div>
    </Popup>
  );
};

ManageAccount.propTypes = {
  style: propTypes.string.isRequired,
  handleChosen: propTypes.func.isRequired,
};

export default ManageAccount;

import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase/firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../states/user/userSlice";
import propTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const OAuth = ({ isSubmitting }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await axios.post("/api/auth/google", {
        email: result.user.email,
        name: result.user.displayName,
        photo: result.user.photoURL,
      });
      dispatch(signInSuccess(res.data));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      disabled={isSubmitting}
      className={`mt-5 w-full rounded-md py-4 font-bold text-white ${isSubmitting ? "bg-gray-50/50" : "bg-gray-900"}`}
      onClick={handleClick}
    >
      Continue with Google
    </button>
  );
};

OAuth.propTypes = {
  isSubmitting: propTypes.bool.isRequired,
};

export default OAuth;

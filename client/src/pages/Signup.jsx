import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { signInSuccess } from "../states/user/userSlice";
import { useDispatch } from "react-redux";

const schema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
});

const SignUp = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const user = await axios.post("/api/auth/signup", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate("/");
      dispatch(signInSuccess(user.data));
    } catch (error) {
      setError("root", {
        message: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <div className="grid flex-1 justify-items-center">
      <div className="mt-10 h-min w-[90%] max-w-[30em] space-y-2 md:mt-16">
        <h1 className="mb-10 text-center text-[2rem] font-bold">Sign Up</h1>
        <form
          action="post"
          className="grid w-full gap-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          {errors.root && (
            <div className="rounded-md border border-red-400 bg-red-100/50 px-5 py-3">
              <p className="text-red-500">{errors.root.message}</p>
            </div>
          )}
          <div className="grid gap-2">
            <label htmlFor="email" className="text-[0.9rem] text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="rounded-md border bg-blue-200/30 px-4 py-2 focus-visible:outline-blue-500"
              autoComplete="on"
              {...register("email")}
            />
            {errors.email && (
              <p className="ml-auto text-[0.8rem] italic text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="username" className="text-[0.9rem] text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="rounded-md border bg-blue-200/30 px-4 py-2 focus-visible:outline-blue-500"
              autoComplete="on"
              {...register("username")}
            />
            {errors.username && (
              <p className="ml-auto text-[0.8rem] italic text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="password" className="text-[0.9rem] text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="rounded-md border bg-blue-200/30 px-4 py-2 focus-visible:outline-blue-500"
              autoComplete="on"
              {...register("password")}
            />
            {errors.password && (
              <p className="ml-auto text-[0.8rem] italic text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-5 w-full rounded-md py-4 font-bold text-white ${isSubmitting ? "bg-blue-500/50" : "bg-blue-500"}`}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>{" "}
        <OAuth isSubmitting={isSubmitting} />
        <div className="py-1"></div>
        <div className="flex gap-2 text-[0.95rem]">
          <p>Already have an account?</p>
          <Link to="/signin" className="font-semibold text-red-500">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

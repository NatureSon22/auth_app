import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../states/user/userSlice";
import OAuth from "../components/OAuth";

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const Sigin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(schema) });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const user = await axios.post("/api/auth/signin", data);
      dispatch(signInSuccess(user.data));
      navigate("/");
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <div className="grid flex-1 justify-items-center">
      <div className="mt-10 h-min w-[90%] max-w-[30em] space-y-2 md:mt-16">
        <h1 className="mb-10 text-center text-[2rem] font-bold">Sign in</h1>
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
            <label className="text-[0.9rem] text-gray-700" htmlFor="email">
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
            <label className="text-[0.9rem] text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="rounded-md border bg-blue-200/30 px-4 py-2 focus-visible:outline-blue-500"
              autoComplete="on"
              {...register("password")}
            />
            {errors.email && (
              <p className="ml-auto text-[0.8rem] italic text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
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
          <p>Don&apos;t have an account?</p>
          <Link to="/signup" className="font-semibold text-red-500">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sigin;

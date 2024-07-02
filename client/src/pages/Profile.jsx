import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import zod from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { app } from "../firebase/firebase";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";
import { signInSuccess } from "../states/user/userSlice";

const schema = zod.object({
  name: zod.string().min(3),
  email: zod.string().email(),
  password: zod.string().nullable(),
});

const Profile = () => {
  const {
    currentUser: { user },
  } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.username || "",
      email: user?.email || "",
    },
  });
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [errorImgUrl, setErrorImgUrl] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (image) handleFileUpload();
  }, [image]);

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const update = {
        username: data.name,
        email: data.email,
        password: data.password,
        profilePic: imgUrl,
      };

      const res = await axios.put(`/api/user/update/${user._id}`, update, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      dispatch(signInSuccess({ user: res.data }));
    } catch (error) {
      setError("root", {
        message: error.response?.data?.message || error.message,
      });
    }
  };

  // upload file in firebase
  const handleFileUpload = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    // check upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress("Upload is " + progress.toFixed(1) + "% done");
      },
      () => {
        setErrorImgUrl("File size should not exceed 2MB");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
          setProgress("");
        });
      },
    );
  };

  return (
    <div className="grid flex-1 justify-items-center">
      <div className="my-10 flex w-[80%] max-w-[35em] flex-col items-center gap-7">
        <h1 className="text-xl font-bold">Profile</h1>
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <div className="grid place-items-center gap-2">
          <div
            className="size-24 cursor-pointer rounded-full border-2 border-blue-500"
            onClick={() => fileRef.current.click()}
          >
            <img
              className="h-full w-full rounded-full object-cover"
              src={imgUrl || user?.profilePic}
              alt=""
            />
          </div>
          <div>
            {errorImgUrl ? (
              <div className="text-red-500">{errorImgUrl}</div>
            ) : progress ? (
              <div className="text-green-500">{progress}</div>
            ) : null}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 grid w-full gap-7"
        >
          {errors.root && (
            <div className="rounded-md border border-red-400 bg-red-100/50 px-5 py-3">
              <p className="text-red-500">{errors.root.message}</p>
            </div>
          )}
          <div className="grid gap-2">
            <label htmlFor="name" className="text-[0.9rem] text-gray-700">
              Username
            </label>
            <input
              className="rounded-md border bg-blue-200/30 px-4 py-2 focus-visible:outline-blue-500"
              type="text"
              name="name"
              id="name"
              disabled={isSubmitting}
              {...register("name")}
            />
            {errors.name && (
              <p className="ml-auto text-[0.8rem] italic text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="email" className="text-[0.9rem] text-gray-700">
              Email
            </label>
            <input
              className="rounded-md border bg-blue-200/30 px-4 py-2 focus-visible:outline-blue-500"
              type="email"
              name="email"
              id="email"
              disabled={isSubmitting}
              {...register("email")}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="password" className="text-[0.9rem] text-gray-700">
              Password
            </label>
            <input
              className="rounded-md border bg-blue-200/30 px-4 py-2 focus-visible:outline-blue-500"
              type="password"
              name="password"
              id="password"
              disabled={isSubmitting}
              {...register("password")}
            />
            {errors.password && (
              <p className="ml-auto text-[0.8rem] italic text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="mt-5 flex justify-between gap-5">
            <button
              className="rounded-md bg-blue-500 px-6 py-4 font-semibold text-white"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              className="rounded-md bg-gray-200 px-6 py-4 font-semibold"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

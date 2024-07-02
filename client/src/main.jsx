import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Sigin from "./pages/Signin.jsx";
import SignUp from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import { Provider } from "react-redux";
import store, { persistor } from "./states/store.js";
import { PersistGate } from "redux-persist/integration/react";
import PrivateRoute from "./components/PrivateRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>error</div>,
    children: [
      { path: "", element: <Home /> },
      { path: "about", element: <About /> },
      { path: "signin", element: <Sigin /> },
      { path: "signup", element: <SignUp /> },
      {
        path: "profile",
        element: <PrivateRoute />,
        children: [{ path: "", element: <Profile /> }],
      },
      { path: "*", element: <div>error</div> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);

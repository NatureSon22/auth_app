import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";


const App = () => {

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default App;

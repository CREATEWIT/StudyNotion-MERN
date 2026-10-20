import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Navbar from "./Components/common/Navbar"

function App() {
  return (
    <div className="min-h-screen w-full bg-richblack-900 flex flex-col font-inter text-white">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Navbar from "./Components/common/Navbar";
import OpenRoute from "./Components/core/Auth/OpenRoute";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import Signup from "./pages/Signup";
import UpdatePassword from "./pages/UpdatePassword"; // 1. Added missing import

function App() {
  return (
    <div className="min-h-screen w-full bg-richblack-900 flex flex-col font-inter text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="/forget-password"
          element={
            <OpenRoute>
              <ForgetPassword />
            </OpenRoute>
          }
        />
        <Route
          path="/update-password/:id" // 3. Added leading slash for consistency
          element={
            <OpenRoute>
              <UpdatePassword /> {/* 2. Capitalized component tag */}
            </OpenRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

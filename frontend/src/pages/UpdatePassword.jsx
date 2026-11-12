import  { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { resetPassword } from "../services/operations/authAPI"; // Update this path to match your project

const UpdatePassword = () => {
const dispatch = useDispatch();
const location = useLocation();

const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
});

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const { loading } = useSelector((state) => state.auth);
const { password, confirmPassword } = formData;

const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const token = location.pathname.split("/").at(-1);
    dispatch(resetPassword(password, confirmPassword, token));
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>Choose New Password</h1>
          <p>Almost done. Enter your new password and you're all set.</p>
          <form onSubmit={handleOnSubmit}>
            <label>
              <p>New Password</p>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter New Password"
                className="w-full p-6 bg-richblack-600 text-richblack-5"
              />
              <span onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? (
                  <FaEyeSlash fontSize={24} />
                ) : (
                  <FaEye fontSize={24} />
                )}
              </span>
            </label>

            <label>
              <p>Confirm New Password</p>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm Password"
                className="w-full p-6 bg-richblack-600 text-richblack-5"
              />
              <span onClick={() => setShowConfirmPassword((prev) => !prev)}>
                {showConfirmPassword ? (
                  <FaEyeSlash fontSize={24} />
                ) : (
                  <FaEye fontSize={24} />
                )}
              </span>
            </label>

            <button type="submit">Reset Password</button>

            <div>
              <Link to="/login">
                <p>Back to Login</p>
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdatePassword;

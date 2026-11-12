import  {useState} from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {ResetPasswordResetToken} from "../services/operations/authAPI.js";
import { useDispatch } from 'react-redux';


const ForgetPassword = () =>{

    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");
    const {loading} = useSelector((state) =>state.auth);
    const dispatch = useDispatch();

    const handleOnSubmit = (e) =>{
        e.preventDefault();
        dispatch(ResetPasswordResetToken(email, setEmailSent))

    }
    return(
        <div className="text-white flex justify-center item-center">
            {
                loading ? (<div>
                    Loading...
                </div>):(
                <div>
                    <h1>
                        {
                            !emailSent ? "Reset Your Password" : "Check Your Email"
                        }
                    </h1>
                    <p>
                        {
                            !emailSent ? "Have no fear. We'll email your instruction to reset your password. If you don't have  access to your email we can try account recovery"
                            : `We have sent the reset email to ${email}`
                        }
                    </p>

                    <form onSubmit={handleOnSubmit}>
                        {
                            !emailSent && (
                                <label>
                                    <p>Email Address</p>
                                    <input required
                                    type = "email"
                                    name = "email"
                                    value = {email}
                                    onChange = {(e) => setEmail(e.target.value)}
                                    placeholder = "enter your email address"
                                    />
                                </label>
                            )
                        }
                        <button type="submit">
                            {
                                !emailSent ? "Reset Password" : "Resend Email"

                            }
                            
                        </button>

                        <Link to  = "/login">
                        <p>
                            Back to Login
                        </p>
                        </Link>

                    </form>

                </div>
                )
            }

        </div>
    )
}

export default ForgetPassword
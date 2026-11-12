import signupImg from "../assets/Images/signup.webp";
import Template from "../Components/core/Auth/Template";

function Signup(){
    return(
        <Template
        title = "Join the million learning to code with LearnMeet for free"
        description1="Build Skills for today, and beyond"
        description2="Education to future proof your career."
        image={signupImg}
        formType="signup"/>
    )
}

export default Signup;
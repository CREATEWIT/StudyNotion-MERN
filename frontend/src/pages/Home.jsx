
import { FaArrowRight } from "react-icons/fa6";
import {Link} from "react-router-dom";
import HighLightText from "../Components/core/HomePage/HighLightText";
import CTAButton from "../Components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../Components/core/HomePage/CodeBlocks";

//Home Function
const Home = () => {
    return (
    <div className="relative min-h-screen w-full overflow-hidden bg-richblack-900 text-white">

        {/* Blue background glow */}
        <div className="pointer-events-none absolute left-1/4 top-40 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />
        {/* Section1 */}
        <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center justify-between text-white">
            <Link to="/signup">
            <div className  = "  group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all  duration-200 hover:scale-95  w-fit">
                <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
                    <p>Become an Instructor</p>
                    <FaArrowRight className="m-auto" />
                </div>
            </div>
            </Link>

            <div className = "text-center text-4xl font-semibold mt-7 ">Empower Your Future With
                <HighLightText text = {"Coding Skills"}/>
            </div>

            <div className = "mt-4 w-[90%]  text-center text-md font-bold text-richblack-300 ">
                With our online coding course, you can learn at your own peace, from anywhere in the world and access to get a wealth of resources,
                including hands on project, quizzes, and personalized feedback from instructor.
            </div>

            <div className = "flex flex-row gap-7 mt-8">
                <CTAButton active = {true} linkto={"/signup"}>
                    Learn More
                </CTAButton >

                <CTAButton active = {false} linkto={"/login"}>
                    Book a Demo
                </CTAButton>

            </div>

            <div className="mx-3 mt-7 mb-12 shadow-lg shadow-blue-200">
                <video muted loop autoPlay playsInline>
                <source src={Banner} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
    </div>

        {/* Code Section1 */}
        <div>
            <CodeBlocks
                position  = {"lg:flex-row"}
                heading = {
                    <div className = "text-4xl font-semibold">
                        Unlock Your
                        <HighLightText text={"coding potential"}/>
                        with our online course
                    </div>
                }
                subheading = {
                    "Our course are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                }
                ctabtn1 = {
                    {
                        btnText : "try it yourself",
                        linkto : "/signup",
                        active : true
                    }}

                ctabtn = {
                    {
                        btnText : "learn more",
                        linkto : "/login",
                        active : false
                    }
                }

                codeblock = {`<DOCTYPE html>\n<html>\n<head><title>Example</title>
                <link rel = "stylesheet" href="styles.css">\n</head>\n<body>\n<h1><a href ="/">Header</a>\n</h1>\n<nav><a href ="one">One</a>\n<a href = "two">Two</a>\n</nav></body></html></DOCTYPE>`}

                codeColor = {"text-yellow-25"}/>
        </div>


         {/* Code Section2 */}
        <div>
            <CodeBlocks
                position  = {"lg:flex-row-reverse"}
                heading = {
                    <div className = "text-4xl font-semibold">
                        Start
                        <HighLightText text={"coding in seconds"}/>
                    </div>
                }
                subheading = {
                    "Go ahead, give it a try. Our hands-on learning environment is designed to help you learn by doing, with interactive projects, real-world coding challenges, and practical experience"
                }
                ctabtn1 = {
                    {
                        btnText : "Continue Lession",
                        linkto : "/signup",
                        active : true
                    }}

                ctabtn = {
                    {
                        btnText : "learn more",
                        linkto : "/login",
                        active : false
                    }
                }

                codeblock = {`<DOCTYPE html>\n<html>\n<head><title>Example</title>
                <link rel = "stylesheet" href="styles.css">\n</head>\n<body>\n<h1><a href ="/">Header</a>\n</h1>\n<nav><a href ="one">One</a>\n<a href = "two">Two</a>\n</nav></body></html></DOCTYPE>`}

                codeColor = {"text-yellow-25"}/>
        </div>
        </div>

        {/* Section2 */}

        {/* Section3 */}

        {/* Section4 */}
    </div>
    )
}

export default Home
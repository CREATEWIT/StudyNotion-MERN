import CTAButton from "../HomePage/Button";
import { FaArrowRight } from "react-icons/fa6";
import {TypeAnimation} from "react-type-animation";




const CodeBlocks = (
    { position, heading, subheading, ctabtn1,  ctabtn, codeblock, backgroundGradient, codeColor}
) => {
    return(
        <div className={`relative isolate flex flex-col ${position} my-20 justify-between gap-10`}>
            {/* Section1 */}
            <div className="flex w-full flex-col gap-8 lg:w-1/2">
                {heading}
                <div className = "text-richblack-300 font-bold">
                    {subheading}
                </div>

                <div className="flex gap-7 mt-7">
                    <CTAButton
                    active={ctabtn1.active}
                    linkto={ctabtn1.linkto}>
                    <div className="flex gap-2 items-center">
                        {ctabtn1.btnText}
                        <FaArrowRight />
                    </div>
                    </CTAButton>

                    <CTAButton
                    active={ctabtn.active}
                    linkto={ctabtn.linkto}>
                    <div className="flex items-center gap-2">
                    {ctabtn.btnText}
                    <FaArrowRight />
                    </div>
                    </CTAButton>
                </div>
            </div>

            {/* Section2 */}
            <div className={`relative isolate h-fit w-full flex-row rounded-xl border border-richblack-700 bg-richblack-800/70 py-4 shadow-lg shadow-blue-500/10 lg:flex lg:w-[500px] ${
            backgroundGradient || ""
            }`}>

            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-full bg-blue-500/20 blur-3xl" />
                {/* HW BG Gradient */}

                <div className = "text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold">
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                </div>

                <div className = {`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
                    <TypeAnimation
                    sequence={[codeblock, 2000, ""]}
                    repeat = {Infinity}
                    cursor = {true}

                    style = {
                        {
                            whiteSpace: "pre-line",
                            display:"block",
                        }
                    }

                    omitDeletionAnimation={true}
                    />
                </div>
                </div>

        </div>
    )
}

export default CodeBlocks
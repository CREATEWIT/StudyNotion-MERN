import Logo1 from "../../../assets/TimelineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimelineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimelineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimelineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/timelineImage.png"

const timeline = [
    {
        Logo: Logo1,
        heading : "Leadership",
        Description : "Fully committed  to the success company."
    },
    {
        Logo: Logo2,
        heading : "Responsibility",
        Description : "Students will always our top priority"
    },
    {
        Logo: Logo3,
        heading : "Flexibility",
        Description : "The ability to switch is an important skills"
    },
    {
        Logo: Logo4,
        heading : "Solve the problem",
        Description : "Code you way a solution"
    },
]
const TimelineSection = () =>{
    return(
        <div>
            <div className = "flex flex-row  max-w-maxContent items-center gap-15 mx-auto justify-between  ">
                <div className = "flex flex-col w-[45%] gap-5">
                    {
                        timeline.map( (element, index) => {
                            return (
                                <div className = "flex flex-row gap-6 " key={index}>
                                    <div className = "w-[50px] h-[50px] bg-white flex items-center">
                                        <img src={element.Logo}/>
                                    </div>

                                    <div>
                                        <h2 className = "font-semibold text-[18px]">{element.heading}</h2>
                                        <p className = "text-base">{element.Description}</p>
                                    </div>

                                </div>
                            )
                        })
                    }
                </div>
            <div className = "relative shadow-blue-200">
                <img src ={timelineImage} alt ="timelineImage" className = "shadow-white object-cover h-fit"/>
                <div className = "absolute left-[50%] translate-x-[-50%] translate-y-[-50%] bg-caribbeangreen-700 flex flex-row text-white uppercase py-7">
                    <div className = "flex flex-row gap-5 items-center border-r  border-caribbeangreen-300 px-7">
                        <p className = "text-3xl font-bold">10</p>
                        <p className = "text-caribbeangreen-300 text-sm">Years of Experience</p>
                    </div>

                    <div className = "flex gap-5 items-center px-7">
                        <p className = "text-3xl font-bold">250</p>
                        <p className = "text-caribbeangreen-300 text-sm">Type of courses</p>

                    </div>

                </div>

            </div>
            </div>
        </div>
    )
}

export default TimelineSection
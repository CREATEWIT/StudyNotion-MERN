import {HomePageExplore} from "../../../data/homepage-explore";
import {useState} from "react";
import HighlightText from "./HighLightText.jsx";
import CourseCard from "./CourseCard";


const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"
];

const ExploreMore = () =>{
    const [currentTab, setCurrentTab]  = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading)

    const setMyCards = (value) =>{
        setCurrentTab(value);
        const result = HomePageExplore.filter((courses) => courses.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }
    return (
        <div>
            <div className ="text-4xl font-semibold text-center">
                Unlock the
                <HighlightText text = {"Power of code"}/>
            </div>
            <p className = "text-center text-richblack-300 text-sm  text-[16px] mt-3">
                Learn to build anything you can imagine
            </p>
<div className="mx-auto mt-8 mb-7 flex w-fit max-w-full flex-wrap justify-center rounded-full border border-richblack-100 bg-richblack-800 p-1">
                {
                    tabsName.map((element, index) => {
                        return (
                            <div className = {`text-[16px] flex flex-row items-center gap-2
                                ${currentTab === element
                                ? "bg-richblack-900 text-richblack-5 font-medium"
                                : "text-richblack-200"}  rounded-full transition-all duration-200 cursor-pointer
                                hover:bg-richblack-900 hover:text-richblack-5 py-2 px-7`}
                                key={index}            
                                onClick={() => setMyCards(element)} >
                                    {element}
                            </div>
                        )
                    })
                }
            </div>
                        <div className="mx-auto mt-10 w-11/12 max-w-maxContent">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {courses.map((element) => (
                        <CourseCard
                            key={element.heading}
                            cardData={element}
                            currentCard={currentCard}
                            setCurrentCard={setCurrentCard}
                        />
                    ))}
                </div>
            </div>

        </div>
    )
}

export default ExploreMore
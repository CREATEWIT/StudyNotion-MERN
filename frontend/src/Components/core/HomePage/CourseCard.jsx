import { FaUsers, FaBookOpen } from "react-icons/fa";

const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  const isActive = currentCard === cardData.heading;

  return (
    <div
      onClick={() => setCurrentCard(cardData.heading)}
      className={`flex min-h-[300px] w-full cursor-pointer flex-col justify-between transition-all duration-200 ${
        isActive
          ? "bg-white text-richblack-900 shadow-[8px_8px_0px_0px_#FFD60A]"
          : "bg-richblack-800 text-white"
      }`}
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold">
          {cardData.heading}
        </h3>

        <p
          className={`mt-4 text-sm leading-6 ${
            isActive ? "text-richblack-700" : "text-richblack-300"
          }`}
        >
          {cardData.description}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-richblack-500 px-6 py-4">
        <span className="flex items-center gap-2 text-sm">
          <FaUsers />
          {cardData.level}
        </span>

        <span className="flex items-center gap-2 text-sm">
          <FaBookOpen />
          {cardData.lessionNumber} Lessons
        </span>
      </div>
    </div>
  );
};

export default CourseCard;
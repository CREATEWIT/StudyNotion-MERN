import { useEffect, useState } from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png"
import NavbarLinks from "../../data/navbar-links.js"
import { Link, useLocation, matchPath } from "react-router-dom";
import {useSelector} from "react-redux";
import {AiOutlineShoppingCart} from "react-icons/ai";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import {apiConnector} from "../../services/apiConnector.js";
import {categories} from "../../services/apis.js";
import {IoIosArrowDropdownCircle} from "react-icons/io";
const Navbar = () =>{
    const {token} = useSelector((state) => state.auth);
    const {user}  = useSelector((state) => state.profile);
    const {TotalItems} = useSelector((state) => state.cart)
    const location = useLocation();

    //create SubLinks for Show Category in NavBar section
    const [subLinks, setSubLinks] = useState([]);
const fetchSubLinks = async () => {
    try {
        const result = await apiConnector(
            "GET",
            categories.CATEGORIES_API
        );

        const categoryData = result?.data?.allCategory;

        console.log("Categories:", categoryData);

        setSubLinks(
            Array.isArray(categoryData) ? categoryData : []
        );
    } catch (error) {
        console.error("Could not fetch categories:", error);
        setSubLinks([]);
    }
};

useEffect(() => {
    fetchSubLinks();
}, []);


    const matchRoute = (route) =>{
        return matchPath({path:route,end: true}, location.pathname)
    }
    return (
        <div className = "flex items-center h-14 justify-center border-b-[1px] border-b-richblack-700">
            <div className = "flex flex-row w-11/12 max-w-maxContent items-center justify-between">

            {/*  Image */}
                <Link to ="/">
                    <img src={logo} alt="StudyNotion Logo" width={160} height={42} className="h-auto w-[160px]"
/>
                </Link>
            
            {/* Nav Links */}

            <nav>
                <ul className = "flex gap-x-6 text-richblack-25">
                    {
                        NavbarLinks.map((link, index) =>(
                            <li key = {index}>
                               {link.title === "Catalog" ? (
    <div className="relative flex items-center gap-1 group">
        <p className="flex cursor-pointer items-center gap-1">
            {link.title}
            <IoIosArrowDropdownCircle />
        </p>

        {/* Dropdown menu */}
        <div
            className="invisible absolute left-1/2 top-full z-50
            mt-4 w-[300px] -translate-x-1/2
            rounded-md bg-richblack-5 p-4
            text-richblack-900 opacity-0
            transition-all duration-200
            group-hover:visible group-hover:opacity-100"
        >
            {/* Triangle */}
            <div
                className="absolute left-1/2 top-0
                h-5 w-5 -translate-x-1/2
                -translate-y-1/2 rotate-45
                bg-richblack-5"
            />

            {/* Categories */}
            {subLinks.length > 0 ? (
    subLinks.map((subLink) => (
        <Link
            to={`/catalog/${subLink._id}`}
            key={subLink._id}
            className="relative z-10 block rounded px-0 py-1
                text-richblack-900 hover:text-yellow-700"
        >
            {subLink.name}
        </Link>
    ))
) : (
    <p className="relative z-10 text-sm">
        No categories available
    </p>
)}
        </div>
    </div>
) : (
    <Link to={link?.path}>
        <p
            className={
                matchRoute(link?.path)
                    ? "text-yellow-25"
                    : "text-richblack-25"
            }
        >
            {link.title}
        </p>
    </Link>
)}

                            </li>

                        ))
                    }

                </ul>
            </nav>

            {/* Login/Signup/Dashboard */}
            <div className = "flex gap-x-4 items-center">
                {
                    user && user?.accountType != "Instructor" && (
                        <Link to ="/dashboard/cart" className="relative">
                            <AiOutlineShoppingCart/>
                            {
                                TotalItems > 0 &&(
                                    <span>
                                        {TotalItems}
                                    </span>
                                )
                            } 
                        </Link>
                    )
                }
                {
                    token === null && (
                        <Link to="/login">
                            <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px]
                            text-richblack-100 rounded-md">
                                LogIn
                            </button>
                        </Link>
                    )
                }
                {
                    token === null && (
                        <Link to="/signup">
                            <button className = "border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                                SignUp
                            </button>
                        </Link>
                    )
                }
                {
                    token !== null && <ProfileDropDown/>
                }


            </div>
            </div>

        </div>
    )
}

export default Navbar;
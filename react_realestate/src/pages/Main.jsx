import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/Main/SideBar"
import MainContext from '../components/Main/MainContext.js';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Main() {
    const [isToggled, setToggled] = React.useState(true);
    const { titles } = React.useContext(MainContext);
    const location = useLocation();
    const toggleButton = () => {
        setToggled(!isToggled);
    };
    // Function to get the title according to the url
    const getTitle = () => {
        const { pathname } = location;
        // Separates the path into segments and filters out the gaps
        const sections = pathname.split('/').filter(section => section !== '');
        if (sections.length > 1) {
            const section = sections[1];
            switch (section) {
                case 'customer':
                    return titles.customer;
                default:
                    return ''
            }
        }
        return '';
    };
    return (
        <>
            <div className="flex h-[100vh]">
                <SideBar collapsed={isToggled} />
                <div className="flex flex-col w-full">
                    <div className='hidden md:flex flex-row h-16 items-center bg-sidebar'>
                        <div className='mx-4 grow hidden md:flex'>
                            <button
                                className='flex items-center'
                                onClick={toggleButton}>
                                {isToggled ? <Bars3Icon className="h-8 w-8 stroke-2" /> : <XMarkIcon className="h-8 w-8 stroke-2" />}
                            </button>
                        </div>
                        <div className="grow">
                            <p className='flex items-center justify-center'>{getTitle()}</p>
                        </div>
                        <div className="mx-4 grow">
                            <p className='flex items-center justify-end'>Profile</p>
                        </div>
                    </div>
                    <div className='h-full p-2 overflow-auto'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}
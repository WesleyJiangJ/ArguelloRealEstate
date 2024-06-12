import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { HomeModernIcon, UserIcon, BanknotesIcon, UserGroupIcon, CogIcon, ArrowLeftStartOnRectangleIcon, Squares2X2Icon } from "@heroicons/react/24/solid";

export default function SideBar({ collapsed }) {
    const menuItemStyles = {
        button: {
            "&:hover": {
                backgroundColor: "#1E1E1E !important",
                color: "white",
            },
        }
    }
    const getActiveStyles = ({ isActive }) => ({
        backgroundColor: isActive ? '#1E1E1E' : '',
        color: isActive ? 'white' : '',
    });
    return (
        <>
            <Sidebar
                collapsed={collapsed}
                className='h-[100vh] bg-sidebar'>
                <div className="mb-2 p-4 flex">
                    <HomeModernIcon className='w-8 h-8 m-auto' />
                </div>
                <Menu menuItemStyles={menuItemStyles}>
                    <MenuItem
                        icon={<UserIcon className="h-5 w-5" />}
                        component={<NavLink to="customer" style={getActiveStyles} />}>
                        Clientes
                    </MenuItem>
                    <MenuItem
                        icon={<Squares2X2Icon className="h-5 w-5" />}
                        component={<NavLink to="plot" style={getActiveStyles} />}>
                        Lotes
                    </MenuItem>
                    <MenuItem
                        icon={<BanknotesIcon className="h-5 w-5" />}
                        component={<NavLink to="sales" style={getActiveStyles} />}>
                        Ventas
                    </MenuItem>
                </Menu>
                <Menu menuItemStyles={menuItemStyles}>
                    <MenuItem
                        icon={<UserGroupIcon className="h-5 w-5" />}
                        component={<NavLink to="personal" style={getActiveStyles} />}>
                        Personal
                    </MenuItem>
                    <MenuItem
                        icon={<CogIcon className="h-5 w-5" />}
                        component={<NavLink to="settings" style={getActiveStyles} />}>
                        Ajustes
                    </MenuItem>
                    <MenuItem
                        icon={<ArrowLeftStartOnRectangleIcon className="h-5 w-5" />}>
                        Logout
                    </MenuItem>
                </Menu>
            </Sidebar>
        </>
    );
}
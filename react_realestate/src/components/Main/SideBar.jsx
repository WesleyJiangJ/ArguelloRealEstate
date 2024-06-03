import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { HomeModernIcon, UserIcon, BanknotesIcon, UserGroupIcon, CogIcon, ArrowLeftStartOnRectangleIcon, CreditCardIcon, DocumentTextIcon } from "@heroicons/react/24/solid";

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
                    <HomeModernIcon className='w-8 h-8 m-auto'/>
                </div>
                <Menu menuItemStyles={menuItemStyles}>
                    <MenuItem
                        icon={<UserIcon className="h-5 w-5" />}
                        component={<NavLink to="customers" style={getActiveStyles} />}>
                        Clientes
                    </MenuItem>
                    <SubMenu label="Pagos" icon={<BanknotesIcon className="h-5 w-5" />}>
                        <MenuItem
                            icon={<CreditCardIcon className="h-5 w-5" />}
                            component={<NavLink to="budget" style={getActiveStyles} />}>
                            Presupuestos
                        </MenuItem>
                        <MenuItem
                            icon={<DocumentTextIcon className="h-5 w-5" />}
                            component={<NavLink to="payment" style={getActiveStyles} />}>
                            Pagos
                        </MenuItem>
                    </SubMenu>
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
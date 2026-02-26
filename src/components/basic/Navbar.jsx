import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, XIcon, House, Calculator } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";

export const navLinks = [
  { name: 'Inicio', path: '/', icon: House },
  { name: 'Calculadoras', path: '/calculadoras', icon: Calculator },
];

function AppVersion() {
    return (
        <div className="text-sm text-white hidden md:block opacity-50">
            Version: {__APP_VERSION__}
        </div>
    );
}

export function Navbar() {
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsMenuOpen(open);
        console.log('Drawer state:', open);
    }


    function handleClick() {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <header className="bg-primary text-white p-3 border-b-2 border-primary-border">
            <nav className="flex items-center justify-between">
                {/* Navigation Links Container */}
                <ul className="hidden font-medium md:flex flex-col ml-6 md:p-0 rounded-base md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
                    {navLinks.map((link) => (
                        <li key={link.name} className="flex font-bold">
                            <NavLink
                                to={link.path}
                                className={({ isActive }) => `block py-2 px-3 text-heading rounded hover:text-item-hover md:border-0 md:p-0
                                ${isActive ? 'block py-2 px-3 text-accent' : ''}`}
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                {/* Logo */}
                <AppVersion />
                <NavLink to="/" className="text-xl md:text-2xl font-bold mr-6 md:mr-0">
                    EndocrineHub
                </NavLink>
                {/* Mobile Menu Button */}
                <IconButton 
                    className="md:hidden text-white"
                    onClick={handleClick}
                >
                    {isMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
                </IconButton>
            </nav>
            {/* Mobile Drawer */}
            <Drawer
                anchor="top"
                open={isMenuOpen}
                onClose={toggleDrawer(false)}
            >
                <List className="p-4 bg-primary text-white">
                    {navLinks.map((link) => (
                        <ListItem disablePadding key={link.name} className="py-2">
                            <ListItemButton
                                component={NavLink}
                                to={link.path}
                                size="large"
                                className="flex items-center py-2 px-3 text-heading rounded text-white hover:text-item-hover"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <ListItemIcon className="text-inherit flex items-center mr-3" sx={{ minWidth: 0 }}>
                                    <link.icon size={20} />
                                </ListItemIcon>
                                <span className="align-middle">{link.name}</span>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </header>
    );
}
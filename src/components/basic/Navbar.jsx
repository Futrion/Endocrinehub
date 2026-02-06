import { useState } from "react";
import { NavLink } from "react-router-dom";
import { MenuIcon, XIcon } from "lucide-react";

export const navLinks = [
  { name: 'Inicio', path: '/' },
  { name: 'Calculadora IMC', path: '/calculadora-imc' },
];

export function Navbar() {
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);

    return (
        <header className="bg-primary text-white p-3 border-b-2 border-primary-border">
            <nav className="flex items-center justify-between">
                {/* Navigation Links Container */}
                <ul className="font-medium flex flex-col ml-6 md:p-0 rounded-base md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
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
                <NavLink to="/" className="text-xl md:text-2xl font-bold mr-6 md:mr-0">
                    EndocrineHub
                </NavLink>
                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden text-white"
                >
                    {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
                </button>
            </nav>
        </header>
    );
}
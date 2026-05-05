import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu as MenuIcon, XIcon, House, Calculator, LogOut } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import MuiMenu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "../../contexts/AuthContext";
import { RoleBadge } from "./RoleBadge";

export const navLinks = [
  { name: 'Inicio', path: '/', icon: House },
  { name: 'Calculadoras', path: '/calculadoras', icon: Calculator },
];

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userMenuAnchor, setUserMenuAnchor] = useState(null);
    const { session, role, nombre, apellidos, signOut } = useAuth();
    const navigate = useNavigate();

    const userEmail = session?.user?.email ?? '';
    const displayName = [nombre, apellidos].filter(Boolean).join(' ');
    const userInitial = (nombre || userEmail).charAt(0).toUpperCase();

    function openUserMenu(e) { setUserMenuAnchor(e.currentTarget); }
    function closeUserMenu() { setUserMenuAnchor(null); }

    async function handleSignOut() {
        closeUserMenu();
        await signOut();
        navigate('/login', { replace: true });
    }

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
        setIsMenuOpen(open);
    };

    const avatarSx = (size) => ({
        width: size,
        height: size,
        bgcolor: 'primary.light',
        fontSize: size === 34 ? '0.9rem' : '0.85rem',
        fontWeight: 700,
        border: '2px solid rgba(255,255,255,0.4)',
        cursor: 'pointer',
        '&:hover': { borderColor: 'white' },
    });

    return (
        <header className="bg-primary text-white p-3 border-b-2 border-primary-border">
            <nav className="relative flex items-center justify-between">

                {/* Logo */}
                <NavLink to="/" className="text-xl md:text-2xl font-bold shrink-0">
                    EndocrineHub
                </NavLink>

                {/* Desktop: nav links centered */}
                <ul className={`hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2 ${!session ? 'invisible' : ''}`}>
                    {navLinks.map((link) => (
                        <li key={link.name} className="font-bold">
                            <NavLink
                                to={link.path}
                                className={({ isActive }) =>
                                    `py-2 px-1 text-white hover:text-accent transition-colors
                                    ${isActive ? 'text-accent border-b-2 border-accent' : ''}`
                                }
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Desktop: user avatar */}
                <div className="hidden md:flex items-center">
                    {session && (
                        <IconButton onClick={openUserMenu} size="small" sx={{ p: 0 }} aria-label="Menú de usuario">
                            <Avatar sx={avatarSx(34)}>{userInitial}</Avatar>
                        </IconButton>
                    )}
                </div>

                {/* Mobile: user avatar + hamburger */}
                <div className="flex md:hidden items-center gap-1">
                    {session && (
                        <IconButton onClick={openUserMenu} size="small" sx={{ p: 0.5 }} aria-label="Menú de usuario">
                            <Avatar sx={avatarSx(30)}>{userInitial}</Avatar>
                        </IconButton>
                    )}

                    {session && (
                        <IconButton onClick={() => setIsMenuOpen(o => !o)} sx={{ color: 'white' }} aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}>
                            {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
                        </IconButton>
                    )}
                </div>

                {/* Single user menu — outside responsive containers to avoid duplicate portals */}
                {session && (
                    <MuiMenu
                        anchorEl={userMenuAnchor}
                        open={Boolean(userMenuAnchor)}
                        onClose={closeUserMenu}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        slotProps={{ paper: { sx: { mt: 1, minWidth: 220 } } }}
                    >
                        <div className="px-4 py-3">
                            {displayName && (
                                <p className="text-sm font-semibold text-primary">{displayName}</p>
                            )}
                            <p className={`text-sm truncate ${displayName ? 'text-muted' : 'font-semibold text-primary'}`}>
                                {userEmail}
                            </p>
                            <RoleBadge role={role} />
                        </div>
                        <Divider />
                        <MenuItem onClick={handleSignOut} sx={{ gap: 1.5, color: 'error.main', py: 1.5 }}>
                            <LogOut size={16} />
                            <span>Cerrar sesión</span>
                        </MenuItem>
                    </MuiMenu>
                )}
            </nav>

            {/* Mobile Drawer */}
            <Drawer anchor="top" open={isMenuOpen} onClose={toggleDrawer(false)}>
                <List className="p-4 bg-primary text-white">
                    {navLinks.map((link) => (
                        <ListItem disablePadding key={link.name} className="py-2">
                            <ListItemButton
                                component={NavLink}
                                to={link.path}
                                className="flex items-center py-2 px-3 rounded text-white hover:text-accent"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <ListItemIcon className="text-inherit flex items-center mr-3" sx={{ minWidth: 0 }}>
                                    <link.icon size={20} />
                                </ListItemIcon>
                                <span className="font-bold">{link.name}</span>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </header>
    );
}

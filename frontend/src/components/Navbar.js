import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Layers, Menu, X } from 'react-feather';

// A simple avatar component that shows the user's initials
const Avatar = ({ user }) => {
    if (!user) return null;
    const initials = `${user.firstName[0]}${user.lastName[0]}`;
    return (
        <div className="w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold">
            {initials}
        </div>
    );
};

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Set the token in the headers for all future axios requests
                    const config = {
                        headers: {
                            'auth-token': token
                        }
                    };
                    const res = await axios.get('https://vandralthesisone.onrender.com/api/user/me', config);
                    setUser(res.data);
                } catch (err) {
                    // If token is invalid or expired, remove it
                    localStorage.removeItem('token');
                    console.error('Could not fetch user', err);
                }
            }
        };

        fetchUser();
    }, []);

    // Effect to handle clicks outside of the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <header className="bg-[#0A0A0A] fixed top-0 left-0 right-0 z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center text-white">
                {/* Left Section */}
                <div className="flex items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <Layers className="text-white" />
                        <span className="text-xl font-bold">SlideWise</span>
                    </Link>
                </div>
                
                {/* Center Section (Desktop) */}
                <div className="hidden md:flex flex-1 justify-center space-x-8">
                    <a href="#features" className="hover:text-gray-300 transition-colors">Features</a>
                    <a href="#templates" className="hover:text-gray-300 transition-colors">Templates</a>
                    <a href="#pricing" className="hover:text-gray-300 transition-colors">Pricing</a>
                    <a href="#contact" className="hover:text-gray-300 transition-colors">Contact</a>
                </div>
                
                {/* Right Section (Desktop) */}
                <div className="hidden md:flex items-center space-x-4">
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
                                <Avatar user={user} />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                                    <Link to="/account" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Account Settings</Link>
                                    <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-gray-300 transition-colors">Login</Link>
                            <Link to="/signup" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">Sign Up</Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#0A0A0A] text-white px-6 pb-4">
                    <div className="flex flex-col space-y-4">
                        <a href="#features" className="hover:text-gray-300" onClick={() => setMobileMenuOpen(false)}>Features</a>
                        <a href="#templates" className="hover:text-gray-300" onClick={() => setMobileMenuOpen(false)}>Templates</a>
                        <a href="#pricing" className="hover:text-gray-300" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                        <a href="#contact" className="hover:text-gray-300" onClick={() => setMobileMenuOpen(false)}>Contact</a>
                        <div className="border-t border-gray-700 pt-4 flex flex-col space-y-4">
                            {user ? (
                                <>
                                    <Link to="/account" className="hover:text-gray-300" onClick={() => setMobileMenuOpen(false)}>Account</Link>
                                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left hover:text-gray-300">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="hover:text-gray-300" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                    <Link to="/signup" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg text-center" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;

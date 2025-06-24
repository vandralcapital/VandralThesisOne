import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaGoogle, FaArrowRight, FaBrain } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            toast.success('Logged in successfully!');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.msg || 'An error occurred');
        }
    };

    const steps = [
        {
            title: 'Create Your Account',
            description: 'Get started in seconds to create stunning presentations.'
        },
        {
            title: 'Input Your Topic',
            description: 'Just provide a topic, and our AI will generate the content.'
        },
        {
            title: 'Customize Your Deck',
            description: 'Easily edit slides, change themes, and add your branding.'
        },
        {
            title: 'Export & Present',
            description: 'Download your presentation and impress your audience.'
        }
    ];

    return (
        <div className="bg-[#0D0D0D] min-h-screen flex items-center justify-center text-white relative">
            {/* Grid background */}
            <div className="absolute inset-0 z-0 opacity-5" style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                backgroundSize: '2rem 2rem'
            }}></div>
            <div className="bg-[#1C1C1C] rounded-lg shadow-2xl flex w-full max-w-6xl z-10">
                {/* Left Side */}
                <div className="w-1/2 p-12 flex flex-col space-y-8 bg-[#1C1C1C] rounded-l-lg">
                    <div>
                        <h2 className="text-4xl font-bold">Welcome Back</h2>
                        <div className="flex items-center text-gray-400 mt-4">
                            <span>Login to access your presentations and AI features.</span>
                        </div>
                    </div>
                    <div className="space-y-6 flex-grow">
                        <div className="flex items-start">
                            <span className="text-[#D2FF00] w-6 h-6 mr-4 mt-1 flex items-center justify-center">🧠</span>
                            <div>
                                <h3 className="font-semibold">AI Content Generation</h3>
                                <p className="text-gray-400 text-sm">Let our AI write and design your slides from a simple prompt. Focus on your message, not the design.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <span className="text-[#D2FF00] w-6 h-6 mr-4 mt-1 flex items-center justify-center">🎨</span>
                            <div>
                                <h3 className="font-semibold">Customizable Templates</h3>
                                <p className="text-gray-400 text-sm">Choose from a variety of professionally designed templates to give your presentation a polished look.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <span className="text-[#D2FF00] w-6 h-6 mr-4 mt-1 flex items-center justify-center">🛡️</span>
                            <div>
                                <h3 className="font-semibold">Smart Slide Layouts</h3>
                                <p className="text-gray-400 text-sm">Our AI intelligently arranges your content for optimal readability and visual appeal.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                        <div className="flex space-x-4">
                            <Link to="/terms" className="hover:text-white">Terms</Link>
                            <Link to="/privacy" className="hover:text-white">Privacy</Link>
                            <Link to="/docs" className="hover:text-white">Docs</Link>
                            <Link to="/help" className="hover:text-white">Help</Link>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">🌐</span>
                            <span>English</span>
                        </div>
                    </div>
                </div>
                {/* Right Side */}
                <div className="w-1/2 p-12 bg-[#111111] rounded-r-lg flex flex-col justify-center">
                    <h1 className="text-4xl font-bold mb-2">Login</h1>
                    <p className="text-gray-400 mb-8">Login to your account</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-sm font-medium text-gray-400">Email</label>
                            <div className="relative mt-1">
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="bg-[#2D2D2D] border border-[#4A4A4A] rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-1 focus:ring-[#D2FF00]"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-400">Password</label>
                            <div className="relative mt-1">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="bg-[#2D2D2D] border border-[#4A4A4A] rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-1 focus:ring-[#D2FF00]"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-[#D2FF00] hover:bg-yellow-400 text-black font-bold py-2.5 rounded-lg mt-4">
                            Login
                        </button>
                    </form>
                    <p className="text-sm text-gray-400 mt-6 text-center">
                        Don't have an account? <Link to="/signup" className="text-[#D2FF00] font-semibold">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login; 
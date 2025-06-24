import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaGoogle, FaGithub, FaGitlab, FaRegUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { FiCheckCircle, FiUsers, FiShield, FiGlobe, FiEye, FiEyeOff } from 'react-icons/fi';
import { BsPatchCheck } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { firstName, lastName, username, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('https://vandralthesisone.onrender.com/api/auth/register', formData);
            console.log(res.data);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            let errorMessage = 'Something went wrong';
            if (err.response && err.response.data) {
                errorMessage = err.response.data;
            } else if (err.request) {
                errorMessage = 'Network Error: Could not connect to the server.';
            } else {
                errorMessage = err.message;
            }
            toast.error(errorMessage);
            console.error(err);
        }
        setLoading(false);
    };

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
            <h2 className="text-4xl mt-8 font-bold">Start your 30-day free trial</h2>
            <div className="flex items-center text-gray-400 mt-4">
                <FiCheckCircle className="mr-2 text-green-500"/>
                <span>No credit card required</span>
            </div>
          </div>
          <div className="space-y-6 flex-grow">
            <div className="flex items-start">
              <FiUsers className="text-[#D2FF00] w-6 h-6 mr-4 mt-1"/>
              <div>
                <h3 className="font-semibold">AI Content Generation</h3>
                <p className="text-gray-400 text-sm">Let our AI write and design your slides from a simple prompt. Focus on your message, not the design.</p>
              </div>
            </div>
            <div className="flex items-start">
              <BsPatchCheck className="text-[#D2FF00] w-6 h-6 mr-4 mt-1"/>
              <div>
                <h3 className="font-semibold">Customizable Templates</h3>
                <p className="text-gray-400 text-sm">Choose from a variety of professionally designed templates to give your presentation a polished look.</p>
              </div>
            </div>
            <div className="flex items-start">
              <FiShield className="text-[#D2FF00] w-6 h-6 mr-4 mt-1"/>
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
              <FiGlobe className="mr-2"/>
              <span>English</span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/2 p-12 bg-[#111111] rounded-r-lg">
          <form onSubmit={onSubmit}>
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label className="text-sm font-medium text-gray-400">First Name</label>
                <div className="relative mt-1">
                  <FaRegUser className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
                  <input type="text" name="firstName" value={firstName} onChange={onChange} placeholder="Alaska" className="bg-[#2D2D2D] border border-[#4A4A4A] rounded-lg py-2.5 pl-10 w-full focus:outline-none focus:ring-1 focus:ring-[#D2FF00]" required />
                </div>
              </div>
              <div className="w-1/2">
                <label className="text-sm font-medium text-gray-400">Last Name</label>
                <div className="relative mt-1">
                  <FaRegUser className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
                  <input type="text" name="lastName" value={lastName} onChange={onChange} placeholder="Young" className="bg-[#2D2D2D] rounded-lg py-2.5 pl-10 w-full ring-1 ring-[#D2FF00] focus:outline-none" required />
                </div>
              </div>
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium text-gray-400">Username</label>
                <div className="relative mt-1">
                    <FaRegUser className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
                    <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" className="bg-[#2D2D2D] border border-[#4A4A4A] rounded-lg py-2.5 pl-10 w-full focus:outline-none focus:ring-1 focus:ring-[#D2FF00]" required />
                </div>
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium text-gray-400">Email</label>
                <div className="relative mt-1">
                    <FaEnvelope className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
                    <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" className="bg-[#2D2D2D] border border-[#4A4A4A] rounded-lg py-2.5 pl-10 w-full focus:outline-none focus:ring-1 focus:ring-[#D2FF00]" required />
                </div>
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium text-gray-400">Password</label>
                <div className="relative mt-1">
                    <FaLock className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
                    <input type={passwordVisible ? "text" : "password"} name="password" value={password} onChange={onChange} placeholder="Password" className="bg-[#2D2D2D] border border-[#4A4A4A] rounded-lg py-2.5 pl-10 w-full focus:outline-none focus:ring-1 focus:ring-[#D2FF00]" required />
                    <button type="button" onClick={togglePasswordVisibility} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 hover:text-white">
                        {passwordVisible ? <FiEyeOff /> : <FiEye />}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Minimum length is 8 characters.</p>
            </div>
            <button type="submit" className="w-full bg-[#D2FF00] hover:bg-yellow-400 text-black font-bold py-2.5 rounded-lg mt-4" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4">By creating an account, you agree to the <Link to="/terms" className="text-[#D2FF00]">Terms of Service</Link>. We'll occasionally send you account-related emails.</p>
          <p className="text-sm text-gray-400 mt-6 text-center">
            Already have an account? <Link to="/login" className="text-[#D2FF00] font-semibold">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 
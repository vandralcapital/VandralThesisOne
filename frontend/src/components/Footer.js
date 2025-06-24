import React from 'react';
import { GitHub, Twitter, Linkedin } from 'react-feather';

const Footer = () => {
  return (
    <footer className="relative border-t border-white/10 bg-[#0A0A0A] pt-16 pb-8 px-4">
      <div 
        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-500/10 via-transparent to-transparent"
        style={{ filter: 'blur(80px)' }}
      ></div>
      <div 
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/10 via-transparent to-transparent"
        style={{ filter: 'blur(80px)' }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-white">
        {/* Left side: Logo and description */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent text-white">SlideWise</h2>
          <p className="text-gray-400 max-w-md">
            Transforming ideas into stunning presentations, effortlessly. Built with AI, designed for impact.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><GitHub /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin /></a>
          </div>
        </div>

        {/* Right side: Links */}
        <div>
            <h3 className="font-semibold mb-4 text-gray-200">Product</h3>
            <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Changelog</a></li>
            </ul>
        </div>
        <div>
            <h3 className="font-semibold mb-4 text-gray-200">Company</h3>
            <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
        </div>
      </div>
       <div className="relative mt-16 border-t border-white/10 pt-8 text-center text-gray-500">
        &copy; {new Date().getFullYear()} SlideWise. All rights reserved | Vandral Capital.
      </div>
    </footer>
  );
};

export default Footer; 
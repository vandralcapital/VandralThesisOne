import React from 'react';
import { Figma, GitHub, Code, Slack, Database, Aperture } from 'react-feather';

const IntegrationCard = ({ icon, name, rowSpan, colSpan }) => {
  const gridRow = rowSpan ? `span ${rowSpan}` : 'span 1';
  const gridCol = colSpan ? `span ${colSpan}` : 'span 1';
  
  return (
    <div
      className="group relative bg-[#101010]/80 backdrop-blur-md rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-[#181818] hover:border-white/20"
      style={{ gridRow, gridColumn: gridCol }}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="text-gray-400 group-hover:text-white transition-colors duration-300 mb-4">
          {icon}
        </div>
        <p className="font-semibold text-gray-300 group-hover:text-white transition-colors duration-300">{name}</p>
      </div>
    </div>
  );
};

const IntegrationsSection = () => {
  const integrations = [
    { name: 'GitHub', icon: <GitHub size={40} />, colSpan: 2 },
    { name: 'Figma', icon: <Figma size={40} /> },
    { name: 'Slack', icon: <Slack size={40} /> },
    { name: 'Custom Scripts', icon: <Code size={40} />, rowSpan: 2, colSpan: 2 },
    { name: 'Database', icon: <Database size={40} /> },
    { name: 'Aperture', icon: <Aperture size={40} /> },
  ];

  return (
    <section className="relative w-full py-24 px-4 overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0 z-0 opacity-50">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '2rem 2rem',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-block bg-gray-800/60 backdrop-blur-sm text-sm text-blue-300 py-1 px-4 rounded-full border border-blue-300/30 mb-4">
          Integrations
        </div>
        <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300">
          Seamless Integrations with Your Favorite Tools and Services
        </h2>
        <p className="text-lg text-gray-400 mt-6 max-w-2xl mx-auto">
          Nucleus integrates with a wide range of third-party tools and toolchains, making it easy to plug into your existing workflows and toolchains.
        </p>
        <button className="mt-8 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg border border-gray-600 transition-all shadow-lg">
          Go to the docs
        </button>
      </div>
      
      <div className="relative max-w-5xl mx-auto mt-20 z-10">
        <div className="grid grid-cols-4 grid-rows-2 gap-6">
          {integrations.map((item, index) => (
            <IntegrationCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection; 
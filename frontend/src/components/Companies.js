import React from 'react';

const Companies = () => {
  const logos = [
    { name: 'Vercel', logo: '▲' },
    { name: 'loom', logo: 'loom' },
    { name: 'Cash App', logo: '$' },
    { name: 'L.oops', logo: 'L.oops' },
    { name: 'zapier', logo: 'zapier' },
    { name: 'ramp', logo: 'ramp' },
    { name: 'Raycast', logo: 'Raycast' },
  ];

  return (
    <div className="bg-transparent py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-12 lg:gap-x-16 text-gray-500">
          {logos.map((company) => (
            <div key={company.name} className="flex items-center space-x-2">
              <span className="font-bold text-lg">{company.logo}</span>
              <span className="font-semibold">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies; 
import React from 'react';
import { Play, Zap, BarChart2, Globe, CheckCircle } from 'react-feather';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-xl ${className}`}>
    {children}
  </div>
);

const GlobeChart = () => (
    <Card className="col-span-1 lg:col-span-2 row-span-2 relative flex flex-col justify-between overflow-hidden">
        <div className="p-4">
            <div className="relative w-48 h-24">
                <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full">
                    <path d="M 0 60 Q 100 -20 200 60" stroke="#4A5568" strokeWidth="0.5" fill="none" />
                </svg>
                <div className="absolute top-[28px] left-[70px] text-center">
                    <div className="w-3 h-3 rounded-full bg-gray-500/70 mx-auto shadow-[0_0_8px_1px_rgba(156,163,175,0.5)]"></div>
                    <p className="text-xs text-gray-400 mt-1">Spot 1</p>
                </div>
                <div className="absolute top-[5px] left-[130px] text-center">
                    <div className="w-3 h-3 rounded-full bg-gray-500/70 mx-auto shadow-[0_0_8px_1px_rgba(156,163,175,0.5)]"></div>
                    <p className="text-xs text-gray-400 mt-1">Spot 2</p>
                </div>
                 <div className="absolute top-[28px] right-[10px] text-center">
                    <div className="w-3 h-3 rounded-full bg-gray-500/70 mx-auto shadow-[0_0_8px_1px_rgba(156,163,175,0.5)]"></div>
                    <p className="text-xs text-gray-400 mt-1">Spot 3</p>
                </div>
            </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center -z-10">
            <svg viewBox="0 0 500 500" className="w-full h-full opacity-20">
                {/* ... globe paths ... */}
            </svg>
        </div>
    </Card>
);

const StatCard = ({ title, value, change }) => (
    <Card className="lg:col-span-2">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-6xl font-bold">{value}</p>
                <p className="text-gray-400">{title}</p>
            </div>
            <div className="text-sm text-gray-400">{change}</div>
        </div>
        <div className="mt-8 flex space-x-2 text-xs">
            <button className="bg-white/10 p-2 rounded-md flex items-center space-x-1"><Play className="w-3 h-3"/><span>Try AI Writer</span></button>
            <button className="bg-white/10 p-2 rounded-md">A: Assign to team</button>
            <button className="bg-white/10 p-2 rounded-md">N: New Slide</button>
        </div>
    </Card>
);

const ChartCard = ({ title, data, hasLabels = false }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
        <Card>
            <p className="font-semibold mb-2">{title}</p>
            <div className="flex items-end h-32 space-x-2">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end relative">
                        <p className="text-xs font-semibold absolute -top-5">{item.value}</p>
                        <div className="w-full bg-gradient-to-t from-gray-700 to-gray-500 rounded-t-md relative" style={{ height: `${(item.value / maxValue) * 100}%`}}>
                             <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(56,189,248,0.7)]"></div>
                        </div>
                        {hasLabels && <p className="text-xs text-gray-500 mt-1">{item.label}</p>}
                    </div>
                ))}
            </div>
        </Card>
    )
};

const InfoCard = ({ title, children, className }) => (
    <Card className={className}>
        <p className="font-semibold mb-2">{title}</p>
        <div className="text-gray-400 text-sm">{children}</div>
    </Card>
);

const GrowthCard = ({ title, value }) => (
    <div className="bg-black/20 p-4 rounded-lg">
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
    </div>
);

const PaletteCard = () => (
    <Card>
        <p className="font-semibold mb-2">Your Palette, Your Growth</p>
        <p className="text-gray-400 text-sm mb-4">Watch your assets grow in a thriving ecosystem so easy</p>
       <div className="grid grid-cols-2 gap-4">
           <GrowthCard title="Designs Created" value="19.2k" />
           <GrowthCard title="Hours Saved" value="2400" />
       </div>
   </Card>
)

const FeatureCard = ({ icon, title, text }) => (
    <Card className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 mb-4">
            {icon}
        </div>
        <p className="text-center text-sm font-semibold">{title}</p>
        <p className="text-center text-xs text-gray-400">{text}</p>
    </Card>
);

const FeaturesSection = () => {
    const chartData2 = [
        { value: 16, label: 'Dec' }, { value: 48, label: 'Jan' }, { value: 32, label: 'Feb' }, 
        { value: 28, label: 'Mar' }, { value: 12, label: 'Apr' }, { value: 24, label: 'May' }
     ];

    return (
        <section className="py-20 px-4 md:px-12 w-full">
            <div className="text-center max-w-4xl mx-auto mb-12">
                <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                    Powerful Features for Perfect Slides
                </h2>
                <p className="text-lg text-gray-400 mt-4">
                    Save your team's precious time. SlideWise replaces the lengthy process of manual presentation design.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                <div className="feature-card lg:col-span-2"><GlobeChart/></div>
                <div className="feature-card"><StatCard title="AI Model Accuracy" value="98.2%" change="+2.5%" /></div>
                <div className="feature-card"><StatCard title="Hours Saved" value="2,400+" change="+15%" /></div>
                <div className="feature-card lg:col-span-2"><ChartCard title="SlideWise Opportunities" data={chartData2} hasLabels={true} /></div>
                <div className="feature-card lg:col-span-2"><PaletteCard /></div>
            </div>
        </section>
    );
};

export default FeaturesSection; 
import React from 'react';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';

const PricingModal = ({ onClose }) => {
  const plans = [
    {
      name: 'Basic',
      price: '$0',
      description: 'For individuals getting started with AI presentations.',
      features: [
        'Up to 5 presentations',
        'Basic AI generation',
        'Access to standard templates',
        'Watermarked exports',
      ],
      buttonText: 'Downgrade to Basic',
    },
    {
      name: 'Pro',
      price: '$12',
      description: 'For professionals who need more power and features.',
      features: [
        'Unlimited presentations',
        'Advanced AI generation',
        'Custom templates',
        'No watermarks',
        'Priority support',
      ],
      buttonText: 'Current Plan',
      isCurrent: true,
    },
    {
      name: 'Enterprise',
      price: 'Contact Us',
      description: 'For teams and organizations with custom needs.',
      features: [
        'All Pro features',
        'Team collaboration',
        'Advanced security & SSO',
        'Dedicated account manager',
      ],
      buttonText: 'Contact Sales',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-[#171717] text-white rounded-lg shadow-xl p-8 max-w-4xl w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <FaTimes size={20} />
        </button>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Upgrade your plan</h1>
          <p className="text-gray-400 mt-2">Choose the plan that fits your needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-[#1C1C1C] p-6 rounded-lg border ${plan.isCurrent ? 'border-purple-600 shadow-lg shadow-purple-600/20' : 'border-gray-800'} flex flex-col`}
            >
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
              <div className="my-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price !== 'Contact Us' && <span className="text-gray-400">/ month</span>}
              </div>
              <ul className="space-y-3 text-sm flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <FaCheckCircle className="text-purple-500 mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full mt-8 py-3 rounded-lg font-bold transition-all ${
                  plan.isCurrent
                    ? 'bg-gray-700 text-gray-400 cursor-default'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
                disabled={plan.isCurrent}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingModal; 
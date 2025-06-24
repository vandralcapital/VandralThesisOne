import React, { useState } from 'react';
import { Plus, Minus } from 'react-feather';

const FaqItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/10 py-6">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left text-lg font-medium text-white hover:text-gray-300 transition-colors"
      >
        <span>{question}</span>
        <span className="text-gray-400">
          {isOpen ? <Minus /> : <Plus />}
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <p className="pt-4 text-gray-400">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    { question: "What is SlideWise?", answer: "SlideWise is an AI-powered platform that automatically generates professional presentations from your text prompts, saving you hours of design work." },
    { question: "How does the AI work?", answer: "Our advanced AI analyzes your content, understands the key points, and then designs a visually appealing presentation with appropriate layouts, images, and branding." },
    { question: "Can I customize the generated presentations?", answer: "Absolutely! SlideWise provides a full suite of editing tools to tweak colors, fonts, layouts, and content, giving you complete control over the final result." },
    { question: "What formats can I export to?", answer: "You can export your presentations to popular formats like PowerPoint (.pptx) and PDF, ensuring compatibility with your existing workflow." },
  ];

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300">
                Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-400 mt-4">
                Have questions? We have answers.
            </p>
        </div>
        <div>
          {faqData.map((item, index) => (
            <FaqItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 
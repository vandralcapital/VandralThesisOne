import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaMagic, FaSpinner, FaArrowRight, FaImage, FaFileAlt, FaChevronDown, FaGripVertical, FaTrash } from 'react-icons/fa';

const AIPresentationGenerator = ({ workspace, onClose, onPresentationCreated }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyline, setStoryline] = useState(null);
  const [currentStep, setCurrentStep] = useState('input'); // input, generating, storyline
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, index: null });
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const draggedItem = useRef(null);
  const draggedOverItem = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [topic]);

  useEffect(() => {
    const closeMenu = (e) => {
      // Don't close if we are clicking on a context menu action
      if (e.target.closest('.context-menu-action')) {
        return;
      }
      setContextMenu({ visible: false, x: 0, y: 0, index: null });
    };

    if (contextMenu.visible) {
      document.addEventListener('click', closeMenu);
      document.addEventListener('contextmenu', closeMenu);
    }

    return () => {
      document.removeEventListener('click', closeMenu);
      document.removeEventListener('contextmenu', closeMenu);
    };
  }, [contextMenu.visible]);

  const seriesAPitchDeckTemplate = `Create a compelling pitch deck for [Company Name] targeting investors to achieve Series A funding. The deck should reflect the following company details:

Industry: [Industry]

Value proposition: [Value proposition]

2-3 key metrics: [Metrics]

Funding goal: [Funding goal]

Structure the deck with a narrative flow, outlining problem -> solution, highlight market and growth potential, differentiators, key metrics, and plans for using funds. Format as limited text of 30 words per slide, data-backed claims, and a clear narrative flow.`;

  const handleGenerateStoryline = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic for your presentation');
      return;
    }

    setIsGenerating(true);
    setCurrentStep('generating');

    try {
      const response = await axios.post(
        'http://localhost:5001/api/presentations/generate-storyline',
        { topic: topic.trim() },
        { headers: { 'auth-token': localStorage.getItem('token') } }
      );
      setStoryline(response.data);
      setCurrentStep('storyline');
      toast.success('Storyline generated successfully!');
    } catch (error) {
      console.error('Error generating storyline:', error);
      toast.error(error.response?.data || 'Failed to generate storyline');
      setCurrentStep('input');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreatePresentation = async () => {
    if (!storyline || storyline.storyline.length === 0) {
        toast.error("Storyline is empty. Cannot create a presentation.");
        return;
    }
    
    setIsGenerating(true);
    setCurrentStep('generating');
    
    try {
      const response = await axios.post(
        'http://localhost:5001/api/presentations/generate',
        {
          storyline: storyline,
          workspaceId: workspace._id
        },
        { headers: { 'auth-token': localStorage.getItem('token') } }
      );
      
      if (onPresentationCreated) {
        onPresentationCreated(response.data.presentation);
      }
      onClose();
      navigate(`/presentation/${response.data.presentation._id}`);
      
    } catch (error) {
      console.error('Error creating final presentation:', error);
      toast.error(error.response?.data || 'Failed to create the final presentation');
      setStoryline(null);
      setCurrentStep('input');
    } finally {
        setIsGenerating(false);
    }
  };

  const handleRetry = () => {
    setTopic('');
    setStoryline(null);
    setCurrentStep('input');
  };

  const handleSort = () => {
    const storylineClone = {...storyline};
    const temp = storylineClone.storyline[draggedItem.current];
    storylineClone.storyline[draggedItem.current] = storylineClone.storyline[draggedOverItem.current];
    storylineClone.storyline[draggedOverItem.current] = temp;

    const reorderedStoryline = storylineClone.storyline.map((item, index) => ({
      ...item,
      chapter: index + 1
    }));
    
    setStoryline({ ...storyline, storyline: reorderedStoryline });
    draggedItem.current = null;
    draggedOverItem.current = null;
  };

  const handleContextMenu = (event, index) => {
    event.preventDefault();
    event.stopPropagation(); // Prevent the event from bubbling up to the document
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      index: index,
    });
  };

  const handleDeleteChapter = () => {
    if (contextMenu.index === null) return;

    const updatedChapters = storyline.storyline.filter(
      (_, i) => i !== contextMenu.index
    );
    const renumberedChapters = updatedChapters.map((chapter, i) => ({
        ...chapter,
        chapter: i + 1,
    }));

    setStoryline({
      ...storyline,
      storyline: renumberedChapters,
    });

    // Hide the context menu after deletion
    setContextMenu({ visible: false, x: 0, y: 0, index: null });
  };

  if (currentStep === 'generating') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-[#1C1C1C] p-8 rounded-lg max-w-md w-full mx-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <FaSpinner className="animate-spin text-2xl text-blue-400 mr-3" />
            <span className="text-xl font-semibold">Generating...</span>
          </div>
          <p className="text-gray-400 mb-4">
            Our AI is hard at work. This may take a moment...
          </p>
        </div>
      </div>
    );
  }

  if (currentStep === 'storyline') {
    return (
      <>
        {contextMenu.visible && (
            <div
                style={{ top: contextMenu.y, left: contextMenu.x }}
                className="fixed z-50 bg-[#333] rounded-md shadow-lg py-1 border border-gray-700"
            >
                <button
                    onClick={handleDeleteChapter}
                    className="context-menu-action flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white"
                >
                    <FaTrash className="mr-2 h-4 w-4" />
                    <span>Delete Chapter</span>
                </button>
            </div>
        )}
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 p-4">
            <div className="bg-[#1C1C1C] rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
                <div className='p-6'>
                    <button onClick={handleRetry} className="text-sm text-gray-300 hover:text-white">← Back</button>
                </div>
                <div className="flex-grow overflow-y-auto px-10 pb-6">
                    <p className='text-sm text-gray-400'>Storyline</p>
                    <h1 className='text-4xl font-bold mt-2 text-white'>{storyline.title}</h1>
                    <p className='text-lg text-gray-300 mt-2'>{storyline.subtitle}</p>

                    <div className='mt-10 space-y-8'>
                        {storyline.storyline.map((item, index) => (
                            <div 
                              key={item.chapter} 
                              className="flex items-start group"
                              draggable
                              onDragStart={() => (draggedItem.current = index)}
                              onDragEnter={() => (draggedOverItem.current = index)}
                              onDragEnd={handleSort}
                              onDragOver={(e) => e.preventDefault()}
                              onContextMenu={(e) => handleContextMenu(e, index)}
                            >
                                <FaGripVertical className="text-gray-600 mr-4 mt-2 invisible group-hover:visible cursor-grab" />
                                <div className="text-xl font-bold text-gray-500 mr-6">{String(item.chapter).padStart(2, '0')}</div>
                                <div className="flex-grow">
                                    <div className='flex justify-between items-center'>
                                        <h2 className='text-2xl font-semibold text-white'>{item.title}</h2>
                                        <button className='text-sm text-gray-400 flex items-center space-x-2'>
                                            <span>2 col description</span>
                                            <FaChevronDown className='w-3 h-3'/>
                                        </button>
                                    </div>
                                    <p className='mt-2 text-gray-400'>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-6 border-t border-gray-800 bg-[#1C1C1C] flex justify-between items-center">
                    <div>
                        <button className="px-4 py-2 text-sm bg-[#2A2A2A] border border-gray-700 rounded-lg mr-2">Theme</button>
                        <button className="px-4 py-2 text-sm bg-[#2A2A2A] border border-gray-700 rounded-lg">Create skeleton</button>
                    </div>
                    <div className='flex items-center space-x-4'>
                        <span className='text-sm text-green-400'>◆ Storyline created</span>
                        <button onClick={handleRetry} className='text-sm text-gray-300 hover:text-white'>Retry</button>
                        <button onClick={handleCreatePresentation} className="px-6 py-2 text-sm bg-white text-black font-semibold rounded-lg">
                            Generate presentation →
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C1C1C] p-8 rounded-lg max-w-2xl w-full mx-4 max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Generate AI Presentation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What would you like to present about?
            </label>
            <textarea
              ref={textareaRef}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The Future of Artificial Intelligence, Digital Marketing Strategies, Climate Change Solutions..."
              className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none overflow-y-hidden"
              rows="4"
            />
          </div>
          
          <div>
            {/* Removed example buttons */}
          </div>
          
          <div className="bg-[#2A2A2A] p-4 rounded-lg border border-gray-700">
            <h3 className="font-semibold mb-3 flex items-center">
              <FaMagic className="mr-2 text-blue-400" />
              What our AI will create:
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                A structured storyline with chapters
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Professionally written slide titles and content
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Visual descriptions for relevant images
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                A complete presentation ready to customize
              </li>
            </ul>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-transparent border border-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateStoryline}
              disabled={!topic.trim() || isGenerating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              {isGenerating ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FaMagic />
                  <span>Generate Presentation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPresentationGenerator; 
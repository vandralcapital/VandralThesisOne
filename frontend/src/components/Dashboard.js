import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import PricingModal from './PricingModal';
import SettingsModal from './SettingsModal';
import AIPresentationGenerator from './AIPresentationGenerator';
import { FaFileImport, FaMagic, FaLink, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [refreshPresentations, setRefreshPresentations] = useState(false);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleLogout();
      return;
    }

    const fetchUser = async () => {
      try {
        const config = {
          headers: {
            'auth-token': token,
          },
        };
        const res = await axios.get('http://localhost:5001/api/user/me', config);
        setUser(res.data);
        if (res.data.workspaces && res.data.workspaces.length > 0) {
          setActiveWorkspace(res.data.workspaces[0]);
        } else {
          toast.error('Your user account is outdated. Please sign up again to get the new workspace features.', { duration: 6000 });
          handleLogout();
        }
      } catch (err) {
        console.error('Failed to fetch user. Logging out.', err.response ? err.response.data : err.message);
        handleLogout();
      }
    };

    fetchUser();
  }, [navigate, handleLogout]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const togglePricingModal = () => {
    setIsPricingModalOpen(!isPricingModalOpen);
  };

  const toggleSettingsModal = () => {
    setIsSettingsModalOpen(!isSettingsModalOpen);
  };

  const toggleAIGenerator = () => {
    setIsAIGeneratorOpen(!isAIGeneratorOpen);
  };

  const handleUpdateWorkspace = async (newName, newLogoFile) => {
    if (!activeWorkspace) return;
    try {
      // NOTE: Logo upload functionality has been temporarily removed
      // and will need to be re-implemented with the new data structure.
      const res = await axios.put(`http://localhost:5001/api/workspaces/${activeWorkspace._id}`, 
        { name: newName },
        { headers: { 'auth-token': localStorage.getItem('token') } }
      );

      setActiveWorkspace(res.data);
      toast.success('Workspace updated successfully!');

    } catch (err) {
      console.error('Failed to update workspace', err);
      toast.error(err.response?.data?.message || 'Could not update workspace.');
    }
  };

  const handlePresentationCreated = (presentation) => {
    // Trigger refresh of presentations in sidebar
    setRefreshPresentations(prev => !prev);
    toast.success(`Presentation "${presentation.title}" created successfully!`);
  };

  const options = [
    {
      icon: <FaMagic className="text-2xl text-blue-400" />,
      title: 'Generate with AI',
      description: 'Start with a simple prompt and let our AI create your first draft.',
      onClick: toggleAIGenerator,
    },
  ];

  if (!user || !activeWorkspace) {
    return null; // Or a loading spinner
  }

  return (
    <div className="relative flex h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      {!sidebarOpen && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-[#171717] rounded-md text-white hover:bg-gray-800 transition-colors"
          aria-label="Open sidebar"
        >
          <FaChevronRight />
        </button>
      )}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        togglePricingModal={togglePricingModal}
        toggleSettingsModal={toggleSettingsModal} 
        user={user} 
        handleLogout={handleLogout}
        workspace={activeWorkspace}
        refreshPresentations={refreshPresentations}
      />
      <main className={`flex-1 flex flex-col items-center justify-center p-10 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="text-center w-full max-w-4xl">
          <h1 className="text-4xl font-bold mb-2">Create a new Presentation</h1>
          <p className="text-gray-400 mb-10">How would you like to get started?</p>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
            {options.map((option, index) => (
              <div 
                key={index} 
                className="bg-[#1C1C1C] p-8 rounded-lg text-center flex flex-col items-center justify-center border border-gray-800 hover:border-gray-700 cursor-pointer transition-colors"
                onClick={option.onClick}
              >
                {option.icon}
                <h3 className="font-bold mt-5 mb-2 text-base">{option.title}</h3>
                <p className="text-sm text-gray-400">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      {isPricingModalOpen && <PricingModal onClose={togglePricingModal} />}
      {isSettingsModalOpen && 
        <SettingsModal 
          onClose={toggleSettingsModal} 
          user={user} 
          workspace={activeWorkspace}
          onUpdateWorkspace={handleUpdateWorkspace}
        />
      }
      {isAIGeneratorOpen && 
        <AIPresentationGenerator 
          workspace={activeWorkspace}
          onClose={toggleAIGenerator}
          onPresentationCreated={handlePresentationCreated}
        />
      }
    </div>
  );
};

export default Dashboard; 
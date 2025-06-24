import React, { useState, useEffect } from 'react';
import { FaBook, FaCog, FaQuestionCircle, FaChevronLeft, FaSignOutAlt, FaRocket, FaPlus, FaCheck, FaTrash } from 'react-icons/fa';
import { HiOutlineChevronUpDown } from "react-icons/hi2";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar, togglePricingModal, toggleSettingsModal, user, handleLogout, workspace, refreshPresentations }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [presentations, setPresentations] = useState([]);
  const navigate = useNavigate();

  const fetchInvitations = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/invitations', {
        headers: { 'auth-token': localStorage.getItem('token') }
      });
      setInvitations(res.data);
    } catch (error) {
      console.error('Failed to fetch invitations', error);
    }
  };

  const fetchPresentations = async () => {
    if (!workspace) return;
    try {
      const res = await axios.get(`http://localhost:5001/api/presentations?workspaceId=${workspace._id}`, {
        headers: { 'auth-token': localStorage.getItem('token') }
      });
      setPresentations(res.data);
    } catch (error) {
      console.error('Failed to fetch presentations', error);
    }
  };

  useEffect(() => {
    if(user) {
        fetchInvitations();
    }
    if (workspace) {
        fetchPresentations();
    }
  }, [user, workspace]);

  // Listen for refresh requests from parent component
  useEffect(() => {
    if (refreshPresentations) {
      fetchPresentations();
    }
  }, [refreshPresentations]);

  const handleAcceptInvite = async (id) => {
    try {
      await axios.post(`http://localhost:5001/api/invitations/${id}/accept`, {}, {
        headers: { 'auth-token': localStorage.getItem('token') }
      });
      toast.success('Invitation accepted!');
      window.location.reload(); // Reload to get new workspace list
    } catch (error) {
      toast.error('Failed to accept invitation.');
    }
  };

  const handleDeclineInvite = async (id) => {
    // This is a new function for declining, which we can add later
    toast('Decline functionality not implemented yet.');
  };

  const handleAddWorkspace = () => {
    alert('Add workspace functionality not implemented yet.');
  };

  const getInitials = (user) => {
    if (!user) return 'U';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  const handleDeletePresentation = async (presentationId) => {
    if (!window.confirm('Are you sure you want to delete this presentation?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/presentations/${presentationId}`, {
        headers: { 'auth-token': localStorage.getItem('token') }
      });
      toast.success('Presentation deleted!');
      setPresentations(prev => prev.filter(p => p._id !== presentationId));
    } catch (error) {
      toast.error('Failed to delete presentation.');
    }
  };

  if (!workspace) return null;

  return (
    <div className={`fixed top-0 left-0 h-full bg-[#171717] text-white flex flex-col justify-between z-40 w-72 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div>
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-800 h-[69px]">
          <div className="relative w-full flex items-center justify-between">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex-grow flex items-center text-left p-2 rounded-md hover:bg-gray-700/50"
            >
              <div className="flex items-center">
                  {workspace.logoUrl ? (
                    <img src={workspace.logoUrl} alt="Workspace Logo" className="w-6 h-6 rounded-md mr-3" />
                  ) : (
                    <div className="w-6 h-6 bg-purple-600 rounded-md mr-3 flex items-center justify-center text-sm font-bold">{getInitials(user)}</div>
                  )}
                  <div>
                    <span className="font-bold text-sm whitespace-nowrap">{workspace.name}</span>
                    <span className="text-xs text-gray-400 block text-left">Pro plan</span>
                  </div>
              </div>
              <HiOutlineChevronUpDown className="text-gray-400 ml-auto" />
            </button>
            <button onClick={toggleSidebar} className="p-2 ml-2 rounded-md hover:bg-gray-700/50">
              <FaChevronLeft />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full mt-2 w-full bg-[#282828] rounded-lg shadow-lg z-10 p-2">
                <a href="#" className="flex items-center justify-between p-2 rounded-md hover:bg-gray-600">
                  <div className="flex items-center">
                      {workspace.logoUrl ? (
                        <img src={workspace.logoUrl} alt="Workspace Logo" className="w-6 h-6 rounded-md mr-3" />
                      ) : (
                        <div className="w-6 h-6 bg-purple-600 rounded-md mr-3 flex items-center justify-center text-sm font-bold">{getInitials(user)}</div>
                      )}
                      <span className="whitespace-nowrap">{workspace.name}</span>
                  </div>
                  <FaCheck className="text-white" />
                </a>
                {/* Invitations */}
                {invitations.length > 0 && (
                  <>
                    <div className="border-t border-gray-700 my-2"></div>
                    <h4 className="px-2 py-1 text-xs text-gray-400">Invitations</h4>
                    {invitations.map(invite => (
                      <div key={invite._id} className="p-2 rounded-md hover:bg-gray-600">
                        <p className="text-sm">
                          Join <span className="font-bold">{invite.workspace.name}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Invited by {invite.sender.firstName} {invite.sender.lastName}
                        </p>
                        <div className="flex items-center justify-end space-x-2 mt-2">
                          <button onClick={() => handleDeclineInvite(invite._id)} className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-500">Decline</button>
                          <button onClick={() => handleAcceptInvite(invite._id)} className="text-xs px-2 py-1 rounded bg-purple-600 hover:bg-purple-700">Accept</button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                <div className="border-t border-gray-700 my-2"></div>
                <a onClick={handleLogout} href="#" className="flex items-center p-2 rounded-md hover:bg-gray-600">
                  <FaSignOutAlt className="mr-3" />
                  <span>Logout</span>
                </a>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-2">
            {presentations.map(presentation => (
                <div
                  key={presentation._id}
                  className="flex items-center p-2 text-sm rounded-md text-gray-300 hover:bg-gray-700/50 hover:text-white group cursor-pointer"
                  onClick={e => {
                    // Only navigate if not clicking the delete button
                    if (e.target.closest('button')) return;
                    navigate(`/presentation/${presentation._id}`);
                  }}
                >
                    <FaBook className="mr-3" />
                    <span className="flex-1">{presentation.title}</span>
                    <button
                      className="ml-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete presentation"
                      onClick={e => { e.stopPropagation(); handleDeletePresentation(presentation._id); }}
                    >
                      <FaTrash />
                    </button>
                </div>
            ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 space-y-2 border-t border-gray-800">
        <a href="#" onClick={toggleSettingsModal} className="flex items-center p-2 rounded-md hover:bg-gray-700/50 text-sm text-gray-300 hover:text-white">
          <FaCog className="mr-3" />
          <span>Settings</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar; 
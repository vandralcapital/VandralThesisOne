import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SettingsModal = ({ onClose, user, workspace, onUpdateWorkspace }) => {
  const [activeTab, setActiveTab] = useState('General');
  const [workspaceName, setWorkspaceName] = useState(workspace ? workspace.name : '');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(workspace ? workspace.logoUrl : null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [members, setMembers] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const fileInputRef = useRef(null);

  const fetchWorkspaceData = async () => {
    if (workspace) {
      try {
        const config = { headers: { 'auth-token': localStorage.getItem('token') } };
        const membersRes = await axios.get(`https://vandralthesisone.onrender.com/api/workspaces/${workspace._id}`, config);
        setMembers(membersRes.data.members);

        const invitesRes = await axios.get(`https://vandralthesisone.onrender.com/api/workspaces/${workspace._id}/invitations`, config);
        setPendingInvites(invitesRes.data);
      } catch (error) {
        toast.error('Could not load workspace members.');
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'Members') {
      fetchWorkspaceData();
    }
  }, [activeTab, workspace]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = () => {
    onUpdateWorkspace(workspaceName, logoFile);
    onClose();
  };

  const handleSendInvite = async () => {
    if (!inviteEmail) return toast.error('Please enter an email address.');
    try {
      const res = await axios.post('https://vandralthesisone.onrender.com/api/invitations',
        { recipientEmail: inviteEmail, workspaceId: workspace._id },
        { headers: { 'auth-token': localStorage.getItem('token') } }
      );
      toast.success('Invitation sent!');
      setInviteEmail('');
      setPendingInvites([...pendingInvites, res.data]);
    } catch (err) {
      toast.error(err.response?.data || 'Failed to send invitation.');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }

    try {
      const res = await axios.post('https://vandralthesisone.onrender.com/api/user/change-password', 
        { oldPassword, newPassword },
        { headers: { 'auth-token': localStorage.getItem('token') } }
      );
      toast.success(res.data);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data || 'Failed to change password.');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Members':
        return (
          <div>
            <h2 className="text-xl font-bold">Members</h2>
            <p className="text-gray-400 text-sm mt-1">
              {members.length} {members.length === 1 ? 'person has' : 'people have'} access to this workspace.
            </p>
            
            <div className="mt-8 border-t border-gray-800 pt-8">
              <h3 className="text-sm font-semibold text-gray-400">Invite a new member</h3>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="flex-grow p-2 bg-[#1C1C1C] border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                />
                <button onClick={handleSendInvite} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">Send Invite</button>
              </div>
            </div>

            <ul className="mt-8 pt-8 border-t border-gray-800 space-y-4">
              {members.map(member => (
                <li key={member._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-600 rounded-full mr-4 flex items-center justify-center text-sm font-bold">
                      {member.firstName[0]}{member.lastName[0]}
                    </div>
                    <div>
                      <span className="font-bold">{member.firstName} {member.lastName}</span>
                      <span className="text-gray-400 block text-sm">{member.email}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {workspace.owner === member._id ? 'Owner' : 'Member'}
                  </span>
                </li>
              ))}
            </ul>

            {pendingInvites.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-800">
                <h3 className="text-sm font-semibold text-gray-400">Pending Invitations</h3>
                <ul className="mt-4 space-y-4">
                  {pendingInvites.map(invite => (
                    <li key={invite._id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-700 rounded-full mr-4 flex items-center justify-center text-lg font-bold">?</div>
                        <div>
                          <span className="font-bold text-gray-400">{invite.recipientEmail}</span>
                        </div>
                      </div>
                      <span className="text-sm text-yellow-500">Pending</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      case 'Preferences':
        return (
          <div>
            <h2 className="text-xl font-bold">Preferences</h2>
            <p className="text-gray-400 text-sm mt-1">Manage your account preferences</p>
            
            <div className="mt-8 border-t border-gray-800 pt-8">
              <h3 className="text-sm font-semibold text-gray-400">Change Password</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs text-gray-500">Current Password</label>
                  <input 
                    type="password" 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full mt-1 p-2 bg-[#1C1C1C] border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500" 
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full mt-1 p-2 bg-[#1C1C1C] border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500" 
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mt-1 p-2 bg-[#1C1C1C] border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500" 
                  />
                </div>
                <button onClick={handleChangePassword} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">Change Password</button>
              </div>
            </div>
          </div>
        );
      case 'General':
        return (
          <div>
            <h2 className="text-xl font-bold">Workspace</h2>
            <p className="text-gray-400 text-sm mt-1">Manage your work space settings — {workspace.name}</p>
            
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-400">Logo</h3>
              <div className="mt-2 flex items-center space-x-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoChange}
                  className="hidden"
                  accept="image/*"
                />
                <div className="w-20 h-20 bg-[#1C1C1C] border border-gray-700 rounded-lg flex items-center justify-center">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <button onClick={() => fileInputRef.current.click()} className="p-3 border border-dashed border-gray-600 rounded-md hover:bg-gray-800">
                        <FaUpload className="text-gray-500" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500">Upload a logo for your workspace.<br/>Recommended size is 256x256px</p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-800 pt-8">
                <h3 className="text-sm font-semibold text-gray-400">General</h3>
                <div className="mt-2">
                    <label className="text-xs text-gray-500">Workspace Name</label>
                    <div className="flex items-center space-x-2 mt-1">
                        <input 
                            type="text" 
                            value={workspaceName}
                            onChange={(e) => setWorkspaceName(e.target.value)}
                            className="flex-grow p-2 bg-[#1C1C1C] border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500" 
                        />
                        <button onClick={handleUpdate} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Update</button>
                    </div>
                </div>
            </div>
          </div>
        );
      default:
        return <div>Select a category</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-[#171717] text-white rounded-lg shadow-xl w-full max-w-4xl h-[70vh] flex relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <FaTimes size={20} />
        </button>

        {/* Left Nav */}
        <div className="w-1/4 bg-[#1C1C1C] rounded-l-lg p-6 flex flex-col space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Account</h3>
            <a href="#" onClick={() => setActiveTab('Preferences')} className={`block p-2 rounded-md text-sm ${activeTab === 'Preferences' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>Preferences</a>
            <a href="#" onClick={() => setActiveTab('General')} className={`block p-2 rounded-md text-sm ${activeTab === 'General' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>General</a>
            <a href="#" onClick={() => setActiveTab('Members')} className={`block p-2 rounded-md text-sm ${activeTab === 'Members' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>Members</a>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-3/4 p-8 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Account = () => {
    const [user, setUser] = useState(null);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const config = { headers: { 'auth-token': token } };
                    const res = await axios.get('http://localhost:5001/api/user/me', config);
                    setUser(res.data);
                } catch (err) {
                    console.error('Could not fetch user', err);
                }
            }
        };
        fetchUser();
    }, []);

    const onPasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        toast.error("This feature is not yet implemented.");
        setLoading(false);
    };

    if (!user) {
        return <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen text-white p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
                
                <div className="bg-gray-800 p-6 rounded-lg mb-8">
                    <h2 className="text-xl font-semibold mb-4">User Information</h2>
                    <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                    <form onSubmit={onPasswordChange}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-1 focus:ring-yellow-400"
                                placeholder="Enter new password"
                                required
                                minLength="8"
                            />
                        </div>
                        <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Account; 
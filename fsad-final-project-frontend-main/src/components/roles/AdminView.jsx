import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Shield, Settings, BarChart3, Plus, Search, MoreVertical, Trash2, ShieldAlert, CheckCircle, X, TrendingUp, UserPlus, Mail, ShieldCheck, ArrowLeft, Edit2, Clock, BookOpen, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from '../../services/api';

export default function AdminView({ theme, onAddCourse, onAddAssignment, assignments, courses }) {
  const [activeModule, setActiveModule] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (activeModule === 'users') {
      fetchUsers();
    }
    if (activeModule === 'logins') {
      fetchLoginHistory();
    }
  }, [activeModule]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await api.users.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchLoginHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await api.logins.getAll();
      setLoginHistory(data);
    } catch (error) {
      console.error('Error fetching login history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const [newCourse, setNewCourse] = useState({ title: '', description: '', category: 'Programming' });

  const analyticsData = [
    { name: 'Mon', users: 400, revenue: 2400 },
    { name: 'Tue', users: 300, revenue: 1398 },
    { name: 'Wed', users: 200, revenue: 9800 },
    { name: 'Thu', users: 278, revenue: 3908 },
    { name: 'Fri', users: 189, revenue: 4800 },
    { name: 'Sat', users: 239, revenue: 3800 },
    { name: 'Sun', users: 349, revenue: 4300 },
  ];

  const roleDistribution = [
    { name: 'Students', value: 850 },
    { name: 'Instructors', value: 120 },
    { name: 'Creators', value: 45 },
  ];

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b'];

  const handleAddUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role')
    };
    try {
      const newUser = await api.users.add(userData);
      setUsers([...users, newUser]);
      setShowAddUser(false);
      setShowSuccess('User added successfully!');
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (newCourse.title) {
      onAddCourse(newCourse);
      setNewCourse({ title: '', description: '', category: 'Programming' });
      setShowCourseModal(false);
      setShowSuccess('Course created successfully!');
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.users.delete(id);
      setUsers(users.filter(u => u.id !== id));
      setShowSuccess('User deleted successfully!');
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const saveSettings = () => {
    setShowSuccess('Settings saved successfully!');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (activeModule === 'analytics') {
    return (
      <div className="space-y-8">
        <button 
          onClick={() => setActiveModule(null)}
          className="flex items-center gap-2 text-indigo-600 font-bold hover:underline mb-4"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`lg:col-span-2 p-8 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50'}`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black">User Growth</h3>
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                <TrendingUp size={16} /> +24% this week
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#f3f4f6'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`p-8 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50'}`}>
            <h3 className="text-xl font-black mb-8">Role Distribution</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3">
              {roleDistribution.map((role, i) => (
                <div key={role.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-sm font-medium text-gray-500">{role.name}</span>
                  </div>
                  <span className="text-sm font-bold">{role.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeModule === 'users') {
    return (
      <div className="space-y-8">
        <button 
          onClick={() => setActiveModule(null)}
          className="flex items-center gap-2 text-indigo-600 font-bold hover:underline mb-4"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <div className={`rounded-3xl border overflow-hidden transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50'}`}>
          <div className="p-6 border-b dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-xl font-black">User Management</h3>
            <button 
              onClick={() => setShowAddUser(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
            >
              <Plus size={18} /> Add User
            </button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className={`text-xs font-black uppercase tracking-widest text-gray-400 border-b dark:border-gray-800 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {loadingUsers ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-bold">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-bold">No users found.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 font-bold">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        user.role === 'Instructor' ? 'bg-purple-100 text-purple-600' : 
                        user.role === 'Admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-indigo-600 transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => deleteUser(user.id)} className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeModule === 'courses') {
    return (
      <div className="space-y-8">
        <button 
          onClick={() => setActiveModule(null)}
          className="flex items-center gap-2 text-indigo-600 font-bold hover:underline mb-4"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <div className={`rounded-3xl border overflow-hidden transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50'}`}>
          <div className="p-6 border-b dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-xl font-black">Course Management</h3>
            <button 
              onClick={() => setShowCourseModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
            >
              <Plus size={18} /> Create Course
            </button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className={`text-xs font-black uppercase tracking-widest text-gray-400 border-b dark:border-gray-800 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <th className="px-6 py-4">Course Title</th>
                <th className="px-6 py-4">Instructor</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {courses.map(course => (
                <tr key={course.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 font-bold">{course.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{course.instructor}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Programming</td>
                  <td className="px-6 py-4">
                    <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${course.color}`} style={{ width: `${course.progress}%` }} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-indigo-600 transition-colors"><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeModule === 'security') {
    return (
      <div className="space-y-8">
        <button 
          onClick={() => setActiveModule(null)}
          className="flex items-center gap-2 text-indigo-600 font-bold hover:underline mb-4"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={`p-8 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50'}`}>
            <h3 className="text-xl font-black mb-6">Security Audit</h3>
            <div className="space-y-4">
              {[
                { event: 'Failed login attempt', ip: '192.168.1.1', time: '2m ago', severity: 'high' },
                { event: 'New admin created', ip: '192.168.1.45', time: '1h ago', severity: 'medium' },
                { event: 'Database backup', ip: 'System', time: '4h ago', severity: 'low' },
              ].map((event, i) => (
                <div key={i} className={`p-4 rounded-2xl border flex items-center justify-between ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                  <div>
                    <p className="font-bold text-sm">{event.event}</p>
                    <p className="text-xs text-gray-500">{event.ip} • {event.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    event.severity === 'high' ? 'bg-red-100 text-red-600' : 
                    event.severity === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {event.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className={`p-8 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50'}`}>
            <h3 className="text-xl font-black mb-6">Access Control</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Enforce 2FA for all admin accounts</p>
                </div>
                <div className="w-12 h-6 bg-indigo-600 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">IP Whitelisting</p>
                  <p className="text-xs text-gray-500">Restrict access to office IP range</p>
                </div>
                <div className="w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeModule === 'logins') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => setActiveModule(null)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors">
            <ArrowLeft size={20} /> Back to Dashboard
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl font-bold text-sm">
            <Clock size={18} /> Real-time Backend Logs
          </div>
        </div>

        <div className={`p-8 rounded-3xl border-2 transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Login History</h2>
              <p className="text-gray-500 font-medium">Every time someone logs in, the backend saves it here.</p>
            </div>
            <button 
              onClick={fetchLoginHistory}
              className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
              title="Refresh Logs"
            >
              <TrendingUp size={20} className={loadingHistory ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100 dark:border-gray-800">
                  <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">User Email</th>
                  <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">Role</th>
                  <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">Timestamp</th>
                  <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {loadingHistory ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-400 font-bold">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        Loading backend logs...
                      </div>
                    </td>
                  </tr>
                ) : loginHistory.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-400 font-bold italic">
                      No login records found in the database.
                    </td>
                  </tr>
                ) : (
                  loginHistory.map((log) => (
                    <tr key={log.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                            {log.email[0].toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">{log.email}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-black uppercase tracking-widest">
                          {log.role}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-500 font-medium">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs">
                          <CheckCircle size={14} />
                          Saved to DB
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (activeModule === 'settings') {
    return (
      <div className="space-y-8">
        <button 
          onClick={() => setActiveModule(null)}
          className="flex items-center gap-2 text-indigo-600 font-bold hover:underline mb-4"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <div className={`max-w-2xl mx-auto p-8 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50'}`}>
          <h3 className="text-2xl font-black mb-8">Global Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Platform Name</label>
              <input type="text" defaultValue="LMS Pro" className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-indigo-600 transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Support Email</label>
              <input type="email" defaultValue="support@lmspro.com" className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-indigo-600 transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10">
              <div>
                <p className="font-bold text-indigo-600">Maintenance Mode</p>
                <p className="text-xs text-indigo-400">Disable platform access for users</p>
              </div>
              <div className="w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full relative">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <button 
              onClick={saveSettings}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
            >
              Save Global Configuration
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-3"
          >
            <CheckCircle size={20} /> {showSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-4xl font-black tracking-tight">Administration</h2>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live DB
            </div>
          </div>
          <p className="text-gray-500">Global system control and platform-wide analytics.</p>
        </div>
        <div className="flex gap-3">
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">DB Status</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Operational</span>
              </div>
            </div>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Server</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">v2.4.0-prod</span>
            </div>
          </div>
          <button 
            onClick={() => setActiveModule('logins')}
            className="bg-white border-2 border-gray-100 text-gray-600 px-6 py-3 rounded-2xl text-sm font-bold hover:border-purple-200 hover:bg-purple-50 transition-all flex items-center gap-2"
          >
            <Clock size={18} /> View Backend Logs
          </button>
          <button 
            onClick={() => setShowAddUser(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <UserPlus size={18} /> Add New User
          </button>
        </div>
      </header>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'bg-blue-500' },
          { id: 'users', label: 'Users', icon: Users, color: 'bg-indigo-500' },
          { id: 'courses', label: 'Courses', icon: BookOpen, color: 'bg-purple-500' },
          { id: 'logins', label: 'Logins', icon: Clock, color: 'bg-orange-500' },
          { id: 'security', label: 'Security', icon: Shield, color: 'bg-emerald-500' },
          { id: 'settings', label: 'Settings', icon: Settings, color: 'bg-gray-500' },
        ].map(module => (
          <button
            key={module.id}
            onClick={() => setActiveModule(module.id)}
            className={`p-6 rounded-3xl border text-left transition-all ${
              activeModule === module.id 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200' 
                : `${theme === 'dark' ? 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50 shadow-sm'}`
            }`}
          >
            <module.icon size={24} className={activeModule === module.id ? 'text-white' : 'text-indigo-500'} />
            <p className="mt-4 font-black text-lg">{module.label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`p-8 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50'}`}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black">System Integrity</h3>
              <p className="text-sm text-gray-500">All systems operational</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Firewall Status', status: 'Active', color: 'text-emerald-500' },
              { label: 'SSL Certificate', status: 'Valid', color: 'text-emerald-500' },
              { label: 'Database Encryption', status: 'Enabled', color: 'text-emerald-500' },
              { label: 'Last Security Audit', status: '2 hours ago', color: 'text-gray-500' },
            ].map(item => (
              <div key={item.label} className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <span className="font-bold text-sm">{item.label}</span>
                <span className={`text-sm font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-8 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50'}`}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black">Access Logs</h3>
              <p className="text-sm text-gray-500">Recent administrative actions</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { user: 'Admin', action: 'Modified Global Settings', time: '10m ago' },
              { user: 'Dr. Sarah', action: 'Created New Course', time: '45m ago' },
              { user: 'Admin', action: 'Added New User', time: '1h ago' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-bold">{log.user}</span>
                  <span className="text-gray-500 ml-2">{log.action}</span>
                </div>
                <span className="text-gray-400 text-xs">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`w-full max-w-md rounded-3xl p-8 transition-colors ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">Add New User</h3>
                <button onClick={() => setShowAddUser(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                  <input 
                    name="name"
                    required
                    type="text" 
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-indigo-600 transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                  <input 
                    name="email"
                    required
                    type="email" 
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-indigo-600 transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Role</label>
                  <select 
                    name="role"
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-indigo-600 transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
                  >
                    <option>Student</option>
                    <option>Instructor</option>
                    <option>Content Creator</option>
                    <option>Admin</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all mt-4">
                  Create User Account
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showCourseModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`w-full max-w-md rounded-3xl p-8 transition-colors ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">Create New Course</h3>
                <button onClick={() => setShowCourseModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Course Title</label>
                  <input 
                    required
                    type="text" 
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-indigo-600 transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
                    placeholder="e.g. Full Stack Web Dev"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                  <textarea 
                    required
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-indigo-600 transition-colors h-24 resize-none ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
                    placeholder="What will students learn?"
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all mt-4">
                  Create Course
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

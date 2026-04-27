import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogOut, Bell, Search, Moon, Sun, User, Settings as SettingsIcon } from 'lucide-react';
import StudentView from './roles/StudentView';
import InstructorView from './roles/InstructorView';
import AdminView from './roles/AdminView';
import ContentCreatorView from './roles/ContentCreatorView';

export default function Dashboard({ 
  user, 
  onLogout, 
  assignments, 
  courses, 
  notifications,
  theme,
  onToggleTheme,
  onMarkAllRead,
  onUpdateAssignment, 
  onAssignmentSubmitted,
  onAddAssignment, 
  onAddCourse, 
  onUpdateCourseProgress 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Simulate periodic background sync for "portal" feel
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 1500);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderView = () => {
    const filteredAssignments = assignments.filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.course.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredCourses = courses.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (user.role) {
      case 'student': return <StudentView assignments={filteredAssignments} courses={filteredCourses} onUpdateAssignment={onUpdateAssignment} onAssignmentSubmitted={onAssignmentSubmitted} onUpdateCourseProgress={onUpdateCourseProgress} theme={theme} />;
      case 'instructor': return <InstructorView assignments={filteredAssignments} onUpdateAssignment={onUpdateAssignment} onAddAssignment={onAddAssignment} onAddCourse={onAddCourse} theme={theme} />;
      case 'admin': return <AdminView theme={theme} onAddCourse={onAddCourse} onAddAssignment={onAddAssignment} assignments={filteredAssignments} courses={filteredCourses} />;
      case 'content-creator': return <ContentCreatorView theme={theme} />;
      default: return <StudentView assignments={filteredAssignments} courses={filteredCourses} onUpdateAssignment={onUpdateAssignment} onUpdateCourseProgress={onUpdateCourseProgress} theme={theme} />;
    }
  };

  const getRoleBadgeColor = () => {
    switch (user.role) {
      case 'student': return 'bg-blue-100 text-blue-600';
      case 'instructor': return 'bg-purple-100 text-purple-600';
      case 'admin': return 'bg-red-100 text-red-600';
      case 'content-creator': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-[#F8F9FD] text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`border-b sticky top-0 z-50 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-100'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                  L
                </div>
                <span className={`text-xl font-black tracking-tight hidden sm:block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>LMS.</span>
              </div>
              
              <div className={`hidden md:flex items-center rounded-2xl px-4 py-2 w-80 transition-colors ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <Search size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search courses, files..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Backend Status */}
              <div className="hidden lg:flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Backend Online</span>
                </div>
                
                {isSyncing && (
                  <div className="flex items-center gap-2 text-indigo-500 animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Syncing...</span>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button 
                onClick={onToggleTheme}
                className={`p-3 rounded-2xl transition-all ${theme === 'dark' ? 'text-yellow-400 hover:bg-gray-800' : 'text-indigo-600 hover:bg-gray-50'}`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                  className={`p-3 rounded-2xl transition-all relative ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-3 right-3 w-4 h-4 bg-pink-500 text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl border overflow-hidden z-50 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                      <h4 className="font-bold">Notifications</h4>
                      <button onClick={onMarkAllRead} className="text-xs text-indigo-600 font-bold hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(n => (
                          <div key={n.id} className={`p-4 border-b last:border-0 transition-colors ${!n.read ? (theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-50') : ''} ${theme === 'dark' ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-50 hover:bg-gray-50'}`}>
                            <p className="font-bold text-sm">{n.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                            <p className="text-[10px] text-gray-400 mt-2">{n.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-400 text-sm">No notifications</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className={`h-10 w-[1px] mx-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}></div>

              <div className="relative">
                <button 
                  onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                  className="flex items-center gap-3 group"
                >
                  <div className="text-right hidden sm:block">
                    <p className={`text-sm font-black leading-none mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${getRoleBadgeColor()}`}>
                      {user.role.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showProfileMenu && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl border overflow-hidden z-50 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div className="p-2">
                      <button className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                        <User size={16} /> Profile
                      </button>
                      <button className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                        <SettingsIcon size={16} /> Settings
                      </button>
                      <div className={`my-1 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`} />
                      <button 
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-bold"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {renderView()}
        </motion.div>
      </main>
    </div>
  );
}

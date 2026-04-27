import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { api } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notifs, assigns, crs] = await Promise.all([
          api.notifications.getAll(),
          api.assignments.getAll(),
          api.courses.getAll()
        ]);
        setNotifications(notifs);
        setAssignments(assigns);
        setCourses(crs);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogin = async (userData) => {
    try {
      await api.logins.record({ email: userData.email, role: userData.role });
      setUser(userData);
    } catch (err) {
      console.error('Failed to record login:', err);
      setUser(userData); // Still login even if recording fails
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addNotification = async (notif) => {
    try {
      const newNotif = await api.notifications.add(notif);
      setNotifications(prev => [newNotif, ...prev]);
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const markAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all read:', error);
    }
  };

  const updateAssignment = async (id, updates) => {
    try {
      const updated = await api.assignments.update(id, updates);
      setAssignments(prev => prev.map(a => a.id === id ? updated : a));
      if (updates.status === 'Graded') {
        addNotification({ title: 'Grade Posted', message: `Your assignment "${updated.title}" has been graded.` });
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  const handleAssignmentSubmitted = (updated) => {
    setAssignments(prev => prev.map(a => a.id === updated.id ? updated : a));
    addNotification({ 
      title: 'Assignment Submitted', 
      message: `Successfully submitted "${updated.title}".` 
    });
  };

  const addAssignment = async (newAssignment) => {
    try {
      const created = await api.assignments.add(newAssignment);
      setAssignments(prev => [...prev, created]);
      addNotification({ title: 'New Assignment', message: `New assignment: ${created.title}` });
    } catch (error) {
      console.error('Error adding assignment:', error);
    }
  };

  const addCourse = async (newCourse) => {
    try {
      const created = await api.courses.add(newCourse);
      setCourses(prev => [...prev, created]);
      addNotification({ title: 'New Course', message: `A new course "${created.title}" is now available.` });
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const updateCourseProgress = async (id) => {
    try {
      const result = await api.courses.updateProgress(id);
      if (result.success) {
        setCourses(prev => prev.map(c => c.id === id ? { ...c, progress: result.progress, lessons: result.lessons } : c));
      }
    } catch (error) {
      console.error('Error updating course progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-gray-500 animate-pulse">Initializing LMS Backend...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`font-sans antialiased transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard 
          user={user} 
          onLogout={handleLogout} 
          assignments={assignments}
          courses={courses}
          notifications={notifications}
          theme={theme}
          onToggleTheme={toggleTheme}
          onMarkAllRead={markAllRead}
          onUpdateAssignment={updateAssignment}
          onAssignmentSubmitted={handleAssignmentSubmitted}
          onAddAssignment={addAssignment}
          onAddCourse={addCourse}
          onUpdateCourseProgress={updateCourseProgress}
        />
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Users, BookOpen, CheckCircle, Clock, BarChart3, MoreVertical, Trash2, Edit, Save, X, ChevronRight, TrendingUp, FileText, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { api } from '../../services/api';

export default function InstructorView({ assignments, onUpdateAssignment, onAddAssignment, onAddCourse, theme }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [gradingAssignment, setGradingAssignment] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gradeValue, setGradeValue] = useState('');
  
  const [newAssignment, setNewAssignment] = useState({ title: '', course: '', due: '' });
  const [newCourse, setNewCourse] = useState({ title: '', description: '', category: 'Programming' });

  const performanceData = [
    { name: 'Week 1', avg: 65, submissions: 12 },
    { name: 'Week 2', avg: 72, submissions: 15 },
    { name: 'Week 3', avg: 68, submissions: 10 },
    { name: 'Week 4', avg: 85, submissions: 22 },
    { name: 'Week 5', avg: 78, submissions: 18 },
  ];

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (newAssignment.title && newAssignment.course && newAssignment.due) {
      onAddAssignment(newAssignment);
      setNewAssignment({ title: '', course: '', due: '' });
      setShowCreateModal(false);
      setShowSuccess('Assignment created successfully!');
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };
const handleCreateCourse = async (e) => {
  e.preventDefault();

  if (!newCourse.title) return;

  try {
    const res = await fetch("http://localhost:5000/add-course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: newCourse.title,
        description: newCourse.description
      })
    });

    const data = await res.json();

    if (data.success) {
      setNewCourse({ title: '', description: '', category: 'Programming' });
      setShowCourseModal(false);
      setShowSuccess('Course saved to database ✅');
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      alert("Failed to save course");
    }

  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    if (gradingAssignment && gradeValue) {
      onUpdateAssignment(gradingAssignment.id, { status: 'Graded', grade: gradeValue });
      setGradingAssignment(null);
      setGradeValue('');
      setShowSuccess('Grade submitted successfully!');
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

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
          <h2 className="text-4xl font-black tracking-tight">Instructor Panel</h2>
          <p className="text-gray-500 mt-2">Manage your courses, assignments, and track student progress.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowCourseModal(true)}
            className={`px-6 py-3 rounded-2xl text-sm font-bold border transition-all flex items-center gap-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50 shadow-sm'}`}
          >
            <BookOpen size={18} /> New Course
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> Create Assignment
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-8 border-b dark:border-gray-800">
        {['overview', 'assignments', 'students'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold capitalize transition-all relative ${activeTab === tab ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`lg:col-span-2 p-8 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50'}`}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black">Performance Analytics</h3>
                  <p className="text-sm text-gray-500">Average class grades over time</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                  <TrendingUp size={16} /> +12% this month
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#f3f4f6'} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}
                    />
                    <Bar dataKey="avg" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-6">
              <div className={`p-6 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50'}`}>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <Users size={20} />
                </div>
                <p className="text-3xl font-black">1,240</p>
                <p className="text-sm text-gray-500 font-medium">Total Students</p>
              </div>
              <div className={`p-6 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50'}`}>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <CheckCircle size={20} />
                </div>
                <p className="text-3xl font-black">94%</p>
                <p className="text-sm text-gray-500 font-medium">Completion Rate</p>
              </div>
              <div className={`p-6 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50'}`}>
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                  <Clock size={20} />
                </div>
                <p className="text-3xl font-black">{assignments.filter(a => a.status === 'Submitted').length}</p>
                <p className="text-sm text-gray-500 font-medium">Pending Reviews</p>
              </div>
            </div>
          </div>

          <div className={`p-8 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50'}`}>
            <h3 className="text-xl font-black mb-6">Recent Submissions</h3>
            <div className="space-y-4">
              {assignments.filter(a => a.status === 'Submitted').length > 0 ? (
                assignments.filter(a => a.status === 'Submitted').map(asgn => (
                  <div key={asgn.id} className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-gray-50 border-gray-100 hover:bg-white'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                        {asgn.student.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{asgn.student}</p>
                        <p className="text-xs text-gray-500">{asgn.title} • {asgn.course}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setGradingAssignment(asgn)}
                      className="text-indigo-600 font-bold text-sm hover:underline"
                    >
                      Grade Now
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-gray-400 font-medium">
                  No pending submissions to grade.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className={`rounded-3xl border overflow-hidden transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50'}`}>
          <table className="w-full text-left">
            <thead>
              <tr className={`border-b text-xs font-black uppercase tracking-widest text-gray-400 ${theme === 'dark' ? 'bg-gray-800/50 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {assignments.map(asgn => (
                <tr key={asgn.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 font-bold">{asgn.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{asgn.course}</td>
                  <td className="px-6 py-4 text-sm">{asgn.due}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      asgn.status === 'Graded' ? 'bg-emerald-100 text-emerald-600' : 
                      asgn.status === 'Submitted' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {asgn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {asgn.status === 'Submitted' && (
                        <button 
                          onClick={() => setGradingAssignment(asgn)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                        >
                          Grade
                        </button>
                      )}
                      <button className="text-gray-400 hover:text-gray-600 transition-colors"><MoreVertical size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`w-full max-w-md rounded-3xl p-8 transition-colors ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">Create Assignment</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Assignment Title</label>
                  <input 
                    required
                    type="text" 
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-indigo-600 transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
                    placeholder="e.g. React Hooks Project"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Course</label>
                  <input 
                    required
                    type="text" 
                    value={newAssignment.course}
                    onChange={(e) => setNewAssignment({...newAssignment, course: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-indigo-600 transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
                    placeholder="e.g. Advanced React"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Due Date</label>
                  <input 
                    required
                    type="text" 
                    value={newAssignment.due}
                    onChange={(e) => setNewAssignment({...newAssignment, due: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-indigo-600 transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
                    placeholder="e.g. Next Friday"
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all mt-4">
                  Publish Assignment
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

        {gradingAssignment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`w-full max-w-md rounded-3xl p-8 transition-colors ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">Grade Submission</h3>
                <button onClick={() => setGradingAssignment(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <div className="mb-6 space-y-2">
                <p className="text-sm text-gray-500">Student: <span className="font-bold text-gray-900 dark:text-white">{gradingAssignment.student}</span></p>
                <p className="text-sm text-gray-500">Assignment: <span className="font-bold text-gray-900 dark:text-white">{gradingAssignment.title}</span></p>
                {gradingAssignment.submitted_file && (
                  <div className="mt-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="text-indigo-600" size={20} />
                      <div>
                        <p className="text-xs font-bold text-indigo-900 dark:text-indigo-300">Submitted File</p>
                        <p className="text-[10px] text-indigo-600/70 truncate max-w-[150px]">{gradingAssignment.submitted_file}</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => api.assignments.downloadSubmittedFile(gradingAssignment.id)}
                      className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm hover:shadow-md transition-all text-indigo-600"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                )}
              </div>
              <form onSubmit={handleGradeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Grade (e.g. A+, 95%)</label>
                  <input 
                    required
                    type="text" 
                    value={gradeValue}
                    onChange={(e) => setGradeValue(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-indigo-600 transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
                    placeholder="Enter grade..."
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all mt-4"
                >
                  Submit Grade
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

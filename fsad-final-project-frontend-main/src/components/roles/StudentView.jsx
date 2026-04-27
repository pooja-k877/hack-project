import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Clock, CheckCircle, Award, ChevronRight, Play, FileText, Download, Star, Send, X } from 'lucide-react';
import { api } from '../../services/api';

export default function StudentView({ assignments, courses, onUpdateAssignment, onUpdateCourseProgress, theme, onAssignmentSubmitted }) {
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [submittingAssignment, setSubmittingAssignment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showBadges, setShowBadges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const stats = [
    { label: 'Courses in Progress', value: courses.filter(c => c.progress < 100).length, icon: BookOpen, color: 'text-blue-600' },
    { label: 'Completed Courses', value: courses.filter(c => c.progress === 100).length, icon: CheckCircle, color: 'text-emerald-600' },
    { label: 'Pending Assignments', value: assignments.filter(a => a.status === 'Pending').length, icon: Clock, color: 'text-orange-600' },
    { label: 'Badges Earned', value: 4, icon: Award, color: 'text-purple-600' },
  ];

  const handleContinueLearning = (courseId) => {
    onUpdateCourseProgress(courseId);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmitConfirm = async () => {
    if (submittingAssignment && selectedFile) {
      setIsUploading(true);
      try {
        const updated = await api.assignments.submit(submittingAssignment.id, selectedFile);
        if (onAssignmentSubmitted) {
          onAssignmentSubmitted(updated);
        }
        setSubmittingAssignment(null);
        setSelectedFile(null);
        setShowSuccess('Assignment submitted successfully!');
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error('Submission failed:', error);
        alert('Failed to submit assignment. Please try again.');
      } finally {
        setIsUploading(false);
      }
    } else {
      alert('Please select a file to submit.');
    }
  };

  if (selectedCourse) {
    return (
      <div className="space-y-8">
        <button 
          onClick={() => setSelectedCourse(null)}
          className="flex items-center gap-2 text-indigo-600 font-bold hover:underline"
        >
          <ChevronRight className="rotate-180" size={20} /> Back to Dashboard
        </button>

        <div className={`p-8 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50'}`}>
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedCourse.color} text-white`}>
                Course Module
              </span>
              <h2 className="text-3xl font-black mt-4">{selectedCourse.title}</h2>
              <p className="text-gray-500 mt-2">Instructor: {selectedCourse.instructor}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Overall Progress</p>
              <p className="text-4xl font-black text-indigo-600 mt-1">{selectedCourse.progress}%</p>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <h3 className="text-xl font-black">Course Content</h3>
            <div className="grid gap-4">
              {selectedCourse.lessons?.map((lesson, idx) => (
                <div 
                  key={lesson.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${lesson.completed ? (theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-100') : (theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100')}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${lesson.completed ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700'}`}>
                      {lesson.completed ? <CheckCircle size={20} /> : idx + 1}
                    </div>
                    <div>
                      <p className={`font-bold ${lesson.completed ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>{lesson.title}</p>
                      <p className="text-xs text-gray-500">Video Lesson • 15 mins</p>
                    </div>
                  </div>
                  {!lesson.completed ? (
                    <button 
                      onClick={() => handleContinueLearning(selectedCourse.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
                    >
                      <Play size={16} fill="currentColor" /> Start Lesson
                    </button>
                  ) : (
                    <button className="text-emerald-600 font-bold text-sm flex items-center gap-1">
                      <Star size={16} fill="currentColor" /> Review
                    </button>
                  )}
                </div>
              ))}
            </div>
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
          <h2 className="text-4xl font-black tracking-tight">Student Dashboard</h2>
          <p className="text-gray-500 mt-2">Welcome back! You have {assignments.filter(a => a.status === 'Pending').length} pending assignments.</p>
        </div>
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
          <button 
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            My Courses
          </button>
          <button 
            onClick={() => setActiveTab('assignments')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'assignments' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Assignments
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-6 rounded-3xl border transition-all hover:scale-[1.02] ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50/50'}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${stat.color.replace('text', 'bg')}/10 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <p className="text-3xl font-black">{stat.value}</p>
            <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {activeTab === 'courses' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`group rounded-3xl border overflow-hidden transition-all hover:shadow-2xl ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50/30'}`}
            >
              <div className={`h-32 ${course.color} relative p-6 flex flex-col justify-end`}>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-xl text-white">
                  <BookOpen size={20} />
                </div>
                <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Course</p>
                <h3 className="text-white text-xl font-black leading-tight mt-1">{course.title}</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500 font-medium">Instructor: {course.instructor}</p>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      className={`h-full ${course.color}`}
                    />
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCourse(course)}
                  className="w-full mt-6 bg-gray-900 dark:bg-indigo-600 text-white py-3 rounded-2xl font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 group"
                >
                  Continue Learning <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className={`rounded-3xl border overflow-hidden ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50'}`}>
          <table className="w-full text-left">
            <thead>
              <tr className={`border-b text-xs font-black uppercase tracking-widest text-gray-400 ${theme === 'dark' ? 'bg-gray-800/50 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
                <th className="px-6 py-4">Assignment</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {assignments.map(assignment => (
                <tr key={assignment.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <span className="font-bold">{assignment.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{assignment.course}</td>
                  <td className="px-6 py-4 text-sm font-medium">{assignment.due}</td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      assignment.status === 'Submitted' ? 'bg-emerald-100 text-emerald-600' : 
                      assignment.status === 'Graded' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {assignment.status === 'Pending' ? (
                      <button 
                        onClick={() => setSubmittingAssignment(assignment)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-200 transition-all"
                      >
                        Submit Now
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => api.assignments.downloadSubmittedFile(assignment.id)}
                          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold text-xs transition-colors"
                          title="Download your submission"
                        >
                          <Download size={16} />
                          <span>My Submission</span>
                        </button>
                        {assignment.status === 'Graded' && (
                          <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                            <Star size={14} fill="currentColor" />
                            <span>Grade: {assignment.grade}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Submission Confirmation Modal */}
      <AnimatePresence>
        {submittingAssignment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`rounded-3xl p-8 w-full max-w-md shadow-2xl border transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-white/20'}`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">Submit Assignment</h3>
                <button onClick={() => setSubmittingAssignment(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <div className="mb-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Upload your work for:</p>
                <p className="font-black text-xl text-indigo-600">{submittingAssignment.title}</p>
                <p className="text-sm text-gray-500 mt-1 mb-6">{submittingAssignment.course}</p>
                
                <div className={`p-6 rounded-2xl border-2 border-dashed transition-colors ${selectedFile ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-gray-200 dark:border-gray-700'}`}>
                  <input 
                    type="file" 
                    id="assignment-file"
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  <label htmlFor="assignment-file" className="flex flex-col items-center cursor-pointer">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${selectedFile ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                      {selectedFile ? <CheckCircle size={24} /> : <FileText size={24} />}
                    </div>
                    <p className="text-sm font-bold">{selectedFile ? selectedFile.name : 'Click to select file'}</p>
                    <p className="text-xs text-gray-400 mt-1">{selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'PDF, DOCX, ZIP up to 10MB'}</p>
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setSubmittingAssignment(null); setSelectedFile(null); }}
                  disabled={isUploading}
                  className="flex-1 px-6 py-4 rounded-xl font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitConfirm}
                  disabled={!selectedFile || isUploading}
                  className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:bg-gray-400"
                >
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                  {isUploading ? 'Uploading...' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Badges Modal */}
      <AnimatePresence>
        {showBadges && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`w-full max-w-lg rounded-3xl p-8 transition-colors ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">My Badges</h3>
                <button onClick={() => setShowBadges(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { name: 'Fast Learner', icon: '⚡', color: 'bg-yellow-100' },
                  { name: 'Quiz Master', icon: '🏆', color: 'bg-blue-100' },
                  { name: 'Top Scorer', icon: '🌟', color: 'bg-purple-100' },
                  { name: 'Problem Solver', icon: '🧩', color: 'bg-emerald-100' },
                  { name: 'Creative Mind', icon: '🎨', color: 'bg-pink-100' },
                  { name: 'Code Ninja', icon: '🥷', color: 'bg-gray-100' },
                ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-2">
                    <div className={`w-20 h-20 rounded-full ${badge.color} flex items-center justify-center text-4xl shadow-inner`}>
                      {badge.icon}
                    </div>
                    <p className="text-xs font-bold">{badge.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Badges Button */}
      <button 
        onClick={() => setShowBadges(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-40 group"
      >
        <Award size={24} />
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          View My Badges
        </span>
      </button>
    </div>
  );
}

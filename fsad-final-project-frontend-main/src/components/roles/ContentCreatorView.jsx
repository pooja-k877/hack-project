import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layout, Video, FileText, Image as ImageIcon, Upload, CheckCircle2, ArrowLeft, Play, Scissors, Save, Plus, Trash2, X, Film, Music, Type, Layers, Settings, Download, Share2, MoreVertical } from 'lucide-react';

export default function ContentCreatorView({ theme }) {
  const [activeTool, setActiveTool] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([
    { id: 1, question: 'What is React?', options: ['Library', 'Framework', 'Language'], correct: 0 },
  ]);

  const handleAction = (tool) => {
    if (tool === 'Upload Asset') {
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setShowSuccess('Asset uploaded successfully!');
        setTimeout(() => setShowSuccess(false), 3000);
      }, 2000);
      return;
    }
    setActiveTool(tool);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowSuccess('Video exported successfully!');
      setTimeout(() => setShowSuccess(false), 3000);
    }, 3000);
  };

  const addQuestion = () => {
    setQuizQuestions([...quizQuestions, { id: Date.now(), question: '', options: ['', '', ''], correct: 0 }]);
  };

  const saveQuiz = () => {
    setShowSuccess('Quiz saved successfully!');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (activeTool === 'Video Editor') {
    return (
      <div className="space-y-8">
        <button 
          onClick={() => setActiveTool(null)}
          className="flex items-center gap-2 text-emerald-600 font-bold hover:underline mb-4"
        >
          <ArrowLeft size={20} /> Back to Studio
        </button>
        <div className={`rounded-3xl border overflow-hidden transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-emerald-50'}`}>
          <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Video size={20} />
              </div>
              <h3 className="text-xl font-black">Pro Video Editor</h3>
            </div>
            <div className="flex gap-2">
              <button className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}><Settings size={20} /></button>
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className={`${isExporting ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'} text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-200`}
              >
                <Save size={18} /> {isExporting ? 'Exporting...' : 'Export Video'}
              </button>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <div className="aspect-video bg-black rounded-3xl flex items-center justify-center relative group overflow-hidden shadow-2xl">
                  {isExporting && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
                      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 3 }}
                          className="h-full bg-emerald-500" 
                        />
                      </div>
                      <p className="text-white font-black text-sm tracking-widest uppercase">Rendering 4K Output...</p>
                    </div>
                  )}
                  <Play size={80} className="text-white opacity-40 group-hover:opacity-100 transition-all cursor-pointer hover:scale-110" />
                  <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 bg-black/40 backdrop-blur-md p-3 rounded-2xl">
                    <span className="text-white text-xs font-bold">02:45 / 12:30</span>
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-1/4"></div>
                    </div>
                  </div>
                </div>
                
                {/* Timeline */}
                <div className={`p-6 rounded-3xl border transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-4">
                      <button className="text-xs font-black uppercase tracking-widest text-emerald-600">Video</button>
                      <button className="text-xs font-black uppercase tracking-widest text-gray-400">Audio</button>
                      <button className="text-xs font-black uppercase tracking-widest text-gray-400">Text</button>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><Scissors size={16} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><Plus size={16} /></button>
                    </div>
                  </div>
                  <div className="h-24 bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 relative overflow-hidden">
                    <div className="absolute inset-y-0 left-1/4 w-0.5 bg-emerald-500 z-10">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full -ml-1.25 -mt-1.5" />
                    </div>
                    <div className="flex h-full items-center px-4 gap-1">
                      {[...Array(20)].map((_, i) => (
                        <div key={i} className={`h-8 w-12 rounded-md ${i < 8 ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-gray-100 dark:bg-gray-800'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Tools</h4>
                {[
                  { icon: Film, label: 'Media Assets', count: '12' },
                  { icon: Music, label: 'Audio Tracks', count: '3' },
                  { icon: Type, label: 'Text Overlays', count: '5' },
                  { icon: Layers, label: 'Transitions', count: '8' },
                ].map(tool => (
                  <button key={tool.label} className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all hover:scale-[1.02] ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-emerald-500/50' : 'bg-white border-gray-100 hover:border-emerald-200 shadow-sm'}`}>
                    <div className="flex items-center gap-3">
                      <tool.icon size={18} className="text-emerald-500" />
                      <span className="text-sm font-bold">{tool.label}</span>
                    </div>
                    <span className="text-xs font-black text-gray-400">{tool.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTool === 'Quiz Builder') {
    return (
      <div className="space-y-8">
        <button 
          onClick={() => setActiveTool(null)}
          className="flex items-center gap-2 text-emerald-600 font-bold hover:underline mb-4"
        >
          <ArrowLeft size={20} /> Back to Studio
        </button>
        <div className={`rounded-3xl border overflow-hidden transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-emerald-50'}`}>
          <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <h3 className="text-xl font-black">Interactive Quiz Builder</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={addQuestion}
                className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
              >
                <Plus size={18} /> Add Question
              </button>
              <button 
                onClick={saveQuiz}
                className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-200"
              >
                <CheckCircle2 size={18} /> Save Quiz
              </button>
            </div>
          </div>
          <div className="p-8 max-w-4xl mx-auto space-y-8">
            {quizQuestions.map((q, idx) => (
              <motion.div 
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-8 rounded-3xl border relative group transition-colors ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
              >
                <button 
                  onClick={() => setQuizQuestions(quizQuestions.filter(item => item.id !== q.id))}
                  className="absolute top-6 right-6 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={20} />
                </button>
                <div className="mb-6">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Question {idx + 1}</label>
                  <input 
                    type="text" 
                    className={`w-full rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-lg ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
                    placeholder="What is the main purpose of React?"
                    defaultValue={q.question}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="relative">
                      <input 
                        type="text" 
                        className={`w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm pr-10 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
                        placeholder={`Option ${oIdx + 1}`}
                        defaultValue={opt}
                      />
                      <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 cursor-pointer ${oIdx === q.correct ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`} />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
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
            <CheckCircle2 size={20} /> {showSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight">Content Studio</h2>
          <p className="text-gray-500 mt-2">Design, edit, and publish high-quality educational materials.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleAction('Upload Asset')}
            disabled={isUploading}
            className={`${isUploading ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'} text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-emerald-100`}
          >
            <Upload size={20} /> {isUploading ? 'Uploading...' : 'Upload New Asset'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { id: 'Video Editor', icon: Video, color: 'bg-blue-500', label: 'Video Editor', desc: 'Professional grade video editing suite.' },
          { id: 'Quiz Builder', icon: FileText, color: 'bg-orange-500', label: 'Quiz Builder', desc: 'Create interactive assessments.' },
          { id: 'Asset Library', icon: ImageIcon, color: 'bg-pink-500', label: 'Asset Library', desc: 'Manage your media resources.' },
        ].map(tool => (
          <motion.div 
            key={tool.id}
            whileHover={{ y: -5 }}
            onClick={() => handleAction(tool.id)}
            className={`p-8 rounded-3xl border cursor-pointer transition-all ${theme === 'dark' ? 'bg-gray-900 border-gray-800 hover:border-emerald-500/50' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50/30 hover:border-emerald-200'}`}
          >
            <div className={`w-14 h-14 rounded-2xl ${tool.color} text-white flex items-center justify-center mb-6 shadow-lg`}>
              <tool.icon size={28} />
            </div>
            <h3 className="text-xl font-black mb-2">{tool.label}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{tool.desc}</p>
          </motion.div>
        ))}
      </div>

      <section className={`rounded-3xl border overflow-hidden transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl shadow-indigo-50'}`}>
        <div className="p-6 border-b dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
          <h3 className="font-black text-xl">Recent Assets</h3>
          <div className="flex gap-2">
            <button className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}><Share2 size={18} /></button>
            <button className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}><Download size={18} /></button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className={`text-xs font-black text-gray-400 uppercase tracking-widest border-b dark:border-gray-800 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50/30'}`}>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Size</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-800">
            {[
              { name: 'Introduction to React.mp4', type: 'Video', size: '1.2 GB' },
              { name: 'Course Syllabus.pdf', type: 'Document', size: '450 KB' },
              { name: 'Hero Banner.png', type: 'Image', size: '2.4 MB' },
            ].map((asset, i) => (
              <tr key={i} className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
                <td className="px-6 py-4 font-bold">{asset.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{asset.type}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{asset.size}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-indigo-600 transition-colors"><MoreVertical size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

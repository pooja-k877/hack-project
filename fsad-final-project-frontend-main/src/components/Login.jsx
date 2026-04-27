import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, GraduationCap, ShieldCheck, PenTool, UserCircle, Loader2 } from 'lucide-react';

const roles = [
  { id: 'student', label: 'Student', icon: GraduationCap, color: 'bg-blue-500' },
  { id: 'instructor', label: 'Instructor', icon: UserCircle, color: 'bg-purple-500' },
  { id: 'admin', label: 'Admin', icon: ShieldCheck, color: 'bg-red-500' },
  { id: 'content-creator', label: 'Content Creator', icon: PenTool, color: 'bg-emerald-500' },
];

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [loading, setLoading] = useState(false);

  // ✅ FIXED HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: email.split("@")[0],
          email
        })
      });

      // check server response
      if (!res.ok) {
        throw new Error("Server not responding");
      }

      const data = await res.json();
      console.log("Backend response:", data);

      if (data.success) {
        // login after storing
        onLogin({
          email,
          role: selectedRole,
          name: email.split("@")[0]
        });
      } else {
        alert("Backend error: " + (data.error || "Failed to save user"));
      }

    } catch (err) {
      console.error("Error:", err);
      alert("Cannot connect to backend ❌");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-pink-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4 shadow-lg">
            L
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 mb-2 leading-tight">
            LMS Portal
          </h1>
          <p className="text-gray-500 font-medium italic text-sm">
            Empowering your educational journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ROLE SELECTION */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Select Your Role
            </label>

            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    selectedRole === role.id
                      ? `${role.color.replace('bg-', 'border-')} ${role.color.replace('bg-', 'bg-')}/10`
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <role.icon
                    size={18}
                    className={
                      selectedRole === role.id
                        ? role.color.replace('bg-', 'text-')
                        : 'text-gray-400'
                    }
                  />
                  <span
                    className={`text-xs font-bold ${
                      selectedRole === role.id
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }`}
                  >
                    {role.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 outline-none text-sm"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 outline-none text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>

        </form>
      </motion.div>
    </div>
  );
}
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconShield, IconUser, IconUsers, IconZap, IconCheck, IconArrowRight } from '../components/icons'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('Demo@1234')
    setLoading(true)
    setError('')
    try {
      const res = await login(demoEmail, 'Demo@1234')
      if (res.success) {
        if (res.user.role === 'student') navigate('/student')
        else if (res.user.role === 'dept_admin') navigate('/admin')
        else if (res.user.role === 'super_admin') navigate('/super-admin')
      } else {
        setError(res.message || 'Login failed')
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Login failed. Ensure backend server is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login(email, password)
      if (res.success) {
        if (res.user.role === 'student') navigate('/student')
        else if (res.user.role === 'dept_admin') navigate('/admin')
        else if (res.user.role === 'super_admin') navigate('/super-admin')
      } else {
        setError(res.message || 'Login failed')
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col justify-between p-4 sm:p-6 text-slate-100">
      {/* Top Brand Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <img src="/dsvv.webp" alt="DSVV Logo" className="w-12 h-12 object-contain drop-shadow-md mr-3" />
          <div>
            <h1 className="font-extrabold text-white text-lg leading-none">DSVV Updates</h1>
            <p className="text-blue-300 text-xs mt-0.5 font-medium">Unified Notice & Circular Aggregator</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-900/60 border border-blue-700/50 rounded-full text-xs font-semibold text-blue-200">
            <IconZap size={13} className="text-amber-400" />
            AI Innovation with Purpose
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto w-full py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Info Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-500/30 rounded-full px-4 py-1.5 text-xs font-bold text-blue-300">
            <IconZap size={14} className="text-amber-400" />
            Detect • Understand • Verify • Deliver
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Dev Sanskriti Vishwavidyalaya <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Intelligent Notice Portal
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            "The right information reaches the right student, in a form they can understand, at the right time."
            Solving information overload with AI classification, targeted distribution, and human verification.
          </p>

          {/* Role Cards Quick Trigger */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Role for Demo Login:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('student.bca@dsvv.demo')}
                className="p-3.5 bg-slate-800/80 hover:bg-blue-900/50 border border-slate-700 hover:border-blue-500/60 rounded-2xl text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <IconUser size={18} />
                  </div>
                  <span className="text-[10px] font-extrabold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                    Student
                  </span>
                </div>
                <div className="font-bold text-white text-xs">Rahul Sharma</div>
                <div className="text-[11px] text-slate-400 mt-0.5">BCA 2nd Year</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('cs.admin@dsvv.demo')}
                className="p-3.5 bg-slate-800/80 hover:bg-purple-900/50 border border-slate-700 hover:border-purple-500/60 rounded-2xl text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <IconUsers size={18} />
                  </div>
                  <span className="text-[10px] font-extrabold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                    Dept Admin
                  </span>
                </div>
                <div className="font-bold text-white text-xs">Prof. Anil Verma</div>
                <div className="text-[11px] text-slate-400 mt-0.5">CS Department</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin@dsvv.demo')}
                className="p-3.5 bg-slate-800/80 hover:bg-amber-900/50 border border-slate-700 hover:border-amber-500/60 rounded-2xl text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <IconShield size={18} />
                  </div>
                  <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                    Super Admin
                  </span>
                </div>
                <div className="font-bold text-white text-xs">Super Admin</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Full System Access</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-5">
          <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl">
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Sign In to DSVV Portal</h3>
            <p className="text-xs text-slate-500 mb-6">Enter your academic credentials or use demo buttons</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3.5 rounded-xl mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student.bca@dsvv.demo"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 mt-2"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
                <IconArrowRight size={16} />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-500">
                Demo Password for all roles: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-slate-700">Demo@1234</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Architecture Line */}
      <footer className="max-w-6xl mx-auto w-full py-4 text-center border-t border-slate-800/80">
        <p className="text-xs text-slate-400 font-medium">
          DSVV Notice & Circular Aggregator • Built for Dev Sanskriti Vishwavidyalaya
        </p>
      </footer>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconShield, IconUser, IconUsers, IconZap, IconArrowRight, IconCheck } from '../components/icons'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const handleDemoLogin = async (demoEmail: string) => {
    setActiveDemo(demoEmail)
    setEmail(demoEmail)
    setPassword('Demo@1234')
    setLoading(true)
    setError('')
    try {
      const res = await login(demoEmail, 'Demo@1234')
      if (res.success) {
        if (res.user.role === 'student') navigate('/student/dashboard')
        else if (res.user.role === 'dept_admin') navigate('/admin/dashboard')
        else if (res.user.role === 'super_admin') navigate('/superadmin/dashboard')
      } else {
        setError(res.message || 'Login failed')
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Login failed. Ensure backend server is running.')
    } finally {
      setLoading(false)
      setActiveDemo(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login(email, password)
      if (res.success) {
        if (res.user.role === 'student') navigate('/student/dashboard')
        else if (res.user.role === 'dept_admin') navigate('/admin/dashboard')
        else if (res.user.role === 'super_admin') navigate('/superadmin/dashboard')
      } else {
        setError(res.message || 'Login failed')
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const demoRoles = [
    {
      email: 'student.bca@dsvv.demo',
      name: 'Rahul Sharma',
      sub: 'BCA 2nd Year · Student',
      role: 'Student',
      icon: <IconUser size={20} />,
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 hover:border-blue-400/60',
      badge: 'bg-blue-500/20 text-blue-300',
      ring: 'ring-blue-500/40',
    },
    {
      email: 'cs.admin@dsvv.demo',
      name: 'Prof. Anil Verma',
      sub: 'CS Department Head',
      role: 'Dept Admin',
      icon: <IconUsers size={20} />,
      gradient: 'from-violet-500 to-purple-500',
      bg: 'bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30 hover:border-violet-400/60',
      badge: 'bg-violet-500/20 text-violet-300',
      ring: 'ring-violet-500/40',
    },
    {
      email: 'admin@dsvv.demo',
      name: 'Super Admin',
      sub: 'Full System Access',
      role: 'Super Admin',
      icon: <IconShield size={20} />,
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 hover:border-amber-400/60',
      badge: 'bg-amber-500/20 text-amber-300',
      ring: 'ring-amber-500/40',
    },
  ]

  return (
    <div className="min-h-screen bg-[#050b18] flex flex-col relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[90px] animate-pulse" style={{ animationDelay: '2s' }} />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(99,179,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Top Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-4">
          {/* Circular Logo */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 blur-md opacity-60 scale-110" />
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-400/60 shadow-lg shadow-blue-500/30 ring-2 ring-blue-500/20">
              <img src="/dsvv.webp" alt="DSVV Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <h1 className="font-black text-white text-lg leading-none tracking-tight">DSVV Updates</h1>
            <p className="text-blue-400 text-[11px] mt-0.5 font-medium">Unified Notice & Circular Aggregator</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-bold text-blue-300">
          <IconZap size={12} className="text-amber-400" />
          AI-Powered · 2026
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center">
        <div className="max-w-6xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 rounded-full px-4 py-1.5 text-xs font-bold text-blue-300">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live · Dev Sanskriti Vishwavidyalaya
            </div>

            {/* Hero Text */}
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
                One Portal.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
                  All Notices.
                </span>
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg">
                AI-powered notice aggregation for DSVV. Right information reaches the right student — classified, summarized, and verified.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {['AI Summarization', 'Role-Based Access', 'Targeted Delivery', 'Audit Trail', 'PDF Parsing'].map(f => (
                <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 font-medium">
                  <IconCheck size={11} className="text-green-400" />
                  {f}
                </span>
              ))}
            </div>

            {/* Demo Role Cards */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Quick Demo Login</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {demoRoles.map((role) => (
                  <button
                    key={role.email}
                    type="button"
                    onClick={() => handleDemoLogin(role.email)}
                    disabled={loading}
                    className={`relative p-4 border rounded-2xl text-left transition-all duration-200 group disabled:opacity-60 ${role.bg} ${activeDemo === role.email ? `ring-2 ${role.ring}` : ''}`}
                  >
                    {/* gradient top bar */}
                    <div className={`absolute top-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r ${role.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />

                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center text-white shadow-lg`}>
                        {activeDemo === role.email ? (
                          <div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                        ) : role.icon}
                      </div>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${role.badge}`}>
                        {role.role}
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm leading-tight">{role.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{role.sub}</div>
                    <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-white transition-colors">
                      Click to login <IconArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Login Card */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Card glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-purple-500/20 blur-xl" />

              <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-7 shadow-2xl">
                {/* Logo in form */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 blur-lg opacity-50 scale-125" />
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400/50 ring-4 ring-blue-500/15 shadow-xl shadow-blue-500/20">
                      <img src="/dsvv.webp" alt="DSVV Logo" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-black text-white text-center mb-1">Sign In to Portal</h3>
                <p className="text-xs text-slate-400 text-center mb-6">Use your credentials or demo buttons above</p>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold p-3.5 rounded-xl mb-5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student.bca@dsvv.demo"
                      className="w-full bg-slate-800/80 border border-slate-600/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-800/80 border border-slate-600/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-60 mt-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>Sign In <IconArrowRight size={16} /></>
                    )}
                  </button>
                </form>

                <div className="mt-5 pt-5 border-t border-slate-700/60 text-center">
                  <p className="text-[11px] text-slate-500">
                    Demo password for all roles:{' '}
                    <code className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-lg font-mono font-bold text-slate-300 text-xs">Demo@1234</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-5 border-t border-slate-800/60">
        <p className="text-xs text-slate-600 font-medium">
          DSVV Notice & Circular Aggregator · Dev Sanskriti Vishwavidyalaya · Haridwar
        </p>
      </footer>
    </div>
  )
}

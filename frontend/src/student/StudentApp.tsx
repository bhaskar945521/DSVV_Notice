import { useState } from 'react'
import {
  IconDashboard,
  IconNotice,
  IconCircular,
  IconTimetable,
  IconExam,
  IconAcademic,
  IconBell,
  IconSearch,
  IconUser,
  IconPDF,
  IconDownload,
  IconShare,
  IconBookmark,
  IconFilter,
  IconCheck,
  IconX,
  IconChevronRight,
  IconLogOut,
  IconEye,
} from '../components/icons'
import { notices, notifications, type Notice, departments } from '../data'

type Screen =
  | 'dashboard'
  | 'search'
  | 'detail'
  | 'notifications'
  | 'profile'

function Badge({
  label,
  variant,
}: {
  label: string
  variant: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'gray' | 'blue'
}) {
  const styles = {
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    gray: 'bg-slate-50 text-slate-600 border-slate-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}`}
    >
      {label}
    </span>
  )
}

function categoryVariant(cat: string): 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'gray' | 'blue' {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'gray' | 'blue'> = {
    Examination: 'danger',
    Timetable: 'purple',
    Circular: 'info',
    Academic: 'blue',
    Admission: 'success',
    Holiday: 'warning',
    Event: 'purple',
    Notice: 'gray',
  }
  return map[cat] ?? 'gray'
}

function priorityVariant(p: string): 'danger' | 'warning' | 'gray' {
  if (p === 'High') return 'danger'
  if (p === 'Medium') return 'warning'
  return 'gray'
}

function NoticeCard({ notice, onClick }: { notice: Notice; onClick: () => void }) {
  return (
    <div
      className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge label={notice.category} variant={categoryVariant(notice.category)} />
          {notice.priority === 'High' && <Badge label="High Priority" variant="danger" />}
          {notice.source === 'Automatic' && <Badge label="Auto-detected" variant="blue" />}
        </div>
        <div className="flex items-center gap-1 text-slate-400 shrink-0">
          <IconPDF size={15} />
          <span className="text-xs">PDF</span>
        </div>
      </div>
      <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-2 group-hover:text-blue-700 transition-colors">
        {notice.title}
      </h3>
      <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-2">{notice.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="font-medium text-slate-600">{notice.department}</span>
          <span>•</span>
          <span>{notice.date}</span>
        </div>
        <button className="text-blue-600 text-xs font-medium flex items-center gap-1 hover:text-blue-800 transition-colors">
          View Details <IconChevronRight size={12} />
        </button>
      </div>
    </div>
  )
}

function TopNav({
  screen,
  setScreen,
  unreadCount,
  onBack,
}: {
  screen: Screen
  setScreen: (s: Screen) => void
  unreadCount: number
  onBack?: () => void
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard size={16} /> },
    { id: 'search', label: 'Notices', icon: <IconNotice size={16} /> },
    { id: 'search', label: 'Timetable', icon: <IconTimetable size={16} /> },
    { id: 'search', label: 'Examinations', icon: <IconExam size={16} /> },
  ]

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">D</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-sm leading-none">DSVV Updates</div>
                <div className="text-slate-400 text-[10px] leading-none mt-0.5">Unified Notice Aggregator</div>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-0.5">
              {navItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setScreen(item.id as Screen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    screen === item.id && i === 0
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScreen('search')}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <IconSearch size={18} />
            </button>
            <button
              onClick={() => setScreen('notifications')}
              className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <IconBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setScreen('profile')}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 text-xs font-semibold">RS</span>
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-medium text-slate-700 leading-none">Rahul Sharma</div>
                <div className="text-[10px] text-slate-400 leading-none mt-0.5">BCA 2nd Year</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
        active
          ? 'bg-blue-700 text-white shadow-sm'
          : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-700'
      }`}
    >
      {label}
    </button>
  )
}

function DashboardScreen({ setScreen, setSelectedNotice }: { setScreen: (s: Screen) => void; setSelectedNotice: (n: Notice) => void }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = ['All', 'Notices', 'Circulars', 'Examination', 'Timetable', 'Academic', 'Admission', 'Events', 'Holiday']

  const publishedNotices = notices.filter((n) => n.status === 'Published')
  const filtered =
    activeCategory === 'All'
      ? publishedNotices
      : publishedNotices.filter(
          (n) => n.category.toLowerCase() === activeCategory.toLowerCase().replace('s', '')
          || n.category === activeCategory
          || (activeCategory === 'Notices' && n.category === 'Notice')
          || (activeCategory === 'Circulars' && n.category === 'Circular')
          || (activeCategory === 'Events' && n.category === 'Event')
          || (activeCategory === 'Examination' && n.category === 'Examination')
        )

  const highPriority = publishedNotices.filter((n) => n.priority === 'High')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div
          className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
          onClick={() => setScreen('search')}
        >
          <IconSearch size={18} className="text-slate-400" />
          <span className="text-slate-400 text-sm">Search notices, circulars, timetable…</span>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {categories.map((cat) => (
          <CategoryPill
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Latest Updates</h2>
            <span className="text-xs text-slate-400">{filtered.length} notices</span>
          </div>
          {filtered.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-400">
              No notices found for this category.
            </div>
          ) : (
            filtered.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onClick={() => {
                  setSelectedNotice(notice)
                  setScreen('detail')
                }}
              />
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Important Updates */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <h3 className="font-semibold text-slate-900 text-sm">Important Updates</h3>
            </div>
            <div className="space-y-3">
              {highPriority.map((n) => (
                <div
                  key={n.id}
                  className="flex gap-3 cursor-pointer group"
                  onClick={() => {
                    setSelectedNotice(n)
                    setScreen('detail')
                  }}
                >
                  <div className="w-1.5 rounded-full bg-red-400 shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-medium text-slate-800 group-hover:text-blue-700 transition-colors leading-snug">
                      {n.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {n.department} · {n.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-blue-700 rounded-xl p-5 text-white">
            <h3 className="font-semibold text-sm mb-3 text-blue-100">Today's Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-200 text-xs">New Notices</span>
                <span className="font-bold text-lg">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200 text-xs">Unread</span>
                <span className="font-bold text-lg">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200 text-xs">High Priority</span>
                <span className="font-bold text-lg text-red-300">{highPriority.length}</span>
              </div>
            </div>
          </div>

          {/* Source Info */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-3">Data Sources</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-slate-600">DSVV Official Website</span>
                </div>
                <Badge label="Connected" variant="success" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-slate-600">Department Portals</span>
                </div>
                <Badge label="Active" variant="success" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchScreen({ setScreen, setSelectedNotice }: { setScreen: (s: Screen) => void; setSelectedNotice: (n: Notice) => void }) {
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('')
  const [category, setCategory] = useState('')
  const [year, setYear] = useState('')
  const [priority, setPriority] = useState('')
  const [showFilters, setShowFilters] = useState(true)

  const filtered = notices.filter((n) => {
    const matchQ = !query || n.title.toLowerCase().includes(query.toLowerCase()) || n.description.toLowerCase().includes(query.toLowerCase())
    const matchD = !department || n.department === department
    const matchC = !category || n.category === category
    const matchP = !priority || n.priority === priority
    const matchY = !year || n.targetYear?.includes(year)
    return matchQ && matchD && matchC && matchP && matchY
  })

  const clearFilters = () => {
    setDepartment('')
    setCategory('')
    setYear('')
    setPriority('')
    setQuery('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 mb-1">Search Notices</h1>
        <p className="text-sm text-slate-500">Find notices, circulars, timetables, and more</p>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-3 bg-white border-2 border-blue-200 focus-within:border-blue-500 rounded-xl px-4 py-3 mb-5 transition-colors shadow-sm">
        <IconSearch size={20} className="text-blue-400 shrink-0" />
        <input
          className="flex-1 text-sm text-slate-900 placeholder-slate-400 outline-none bg-transparent"
          placeholder="Search notices, circulars, timetable…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
            <IconX size={16} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <IconFilter size={15} />
                Advanced Filters
              </h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {showFilters ? 'Hide' : 'Show'}
              </button>
            </div>
            {showFilters && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Department</label>
                  <select
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 bg-white"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="">All Departments</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Category</label>
                  <select
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 bg-white"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option>Examination</option>
                    <option>Timetable</option>
                    <option>Circular</option>
                    <option>Academic</option>
                    <option>Admission</option>
                    <option>Holiday</option>
                    <option>Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Year</label>
                  <select
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 bg-white"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    <option value="">All Years</option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Priority</label>
                  <select
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 bg-white"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="">All Priorities</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-3 py-2 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                  <button className="flex-1 px-3 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              <span className="font-medium text-slate-900">{filtered.length}</span> results found
              {query && <span> for "{query}"</span>}
            </p>
          </div>
          <div className="space-y-3">
            {filtered.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onClick={() => {
                  setSelectedNotice(notice)
                  setScreen('detail')
                }}
              />
            ))}
            {filtered.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                <IconSearch size={36} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No notices found</p>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailScreen({ notice, setScreen }: { notice: Notice; setScreen: (s: Screen) => void }) {
  const [showSummary, setShowSummary] = useState(false)
  const related = notices.filter((n) => n.category === notice.category && n.id !== notice.id).slice(0, 2)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <button
        onClick={() => setScreen('dashboard')}
        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 mb-5 transition-colors"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge label={notice.category} variant={categoryVariant(notice.category)} />
            <Badge label={notice.priority + ' Priority'} variant={priorityVariant(notice.priority)} />
            {notice.source === 'Automatic' && <Badge label="Auto-detected" variant="blue" />}
            <Badge label="Published" variant="success" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-4">{notice.title}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Department', value: notice.department },
              { label: 'Category', value: notice.category },
              { label: 'Published', value: notice.date },
              { label: 'Source', value: notice.source === 'Automatic' ? 'DSVV Official Source' : 'Department Admin' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[11px] text-slate-400 mb-0.5">{item.label}</p>
                <p className="text-sm font-medium text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700">Description</h2>
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-medium transition-colors border border-purple-200"
            >
              <span>✨</span>
              {showSummary ? 'Show Full Text' : 'AI Summarize'}
            </button>
          </div>
          
          {showSummary ? (
            <div className="bg-purple-50/50 border border-purple-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-purple-700 text-[10px] font-bold uppercase tracking-wider">AI Summary</span>
              </div>
              <ul className="text-sm text-purple-900 space-y-1.5 list-disc list-inside">
                <li>This is an AI generated summary for <strong>{notice.title}</strong>.</li>
                <li>Please review the attached PDF document for full details.</li>
                <li>Ensure any required actions are completed before the deadline.</li>
              </ul>
            </div>
          ) : (
            <p className="text-sm text-slate-600 leading-relaxed">{notice.description}</p>
          )}
        </div>

        {/* PDF Preview */}
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Document Preview</h2>
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl h-48 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <IconPDF size={24} className="text-red-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">
                {notice.title.substring(0, 35)}....pdf
              </p>
              <p className="text-xs text-slate-400 mt-0.5">PDF Document • 245 KB</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
            <IconEye size={15} />
            View PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <IconDownload size={15} />
            Download
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <IconShare size={15} />
            Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <IconBookmark size={15} />
            Save
          </button>
        </div>
      </div>

      {/* Related Notices */}
      {related.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold text-slate-900 mb-3">Related Notices</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {related.map((n) => (
              <NoticeCard
                key={n.id}
                notice={n}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function NotificationsScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [notifs, setNotifs] = useState(notifications)

  const markAllRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })))
  }

  const typeStyles: Record<string, { dot: string; bg: string; label: string }> = {
    urgent: { dot: 'bg-red-500', bg: 'border-red-100 bg-red-50/40', label: 'Urgent' },
    info: { dot: 'bg-blue-500', bg: 'border-blue-100 bg-blue-50/40', label: 'Info' },
    success: { dot: 'bg-green-500', bg: 'border-green-100 bg-green-50/40', label: 'Update' },
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {notifs.filter((n) => !n.read).length} unread notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            <IconCheck size={13} />
            Mark all as read
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifs.map((n) => {
          const style = typeStyles[n.type] ?? typeStyles.info
          return (
            <div
              key={n.id}
              className={`border rounded-xl p-4 transition-all ${
                !n.read ? style.bg : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${style.dot} ${n.read ? 'opacity-30' : ''}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${n.read ? 'text-slate-500' : 'text-slate-900'}`}>
                      {n.title}
                    </p>
                    <span className="text-[11px] text-slate-400 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="font-semibold text-sm text-slate-900 mb-3">Notification Settings</h3>
        {[
          { label: 'Examination Updates', checked: true },
          { label: 'Timetable Updates', checked: true },
          { label: 'Department Notices', checked: true },
          { label: 'Important Circulars', checked: true },
          { label: 'Events', checked: false },
        ].map((item) => (
          <label key={item.label} className="flex items-center gap-3 py-2 cursor-pointer group">
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                item.checked
                  ? 'bg-blue-700 border-blue-700'
                  : 'border-slate-300 group-hover:border-blue-400'
              }`}
            >
              {item.checked && <IconCheck size={10} className="text-white" />}
            </div>
            <span className="text-sm text-slate-700">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function ProfileScreen({ setScreen, onLogout }: { setScreen: (s: Screen) => void; onLogout: () => void }) {
  const [prefs, setPrefs] = useState({
    exam: true,
    timetable: true,
    dept: true,
    circular: true,
    events: false,
  })

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <h1 className="text-xl font-semibold text-slate-900">Profile & Settings</h1>

      {/* Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <span className="text-blue-700 text-xl font-bold">RS</span>
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Rahul Sharma</h2>
            <p className="text-sm text-slate-500">Student · BCA 2nd Year</p>
            <Badge label="Student" variant="blue" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Enrollment No.', value: 'DSVV/BCA/2024/042' },
            { label: 'Course', value: 'BCA' },
            { label: 'Department', value: 'BCA' },
            { label: 'Year', value: '2nd Year' },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50 rounded-lg p-3">
              <p className="text-[11px] text-slate-400 mb-0.5">{item.label}</p>
              <p className="font-medium text-slate-800 text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="font-semibold text-slate-900 text-sm mb-4">Notification Preferences</h3>
        {[
          { key: 'exam', label: 'Examination Updates' },
          { key: 'timetable', label: 'Timetable Updates' },
          { key: 'dept', label: 'Department Notices' },
          { key: 'circular', label: 'Important Circulars' },
          { key: 'events', label: 'Events' },
        ].map((item) => (
          <label key={item.key} className="flex items-center justify-between py-2.5 cursor-pointer border-b border-slate-50 last:border-0">
            <span className="text-sm text-slate-700">{item.label}</span>
            <div
              onClick={() => setPrefs((p) => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
              className={`w-10 h-5.5 rounded-full transition-colors relative ${
                prefs[item.key as keyof typeof prefs] ? 'bg-blue-700' : 'bg-slate-200'
              }`}
              style={{ height: '22px' }}
            >
              <div
                className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${
                  prefs[item.key as keyof typeof prefs] ? 'translate-x-5' : 'translate-x-0.5'
                }`}
                style={{ width: '18px', height: '18px' }}
              />
            </div>
          </label>
        ))}
      </div>

      {/* My Departments */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="font-semibold text-slate-900 text-sm mb-3">My Departments</h3>
        <div className="flex flex-wrap gap-2">
          <Badge label="BCA" variant="blue" />
          <Badge label="Administration" variant="gray" />
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
      >
        <IconLogOut size={16} />
        Logout
      </button>
    </div>
  )
}

export default function StudentApp({ onLogout }: { onLogout: () => void }) {
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null)
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav screen={screen} setScreen={setScreen} unreadCount={unreadCount} />
      <main>
        {screen === 'dashboard' && (
          <DashboardScreen setScreen={setScreen} setSelectedNotice={setSelectedNotice} />
        )}
        {screen === 'search' && (
          <SearchScreen setScreen={setScreen} setSelectedNotice={setSelectedNotice} />
        )}
        {screen === 'detail' && selectedNotice && (
          <DetailScreen notice={selectedNotice} setScreen={setScreen} />
        )}
        {screen === 'notifications' && <NotificationsScreen setScreen={setScreen} />}
        {screen === 'profile' && <ProfileScreen setScreen={setScreen} onLogout={onLogout} />}
      </main>
    </div>
  )
}

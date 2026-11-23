
import {
  Activity,
  Wind,
  MapPin,
  LayoutDashboard,
  Users,
  CalendarDays,
  Home,
  Map,
  MessageCircle,
  Settings,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Sun,
  Cloud,
  Droplets,
  ShieldCheck,
  Clock,
  Sparkles,
  Menu,
  X
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { useState } from "react";

const trendData = [
  { time: "6 AM", aqi: 112 },
  { time: "8 AM", aqi: 138 },
  { time: "10 AM", aqi: 125 },
  { time: "12 PM", aqi: 151 },
  { time: "2 PM", aqi: 143 },
  { time: "4 PM", aqi: 156 },
  { time: "6 PM", aqi: 148 },
  { time: "8 PM", aqi: 132 }
];

const navigation = [
  { name: "Overview", icon: LayoutDashboard, href: "#overview" },
  { name: "Air Quality", icon: Wind, href: "#air-quality" },
  { name: "Family Profiles", icon: Users, href: "#family" },
  { name: "Daily Planner", icon: CalendarDays, href: "#planner" },
  { name: "Indoor Air", icon: Home, href: "#indoor" },
  { name: "Route Planner", icon: Map, href: "#routes" },
  { name: "AI Assistant", icon: MessageCircle, href: "#assistant" }
];

const pollutants = [
  { name: "PM2.5", value: "48", unit: "µg/m³", status: "Elevated", icon: Wind },
  { name: "PM10", value: "82", unit: "µg/m³", status: "Moderate", icon: Activity },
  { name: "NO₂", value: "24", unit: "µg/m³", status: "Good", icon: Cloud },
  { name: "O₃", value: "31", unit: "µg/m³", status: "Good", icon: Sun }
];

function Sidebar() {
  const [active, setActive] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        className="mobile-menu"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X /> : <Menu />}
      </button>

      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Wind size={23} /></div>
          <div>
            <h2>BreatheBetter<span>AI</span></h2>
            <p>SMART AIR. HEALTHY LIFE.</p>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`nav-item ${active === item.name ? "active" : ""}`}
                onClick={() => {
                  setActive(item.name);
                  setMobileOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <Sparkles size={20} />
            <h4>Your air, understood.</h4>
            <p>Get personalized insights for a healthier everyday.</p>
          </div>
          <a href="#settings" className="nav-item">
            <Settings size={19} />
            <span>Settings</span>
          </a>
          <div className="profile-mini">
            <div className="avatar">S</div>
            <div>
              <strong>My Family</strong>
              <p>Personal dashboard</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function Header() {
  const [location, setLocation] = useState("Chennai, India");

  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span>Workspace</span>
        <span>/</span>
        <strong>Overview</strong>
      </div>

      <div className="header-actions">
        <label className="location-box">
          <MapPin size={17} />
          <input
            aria-label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <button className="icon-button" aria-label="Notifications">
          <Bell size={19} />
          <span className="notification-dot" />
        </button>
        <div className="avatar">S</div>
      </div>
    </header>
  );
}

function AQICard() {
  return (
    <section className="aqi-card" id="overview">
      <div className="aqi-card-content">
        <div className="live-label">
          <span className="live-dot" />
          SAMPLE DASHBOARD DATA
        </div>

        <h3>Current Air Quality</h3>
        <p className="aqi-description">
          Your air quality overview for Chennai
        </p>

        <div className="aqi-score">
          <span>156</span>
          <div>
            <span className="aqi-status">Moderate</span>
            <p>Illustrative AQI value</p>
          </div>
        </div>

        <p className="aqi-message">
          Sensitive individuals should consider reducing prolonged or heavy
          outdoor exertion.
        </p>

        <div className="aqi-footer">
          <span><MapPin size={15} /> Chennai, India</span>
          <span><Clock size={15} /> Sample timestamp</span>
        </div>
      </div>

      <div className="aqi-visual">
        <div className="aqi-ring">
          <div className="ring-inner">
            <Wind size={39} />
            <strong>156</strong>
            <span>AQI</span>
          </div>
        </div>
        <p>Air Quality Index</p>
        <span className="sample-tag">DEMO VALUE – NOT LIVE</span>
      </div>
    </section>
  );
}

function PollutantSection() {
  return (
    <section className="section-block" id="air-quality">
      <div className="section-heading">
        <div>
          <h3>Pollutant Overview</h3>
          <p>Illustrative pollutant readings for dashboard design</p>
        </div>
        <button className="text-button">View details <ArrowUpRight size={15} /></button>
      </div>

      <div className="pollutant-grid">
        {pollutants.map((pollutant) => {
          const Icon = pollutant.icon;
          return (
            <div className="pollutant-card" key={pollutant.name}>
              <div className="pollutant-top">
                <div className="pollutant-icon"><Icon size={19} /></div>
                <span className={`status status-${pollutant.status.toLowerCase()}`}>
                  {pollutant.status}
                </span>
              </div>
              <h4>{pollutant.name}</h4>
              <div className="pollutant-value">
                {pollutant.value}
                <span>{pollutant.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TrendChart() {
  return (
    <section className="panel trend-panel">
      <div className="section-heading">
        <div>
          <h3>Air Quality Trends</h3>
          <p>Illustrative AQI pattern throughout the day</p>
        </div>
        <span className="chart-period">Today</span>
      </div>

      <div className="chart-area">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#269B79" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#269B79" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E9EFEB" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#89958E", fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#89958E", fontSize: 11 }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="aqi"
              stroke="#269B79"
              strokeWidth={3}
              fill="url(#aqiGradient)"
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="chart-note">Demo visualization only. Historical observations will be connected in a later phase.</p>
    </section>
  );
}

function Recommendations() {
  return (
    <section className="panel recommendations" id="planner">
      <div className="section-heading">
        <div>
          <h3><Sparkles size={19} /> AI Daily Insights</h3>
          <p>Example guidance for your family</p>
        </div>
        <span className="ai-tag">AI CONCEPT</span>
      </div>

      <div className="recommendation-item">
        <div className="recommendation-icon green"><Sun size={19} /></div>
        <div>
          <strong>Morning activity</strong>
          <p>Check the latest AQI before planning outdoor exercise.</p>
        </div>
      </div>

      <div className="recommendation-item">
        <div className="recommendation-icon orange"><ShieldCheck size={19} /></div>
        <div>
          <strong>Family protection</strong>
          <p>Consider indoor activities when pollution levels are elevated.</p>
        </div>
      </div>

      <div className="recommendation-item">
        <div className="recommendation-icon blue"><Droplets size={19} /></div>
        <div>
          <strong>Indoor air care</strong>
          <p>Reduce indoor smoke and use appropriate air filtration if available.</p>
        </div>
      </div>

      <a href="#assistant" className="ai-button">
        <Sparkles size={17} /> Explore AI recommendations
        <ArrowUpRight size={16} />
      </a>
    </section>
  );
}

function QuickTips() {
  return (
    <section className="quick-tips" id="indoor">
      <div className="tips-heading">
        <div>
          <h3>Small Changes, Cleaner Air</h3>
          <p>Simple habits to help improve your indoor environment</p>
        </div>
        <ShieldCheck size={25} />
      </div>

      <div className="tips-grid">
        <div className="tip-item">
          <div className="tip-icon"><Home size={21} /></div>
          <strong>Reduce indoor smoke</strong>
          <p>Use kitchen exhaust ventilation while cooking.</p>
        </div>
        <div className="tip-item">
          <div className="tip-icon"><Wind size={21} /></div>
          <strong>Filter your air</strong>
          <p>Consider a suitable HEPA air purifier.</p>
        </div>
        <div className="tip-item">
          <div className="tip-icon"><Activity size={21} /></div>
          <strong>Check air quality</strong>
          <p>Review local pollution levels before opening windows.</p>
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header />

        <div className="dashboard-container">
          <div className="welcome-section">
            <div>
              <span className="eyebrow">YOUR PERSONAL AIR COMPANION</span>
              <h1>Breathe better, live better. <span>🌿</span></h1>
              <p>Understand your environment. Make healthier everyday choices.</p>
            </div>
            <div className="weather-pill">
              <Sun size={19} />
              <div>
                <strong>Weather</strong>
                <span>Connect live weather</span>
              </div>
            </div>
          </div>

          <AQICard />
          <PollutantSection />

          <div className="insights-grid">
            <TrendChart />
            <Recommendations />
          </div>

          <QuickTips />

          <footer className="footer">
            <span>© 2026 BreatheBetter AI</span>
            <span>Built for healthier urban living <Wind size={14} /></span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;

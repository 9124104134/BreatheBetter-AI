
import { useState, type FormEvent } from "react";
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
  ArrowUpRight,
  Sun,
  Cloud,
  Droplets,
  ShieldCheck,
  Clock,
  Sparkles,
  Menu,
  X,
  Send,
  Plus,
  Leaf,
  Heart,
  Search,
  Navigation,
  CheckCircle2
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

type FamilyMember = {
  id: number;
  name: string;
  group: string;
  activity: string;
};

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
        <div
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <a className="brand" href="#overview">
          <div className="brand-icon"><Wind size={23} /></div>
          <div>
            <h2>BreatheBetter<span>AI</span></h2>
            <p>SMART AIR. HEALTHY LIFE.</p>
          </div>
        </a>

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

          <a
            href="#settings"
            className={`nav-item ${active === "Settings" ? "active" : ""}`}
            onClick={() => {
              setActive("Settings");
              setMobileOpen(false);
            }}
          >
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
        <strong>BreatheBetter AI</strong>
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
        <a href="#trends" className="text-button">
          View trends <ArrowUpRight size={15} />
        </a>
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
    <section className="panel trend-panel" id="trends">
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

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#E9EFEB"
            />

            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#89958E", fontSize: 11 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#89958E", fontSize: 11 }}
            />

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

      <p className="chart-note">
        Demo visualization only. Historical observations will be connected later.
      </p>
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

      <a href="#planner-details" className="recommendation-item">
        <div className="recommendation-icon green"><Sun size={19} /></div>
        <div>
          <strong>Morning activity</strong>
          <p>Check the latest AQI before planning outdoor exercise.</p>
        </div>
        <ArrowUpRight size={16} />
      </a>

      <a href="#family" className="recommendation-item">
        <div className="recommendation-icon orange"><ShieldCheck size={19} /></div>
        <div>
          <strong>Family protection</strong>
          <p>Explore air-quality planning for your family.</p>
        </div>
        <ArrowUpRight size={16} />
      </a>

      <a href="#indoor" className="recommendation-item">
        <div className="recommendation-icon blue"><Droplets size={19} /></div>
        <div>
          <strong>Indoor air care</strong>
          <p>Explore practical ways to improve indoor air.</p>
        </div>
        <ArrowUpRight size={16} />
      </a>

      <a href="#assistant" className="ai-button">
        <Sparkles size={17} />
        Explore AI recommendations
        <ArrowUpRight size={16} />
      </a>
    </section>
  );
}

function DailyPlanner() {
  return (
    <section className="section-block panel" id="planner-details">
      <div className="section-heading">
        <div>
          <h3><CalendarDays size={19} /> Daily Activity Planner</h3>
          <p>Example routine ideas for days with elevated pollution</p>
        </div>
        <span className="ai-tag">SAMPLE PLAN</span>
      </div>

      <div className="routine-grid">
        <div className="routine-card">
          <Sun size={22} />
          <span>Morning</span>
          <strong>Check local AQI</strong>
          <p>Review current air quality before outdoor activities.</p>
        </div>

        <div className="routine-card">
          <Cloud size={22} />
          <span>Afternoon</span>
          <strong>Choose indoor options</strong>
          <p>Consider indoor exercise if outdoor air is unhealthy.</p>
        </div>

        <div className="routine-card">
          <MoonIcon />
          <span>Evening</span>
          <strong>Review your routine</strong>
          <p>Check air quality again before planning tomorrow.</p>
        </div>
      </div>
    </section>
  );
}

function MoonIcon() {
  return <Clock size={22} />;
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

function FamilyProfiles() {
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: 1,
      name: "Me",
      group: "Adult",
      activity: "Work and daily activities"
    },
    {
      id: 2,
      name: "Family Member 1",
      group: "Child",
      activity: "School and outdoor play"
    },
    {
      id: 3,
      name: "Family Member 2",
      group: "Senior",
      activity: "Light daily activities"
    }
  ]);

  const [newName, setNewName] = useState("");
  const [newGroup, setNewGroup] = useState("Adult");
  const [message, setMessage] = useState("");

  function addMember(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!newName.trim()) {
      setMessage("Please enter a family member name.");
      return;
    }

    setMembers((current) => [
      ...current,
      {
        id: Date.now(),
        name: newName.trim(),
        group: newGroup,
        activity: "Daily activities"
      }
    ]);

    setNewName("");
    setMessage("Family member added successfully.");
  }

  return (
    <section className="section-block" id="family">
      <div className="section-heading">
        <div>
          <h3><Users size={19} /> Family Profiles</h3>
          <p>Manage example family profiles for personalized planning</p>
        </div>
        <span className="ai-tag">LOCAL DEMO</span>
      </div>

      <div className="family-grid">
        {members.map((member) => (
          <div className="family-card" key={member.id}>
            <div className="family-avatar"><Heart size={20} /></div>
            <div>
              <strong>{member.name}</strong>
              <span>{member.group}</span>
              <p>{member.activity}</p>
            </div>
          </div>
        ))}
      </div>

      <form className="add-member-form" onSubmit={addMember}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter family member name"
          aria-label="Family member name"
        />

        <select
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          aria-label="Select age group"
        >
          <option value="Adult">Adult</option>
          <option value="Child">Child</option>
          <option value="Senior">Senior</option>
        </select>

        <button className="primary-button" type="submit">
          <Plus size={17} /> Add member
        </button>
      </form>

      {message && <p className="form-message">{message}</p>}

      <p className="chart-note">
        Demo profiles are held in temporary page state and are not saved to a database.
        Avoid entering sensitive personal or medical information.
      </p>
    </section>
  );
}

function IndoorAir() {
  const tips = [
    {
      icon: Home,
      title: "Reduce indoor smoke",
      description: "Use a kitchen exhaust fan while cooking and avoid indoor smoking."
    },
    {
      icon: Wind,
      title: "Improve filtration",
      description: "Consider a correctly sized HEPA air purifier and maintain its filters."
    },
    {
      icon: Droplets,
      title: "Control dust",
      description: "Use damp dusting and regular cleaning to reduce settled dust."
    },
    {
      icon: Cloud,
      title: "Ventilate thoughtfully",
      description: "Ventilate when outdoor air quality is better, rather than assuming windows should always be open."
    }
  ];

  return (
    <section className="section-block" id="indoor-details">
      <div className="section-heading">
        <div>
          <h3><Home size={19} /> Indoor Air Optimization</h3>
          <p>Practical ways to support a cleaner indoor environment</p>
        </div>
        <span className="ai-tag">HOME GUIDE</span>
      </div>

      <div className="indoor-grid">
        {tips.map((tip) => {
          const Icon = tip.icon;

          return (
            <div className="indoor-card" key={tip.title}>
              <div className="tip-icon"><Icon size={22} /></div>
              <h4>{tip.title}</h4>
              <p>{tip.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RoutePlanner() {
  const [start, setStart] = useState("Chennai");
  const [destination, setDestination] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!start.trim() || !destination.trim()) {
      setMessage("Please enter both your starting point and destination.");
      return;
    }

    setMessage(
      `Your journey request from ${start.trim()} to ${destination.trim()} has been recorded in this preview. Live route and pollution comparisons will be available after backend integration.`
    );
  }

  return (
    <section className="section-block panel" id="routes">
      <div className="section-heading">
        <div>
          <h3><Map size={19} /> Low-Exposure Route Planner</h3>
          <p>Plan journeys with air quality in mind</p>
        </div>
        <span className="ai-tag">PREVIEW</span>
      </div>

      <div className="route-intro">
        <div className="route-icon"><Navigation size={25} /></div>
        <div>
          <strong>Plan a more informed journey</strong>
          <p>Enter your locations to prepare a route request.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="route-form">
        <label>
          Starting point
          <input
            value={start}
            onChange={(e) => setStart(e.target.value)}
            placeholder="Enter starting point"
          />
        </label>

        <label>
          Destination
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination"
          />
        </label>

        <button type="submit" className="primary-button">
          <MapPin size={17} /> Check route
        </button>
      </form>

      {message && (
        <div className="route-message">
          <CheckCircle2 size={19} />
          <p>{message}</p>
        </div>
      )}

      <p className="chart-note">
        This is a frontend preview. It does not calculate actual routes or live pollution levels.
        The shortest route is not necessarily the cleanest route.
      </p>
    </section>
  );
}

function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      question: "",
      answer:
        "Hello! I'm your BreatheBetter assistant. Ask me about indoor air, outdoor activities, or ways to reduce pollution exposure."
    }
  ]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!question.trim()) return;

    const submittedQuestion = question.trim();

    setMessages((current) => [
      ...current,
      {
        question: submittedQuestion,
        answer:
          "Thanks for your question! This is the assistant preview. Once Gemini and verified air-quality data are connected, I can provide more personalized recommendations. For now, check local AQI readings and follow official health guidance."
      }
    ]);

    setQuestion("");
  }

  return (
    <section className="section-block panel" id="assistant">
      <div className="section-heading">
        <div>
          <h3><MessageCircle size={19} /> BreatheBetter AI Assistant</h3>
          <p>Your personal air-quality guidance companion</p>
        </div>
        <span className="ai-tag">AI PREVIEW</span>
      </div>

      <div className="chat-area">
        {messages.map((message, index) => (
          <div className="chat-pair" key={index}>
            {message.question && (
              <div className="user-message">
                <strong>You</strong>
                <p>{message.question}</p>
              </div>
            )}

            <div className="assistant-message">
              <div className="assistant-avatar"><Sparkles size={18} /></div>
              <div>
                <strong>BreatheBetter AI</strong>
                <p>{message.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="assistant-form">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about air quality or healthy routines..."
          aria-label="Ask the AI assistant"
        />
        <button type="submit" className="primary-button">
          <Send size={17} /> Send
        </button>
      </form>

      <p className="chart-note">
        Preview responses only. Gemini integration will be added through the backend.
      </p>
    </section>
  );
}

function SettingsSection() {
  return (
    <section className="section-block panel" id="settings">
      <div className="section-heading">
        <div>
          <h3><Settings size={19} /> Settings</h3>
          <p>Application information and preferences</p>
        </div>
      </div>
      <div className="settings-content">
        <p><CheckCircle2 size={17} /> BreatheBetter AI frontend is active.</p>
        <p><CheckCircle2 size={17} /> Dashboard demo data is enabled.</p>
        <p><Clock size={17} /> Live data connections are planned for the backend phase.</p>
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
                <span>Live weather connection coming soon</span>
              </div>
            </div>
          </div>

          <AQICard />

          <PollutantSection />

          <div className="insights-grid">
            <TrendChart />
            <Recommendations />
          </div>

          <DailyPlanner />

          <FamilyProfiles />

          <QuickTips />

          <IndoorAir />

          <RoutePlanner />

          <AIAssistant />

          <SettingsSection />

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


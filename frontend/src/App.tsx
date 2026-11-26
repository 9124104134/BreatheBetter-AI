
import { useState, useEffect, type FormEvent } from "react";
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
  Heart,
  Navigation,
  CheckCircle2,
  RefreshCw
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

// -------------------- API CONFIGURATION --------------------

const AIR_QUALITY_API_URL =
  "https://breathebetter-ai.onrender.com/api/air-quality?latitude=13.0827&longitude=80.2707";

const AIR_QUALITY_FORECAST_API_URL =
  "https://breathebetter-ai.onrender.com/api/air-quality/forecast?latitude=13.0827&longitude=80.2707";

// -------------------- API TYPES --------------------

type PollutantKey =
  | "pm2_5"
  | "pm10"
  | "carbon_monoxide"
  | "nitrogen_dioxide"
  | "sulphur_dioxide"
  | "ozone";

type AirQualityResponse = {
  location?: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  data_type: string;
  source: string;
  current_pollutants: Partial<
    Record<PollutantKey, number | null>
  >;
  pollutant_averages: Partial<
    Record<PollutantKey, number | null>
  >;
  sub_indices: Partial<
    Record<
      PollutantKey,
      {
        name: string;
        average_concentration: number;
        unit: string;
        sub_index: number;
        category: string;
      }
    >
  >;
  aqi_estimate: {
    aqi: number | null;
    aqi_display: string;
    category: string | null;
    dominant_pollutant: string | null;
    valid_pollutant_count: number;
    minimum_pollutants_required: number;
  };
  data_coverage?: Record<
    string,
    {
      valid_hours?: number;
      required_hours?: number;
      sufficient?: boolean;
    }
  >;
  notes?: string[];
};

type ForecastItem = {
  timestamp: string;
  aqi_estimate: {
    aqi: number | null;
    aqi_display: string;
    category: string | null;
    dominant_pollutant: string | null;
    valid_pollutant_count: number;
    minimum_pollutants_required: number;
  };
  pollutant_averages: Partial<
    Record<PollutantKey, number | null>
  >;
  sub_indices: Partial<
    Record<
      PollutantKey,
      {
        name: string;
        average_concentration: number;
        unit: string;
        sub_index: number;
        category: string;
      }
    >
  >;
};

type AirQualityForecastResponse = {
  location: string;
  latitude: number;
  longitude: number;
  data_type: string;
  source: string;
  attribution: string;
  forecast_period: string;
  averaging_method: string;
  notes: string[];
  forecast: ForecastItem[];
};

type FamilyMember = {
  id: number;
  name: string;
  group: string;
  activity: string;
};

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
};

// -------------------- NAVIGATION --------------------

const navigation = [
  { name: "Overview", icon: LayoutDashboard, href: "#overview" },
  { name: "Air Quality", icon: Wind, href: "#air-quality" },
  { name: "Family Profiles", icon: Users, href: "#family" },
  { name: "Daily Planner", icon: CalendarDays, href: "#planner-details" },
  { name: "Indoor Air", icon: Home, href: "#indoor-details" },
  { name: "Route Planner", icon: Map, href: "#routes" },
  { name: "AI Assistant", icon: MessageCircle, href: "#assistant" }
];

// -------------------- POLLUTANT CONFIGURATION --------------------

const pollutantConfig = [
  { key: "pm2_5", name: "PM2.5", unit: "µg/m³", icon: Wind },
  { key: "pm10", name: "PM10", unit: "µg/m³", icon: Activity },
  {
    key: "nitrogen_dioxide",
    name: "NO₂",
    unit: "µg/m³",
    icon: Cloud
  },
  { key: "ozone", name: "O₃", unit: "µg/m³", icon: Sun },
  {
    key: "carbon_monoxide",
    name: "CO",
    unit: "µg/m³",
    icon: Activity
  },
  {
    key: "sulphur_dioxide",
    name: "SO₂",
    unit: "µg/m³",
    icon: Wind
  }
] as const;

// -------------------- HELPERS --------------------

function formatForecastTime(timestamp: string) {
  const date = new Date(`${timestamp}:00+05:30`);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata"
  });
}

// -------------------- SIDEBAR --------------------

function Sidebar() {
  const [active, setActive] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="mobile-menu"
        onClick={() => setMobileOpen((previous) => !previous)}
        aria-label="Toggle navigation"
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X size={23} /> : <Menu size={23} />}
      </button>

      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <a
          className="brand"
          href="#overview"
          onClick={() => {
            setActive("Overview");
            closeMobileMenu();
          }}
        >
          <div className="brand-icon">
            <Wind size={23} />
          </div>
          <div>
            <h2>
              BreatheBetter<span>AI</span>
            </h2>
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
                className={`nav-item ${
                  active === item.name ? "active" : ""
                }`}
                onClick={() => {
                  setActive(item.name);
                  closeMobileMenu();
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
            <p>
              Get personalized insights for a healthier everyday.
            </p>
          </div>

          <a
            href="#settings"
            className={`nav-item ${
              active === "Settings" ? "active" : ""
            }`}
            onClick={() => {
              setActive("Settings");
              closeMobileMenu();
            }}
          >
            <Settings size={19} />
            <span>Settings</span>
          </a>

          <a
            href="#family"
            className="profile-mini profile-link"
            onClick={() => {
              setActive("Family Profiles");
              closeMobileMenu();
            }}
          >
            <div className="avatar">S</div>
            <div>
              <strong>My Family</strong>
              <p>Open family profile</p>
            </div>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </aside>
    </>
  );
}

// -------------------- HEADER + NOTIFICATIONS --------------------

function Header() {
  const [location, setLocation] = useState("Chennai, India");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "Air quality reminder",
      message:
        "Check the latest AQI before planning outdoor activities.",
      time: "Just now",
      unread: true
    },
    {
      id: 2,
      title: "Indoor air tip",
      message:
        "Remember to use kitchen exhaust ventilation while cooking.",
      time: "Earlier",
      unread: true
    },
    {
      id: 3,
      title: "Daily planner",
      message:
        "Review your family's daily air-quality routine.",
      time: "Today",
      unread: false
    }
  ]);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false
      }))
    );
  }

  function markAsRead(id: number) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  }

  function clearNotifications() {
    setNotifications([]);
  }

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

        <div className="notification-wrapper">
          <button
            type="button"
            className="icon-button notification-button"
            aria-label={`Notifications${
              unreadCount > 0 ? `, ${unreadCount} unread` : ""
            }`}
            aria-expanded={notificationsOpen}
            onClick={() =>
              setNotificationsOpen((previous) => !previous)
            }
          >
            <Bell size={19} />

            {unreadCount > 0 && (
              <span className="notification-dot" />
            )}
          </button>

          {notificationsOpen && (
            <div className="notification-panel">
              <div className="notification-header">
                <div>
                  <h3>Notifications</h3>
                  <p>
                    {unreadCount > 0
                      ? `${unreadCount} unread notifications`
                      : "You're all caught up"}
                  </p>
                </div>

                <button
                  type="button"
                  className="notification-close"
                  onClick={() => setNotificationsOpen(false)}
                  aria-label="Close notifications"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="notification-actions">
                <button
                  type="button"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark all as read
                </button>

                <button
                  type="button"
                  onClick={clearNotifications}
                  disabled={notifications.length === 0}
                >
                  Clear all
                </button>
              </div>

              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="notification-empty">
                    <Bell size={25} />
                    <strong>No notifications</strong>
                    <p>You're all caught up!</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <button
                      type="button"
                      key={notification.id}
                      className={`notification-item ${
                        notification.unread ? "unread" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <span className="notification-icon">
                        <Bell size={17} />
                      </span>

                      <span className="notification-content">
                        <strong>{notification.title}</strong>
                        <span>{notification.message}</span>
                        <small>{notification.time}</small>
                      </span>

                      {notification.unread && (
                        <span className="unread-indicator" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <a
          href="#family"
          className="avatar profile-avatar"
          aria-label="Open my family profile"
          title="Open My Family"
        >
          S
        </a>
      </div>
    </header>
  );
}

// -------------------- AQI OVERVIEW --------------------

function AQICard({
  data,
  loading,
  error,
  onRefresh
}: {
  data: AirQualityResponse | null;
  loading: boolean;
  error: string;
  onRefresh: () => void;
}) {
  const aqi = data?.aqi_estimate;
  const aqiValue = aqi?.aqi_display ?? "—";
  const category = aqi?.category ?? "Unavailable";

  const timestamp = data?.timestamp
    ? `${data.timestamp.replace("T", " ")} (IST)`
    : "Not available";

  return (
    <section className="aqi-card" id="overview">
      <div className="aqi-card-content">
        <div className="live-label">
          <span className="live-dot" />
          {loading ? "FETCHING AIR QUALITY" : "LIVE MODEL DATA"}
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "refresh-spinning" : ""}
          />
          {loading ? "Refreshing..." : "Refresh Air Quality"}
        </button>

        <h3>Current Air Quality</h3>

        <p className="aqi-description">
          Your air quality overview for Chennai
        </p>

        <div className="aqi-score">
          <span>{loading ? "..." : aqiValue}</span>

          <div>
            <span className="aqi-status">{category}</span>
            <p>
              {data
                ? "Estimated AQI value"
                : loading
                  ? "Fetching data..."
                  : "AQI unavailable"}
            </p>
          </div>
        </div>

        <p className="aqi-message">
          {loading
            ? "Fetching the latest available pollutant information."
            : error
              ? "Air-quality data could not be retrieved. Please try again."
              : !aqi || aqi.aqi === null
                ? "There is insufficient pollutant data to calculate an AQI estimate."
                : `The dominant pollutant is ${
                    aqi.dominant_pollutant ?? "not available"
                  }. Use this estimate to inform your outdoor activity planning.`}
        </p>

        {error && <p className="form-message">{error}</p>}

        <div className="aqi-footer">
          <span>
            <MapPin size={15} /> Chennai, India
          </span>

          <span>
            <Clock size={15} /> {timestamp}
          </span>
        </div>

        <p className="chart-note">
          Source: {data?.source ?? "Open-Meteo Air Quality API"}.
          This is a model-based estimate, not an official CPCB
          monitoring-station reading.
        </p>
      </div>

      <div className="aqi-visual">
        <div className="aqi-ring">
          <div className="ring-inner">
            <Wind size={39} />
            <strong>{loading ? "..." : aqiValue}</strong>
            <span>AQI</span>
          </div>
        </div>

        <p>Air Quality Index</p>

        <span className="sample-tag">
          MODEL-BASED ESTIMATE
        </span>
      </div>
    </section>
  );
}

// -------------------- POLLUTANTS --------------------

function PollutantSection({
  data,
  loading
}: {
  data: AirQualityResponse | null;
  loading: boolean;
}) {
  return (
    <section className="section-block" id="air-quality">
      <div className="section-heading">
        <div>
          <h3>Pollutant Overview</h3>
          <p>
            Current pollutant concentrations from Open-Meteo
          </p>
        </div>

        <span className="ai-tag">MODEL DATA</span>
      </div>

      <div className="pollutant-grid">
        {pollutantConfig.map((pollutant) => {
          const Icon = pollutant.icon;

          const value =
            data?.current_pollutants?.[pollutant.key];

          const status =
            data?.sub_indices?.[pollutant.key]?.category ??
            "Unavailable";

          return (
            <div className="pollutant-card" key={pollutant.key}>
              <div className="pollutant-top">
                <div className="pollutant-icon">
                  <Icon size={19} />
                </div>

                <span
                  className={`status status-${status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {loading ? "Loading" : status}
                </span>
              </div>

              <h4>{pollutant.name}</h4>

              <div className="pollutant-value">
                {loading
                  ? "..."
                  : value !== null && value !== undefined
                    ? Number(value.toFixed(2))
                    : "—"}

                <span>{pollutant.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="chart-note">
        These are current model-based pollutant concentrations.
        The displayed status is based on the corresponding
        calculated sub-index, where sufficient historical data
        is available.
      </p>
    </section>
  );
}

// -------------------- 24-HOUR FORECAST --------------------

function TrendChart({
  forecast,
  loading,
  error
}: {
  forecast: ForecastItem[];
  loading: boolean;
  error: string;
}) {
  const chartData = forecast
    .filter((item) => item.aqi_estimate.aqi !== null)
    .map((item) => ({
      time: formatForecastTime(item.timestamp),
      aqi: item.aqi_estimate.aqi as number,
      category: item.aqi_estimate.category ?? "Unavailable",
      dominant: item.aqi_estimate.dominant_pollutant ?? "Unavailable"
    }));

  const validValues = chartData.map((item) => item.aqi);

  const minimumAQI =
    validValues.length > 0
      ? Math.max(0, Math.floor(Math.min(...validValues) - 10))
      : 0;

  const maximumAQI =
    validValues.length > 0
      ? Math.ceil(Math.max(...validValues) + 10)
      : 100;

  return (
    <section className="panel trend-panel" id="trends">
      <div className="section-heading">
        <div>
          <h3>24-Hour Air Quality Forecast</h3>
          <p>Expected AQI changes throughout the next 24 hours</p>
        </div>

        <span className="chart-period">Next 24 Hours</span>
      </div>

      {loading ? (
        <div className="chart-area">
          <p>Loading air-quality forecast...</p>
        </div>
      ) : error ? (
        <div className="chart-area">
          <p>{error}</p>
        </div>
      ) : chartData.length === 0 ? (
        <div className="chart-area">
          <p>No valid forecast data is currently available.</p>
        </div>
      ) : (
        <>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="aqiGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#269B79"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="#269B79"
                      stopOpacity={0.01}
                    />
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
                  interval="preserveStartEnd"
                  tick={{ fill: "#89958E", fontSize: 11 }}
                />

                <YAxis
                  domain={[minimumAQI, maximumAQI]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#89958E", fontSize: 11 }}
                />

                <Tooltip
                  formatter={(value) => [
                    `${value} AQI`,
                    "Forecast AQI"
                  ]}
                  labelFormatter={(label) => `Time: ${label}`}
                />

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

          <div className="forecast-summary">
            <div>
              <strong>{chartData[0].aqi}</strong>
              <span>First forecast AQI</span>
            </div>

            <div>
              <strong>{Math.min(...validValues)}</strong>
              <span>Lowest forecast AQI</span>
            </div>

            <div>
              <strong>{Math.max(...validValues)}</strong>
              <span>Highest forecast AQI</span>
            </div>
          </div>
        </>
      )}

      <p className="chart-note">
        Forecast source: Open-Meteo Air Quality API (CAMS).
        Model-based estimates, not official CPCB station forecasts.
        Each point represents a forecast averaging window.
      </p>
    </section>
  );
}

// -------------------- RECOMMENDATIONS --------------------

function Recommendations() {
  return (
    <section className="panel recommendations" id="planner">
      <div className="section-heading">
        <div>
          <h3>
            <Sparkles size={19} /> AI Daily Insights
          </h3>
          <p>Example guidance for your family</p>
        </div>

        <span className="ai-tag">AI CONCEPT</span>
      </div>

      <a href="#planner-details" className="recommendation-item">
        <div className="recommendation-icon green">
          <Sun size={19} />
        </div>
        <div>
          <strong>Morning activity</strong>
          <p>Check the latest AQI before planning outdoor exercise.</p>
        </div>
        <ArrowUpRight size={16} />
      </a>

      <a href="#family" className="recommendation-item">
        <div className="recommendation-icon orange">
          <ShieldCheck size={19} />
        </div>
        <div>
          <strong>Family protection</strong>
          <p>Explore air-quality planning for your family.</p>
        </div>
        <ArrowUpRight size={16} />
      </a>

      <a href="#indoor-details" className="recommendation-item">
        <div className="recommendation-icon blue">
          <Droplets size={19} />
        </div>
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

// -------------------- DAILY PLANNER --------------------

function DailyPlanner() {
  return (
    <section className="section-block panel" id="planner-details">
      <div className="section-heading">
        <div>
          <h3>
            <CalendarDays size={19} /> Daily Activity Planner
          </h3>
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
          <Clock size={22} />
          <span>Evening</span>
          <strong>Review your routine</strong>
          <p>Check air quality again before planning tomorrow.</p>
        </div>
      </div>
    </section>
  );
}

// -------------------- QUICK TIPS --------------------

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
          <div className="tip-icon">
            <Home size={21} />
          </div>
          <strong>Reduce indoor smoke</strong>
          <p>Use kitchen exhaust ventilation while cooking.</p>
        </div>

        <div className="tip-item">
          <div className="tip-icon">
            <Wind size={21} />
          </div>
          <strong>Filter your air</strong>
          <p>Consider a suitable HEPA air purifier.</p>
        </div>

        <div className="tip-item">
          <div className="tip-icon">
            <Activity size={21} />
          </div>
          <strong>Check air quality</strong>
          <p>Review local pollution levels before opening windows.</p>
        </div>
      </div>
    </section>
  );
}

// -------------------- FAMILY PROFILES --------------------

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
          <h3>
            <Users size={19} /> Family Profiles
          </h3>
          <p>Manage example family profiles for personalized planning</p>
        </div>

        <span className="ai-tag">LOCAL DEMO</span>
      </div>

      <div className="family-grid">
        {members.map((member) => (
          <div className="family-card" key={member.id}>
            <div className="family-avatar">
              <Heart size={20} />
            </div>
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
        Demo profiles are held in temporary page state and are not saved to a
        database. Avoid entering sensitive personal or medical information.
      </p>
    </section>
  );
}

// -------------------- INDOOR AIR --------------------

function IndoorAir() {
  const tips = [
    {
      icon: Home,
      title: "Reduce indoor smoke",
      description:
        "Use a kitchen exhaust fan while cooking and avoid indoor smoking."
    },
    {
      icon: Wind,
      title: "Improve filtration",
      description:
        "Consider a correctly sized HEPA air purifier and maintain its filters."
    },
    {
      icon: Droplets,
      title: "Control dust",
      description:
        "Use damp dusting and regular cleaning to reduce settled dust."
    },
    {
      icon: Cloud,
      title: "Ventilate thoughtfully",
      description:
        "Ventilate when outdoor air quality is better, rather than assuming windows should always be open."
    }
  ];

  return (
    <section className="section-block" id="indoor-details">
      <div className="section-heading">
        <div>
          <h3>
            <Home size={19} /> Indoor Air Optimization
          </h3>
          <p>Practical ways to support a cleaner indoor environment</p>
        </div>

        <span className="ai-tag">HOME GUIDE</span>
      </div>

      <div className="indoor-grid">
        {tips.map((tip) => {
          const Icon = tip.icon;

          return (
            <div className="indoor-card" key={tip.title}>
              <div className="tip-icon">
                <Icon size={22} />
              </div>
              <h4>{tip.title}</h4>
              <p>{tip.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// -------------------- ROUTE PLANNER --------------------

function RoutePlanner() {
  const [start, setStart] = useState("Chennai");
  const [destination, setDestination] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!start.trim() || !destination.trim()) {
      setMessage(
        "Please enter both your starting point and destination."
      );
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
          <h3>
            <Map size={19} /> Low-Exposure Route Planner
          </h3>
          <p>Plan journeys with air quality in mind</p>
        </div>

        <span className="ai-tag">PREVIEW</span>
      </div>

      <div className="route-intro">
        <div className="route-icon">
          <Navigation size={25} />
        </div>
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
        This is a frontend preview. It does not calculate actual routes or live
        pollution levels. The shortest route is not necessarily the cleanest
        route.
      </p>
    </section>
  );
}

// -------------------- AI ASSISTANT --------------------

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
          <h3>
            <MessageCircle size={19} /> BreatheBetter AI Assistant
          </h3>
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
              <div className="assistant-avatar">
                <Sparkles size={18} />
              </div>
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
        Preview responses only. Gemini integration will be added through the
        backend.
      </p>
    </section>
  );
}

// -------------------- SETTINGS --------------------

function SettingsSection() {
  return (
    <section className="section-block panel" id="settings">
      <div className="section-heading">
        <div>
          <h3>
            <Settings size={19} /> Settings
          </h3>
          <p>Application information and preferences</p>
        </div>
      </div>

      <div className="settings-content">
        <p>
          <CheckCircle2 size={17} /> BreatheBetter AI frontend is active.
        </p>
        <p>
          <CheckCircle2 size={17} /> Live model-based air-quality data is enabled.
        </p>
        <p>
          <Clock size={17} /> Historical trends and other integrations are planned.
        </p>
      </div>
    </section>
  );
}

// -------------------- MAIN APP --------------------

function App() {
  const [airQuality, setAirQuality] =
    useState<AirQualityResponse | null>(null);

  const [airQualityLoading, setAirQualityLoading] =
    useState(true);

  const [airQualityError, setAirQualityError] =
    useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  const [forecast, setForecast] =
    useState<ForecastItem[]>([]);

  const [forecastLoading, setForecastLoading] =
    useState(true);

  const [forecastError, setForecastError] =
    useState("");

  // -------------------- CURRENT AQI FETCH --------------------

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, 15000);

    async function fetchAirQuality() {
      setAirQualityLoading(true);
      setAirQualityError("");

      try {
        const response = await fetch(AIR_QUALITY_API_URL, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(
            `Air-quality API returned HTTP ${response.status}`
          );
        }

        const result =
          (await response.json()) as AirQualityResponse;

        if (!result.aqi_estimate || !result.current_pollutants) {
          throw new Error(
            "The API returned an unexpected response."
          );
        }

        if (active) {
          setAirQuality(result);
          setAirQualityError("");
        }
      } catch (error) {
        if (!active) return;

        if (controller.signal.aborted) {
          setAirQualityError(
            "Air-quality request timed out. Please try refreshing."
          );
        } else {
          setAirQualityError(
            error instanceof Error
              ? `${error.message}. Please try refreshing the data.`
              : "Unable to fetch air-quality data. Please try again."
          );
        }
      } finally {
        window.clearTimeout(timeoutId);

        if (active) {
          setAirQualityLoading(false);
        }
      }
    }

    fetchAirQuality();

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [refreshKey]);

  // -------------------- 24-HOUR FORECAST FETCH --------------------

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, 15000);

    async function fetchForecast() {
      setForecastLoading(true);
      setForecastError("");

      try {
        const response = await fetch(
          AIR_QUALITY_FORECAST_API_URL,
          {
            signal: controller.signal
          }
        );

        if (!response.ok) {
          throw new Error(
            `Forecast API returned HTTP ${response.status}`
          );
        }

        const result =
          (await response.json()) as AirQualityForecastResponse;

        if (!Array.isArray(result.forecast)) {
          throw new Error(
            "The forecast API returned an unexpected response."
          );
        }

        if (active) {
          setForecast(result.forecast);
          setForecastError("");
        }
      } catch (error) {
        if (!active) return;

        if (controller.signal.aborted) {
          setForecastError(
            "Forecast request timed out. Please reload the dashboard."
          );
        } else {
          setForecastError(
            error instanceof Error
              ? error.message
              : "Unable to fetch air-quality forecast."
          );
        }
      } finally {
        window.clearTimeout(timeoutId);

        if (active) {
          setForecastLoading(false);
        }
      }
    }

    fetchForecast();

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  // -------------------- DASHBOARD --------------------

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header />

        <div className="dashboard-container">
          <div className="welcome-section">
            <div>
              <span className="eyebrow">
                YOUR PERSONAL AIR COMPANION
              </span>
              <h1>
                Breathe better, live better. <span>🌿</span>
              </h1>
              <p>
                Understand your environment. Make healthier everyday choices.
              </p>
            </div>

            <div className="weather-pill">
              <Sun size={19} />
              <div>
                <strong>Weather</strong>
                <span>Live weather connection coming soon</span>
              </div>
            </div>
          </div>

          <AQICard
            data={airQuality}
            loading={airQualityLoading}
            error={airQualityError}
            onRefresh={() =>
              setRefreshKey((current) => current + 1)
            }
          />

          <PollutantSection
            data={airQuality}
            loading={airQualityLoading}
          />

          <div className="insights-grid">
            <TrendChart
              forecast={forecast}
              loading={forecastLoading}
              error={forecastError}
            />

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
            <span>
              Built for healthier urban living <Wind size={14} />
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const StatCard = ({ label, value, color, icon }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color} flex-shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/tasks/dashboard");
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          👋 Welcome back, {user?.name}!
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Here's a summary of your tasks.{" "}
          <span className="capitalize font-medium text-indigo-600">{user?.role}</span> access.
        </p>
      </div>

      {/* Fix 2 — updated stat cards with new status names */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Tasks" value={stats?.total ?? 0} color="bg-indigo-50" icon="📋" />
        <StatCard label="To Do" value={stats?.todo ?? 0} color="bg-yellow-50" icon="⏳" />
        <StatCard label="In Progress" value={stats?.inProgress ?? 0} color="bg-blue-50" icon="🔄" />
        <StatCard label="Done" value={stats?.done ?? 0} color="bg-green-50" icon="✅" />
      </div>

      {/* Overdue Alert */}
      {stats?.overdue > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-6">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div>
            <p className="text-red-700 font-medium text-sm">
              {stats.overdue} overdue {stats.overdue === 1 ? "task" : "tasks"}
            </p>
            <p className="text-red-500 text-xs mt-0.5">
              Please check the Tasks page and update these.
            </p>
          </div>
        </div>
      )}

      {/* Fix 3 — Tasks per user section */}
      {stats?.tasksPerUser && Object.keys(stats.tasksPerUser).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">📊 Tasks Per Member</h3>
          <div className="space-y-3">
            {Object.entries(stats.tasksPerUser).map(([name, count]) => (
              <div key={name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs flex-shrink-0">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">{name}</span>
                    <span className="text-xs font-medium text-indigo-600">{count} task{count !== 1 ? "s" : ""}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full"
                      style={{ width: `${Math.min((count / stats.total) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
        <h3 className="font-semibold text-indigo-800 mb-2 text-sm">
          {user?.role === "admin" ? "👑 Admin Tips" : "💡 Member Tips"}
        </h3>
        <ul className="text-sm text-indigo-700 space-y-1 list-disc list-inside">
          {user?.role === "admin" ? (
            <>
              <li>Create projects and add team members from the Projects page.</li>
              <li>Assign tasks to members from the Tasks page.</li>
              <li>Track all team progress from this dashboard.</li>
            </>
          ) : (
            <>
              <li>View your assigned tasks in the Tasks page.</li>
              <li>Update task status as you make progress.</li>
              <li>Check the Projects page for your project details.</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

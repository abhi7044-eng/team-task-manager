import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Individual stat card component
const StatCard = ({ label, value, color, icon }) => (
  <div className={`bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
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
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          👋 Welcome back, {user?.name}!
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Here's a summary of your tasks.{" "}
          <span className="capitalize font-medium text-indigo-600">{user?.role}</span> access.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Total Tasks"
          value={stats?.total ?? 0}
          color="bg-indigo-50"
          icon="📋"
        />
        <StatCard
          label="Pending"
          value={stats?.pending ?? 0}
          color="bg-yellow-50"
          icon="⏳"
        />
        <StatCard
          label="In Progress"
          value={stats?.inProgress ?? 0}
          color="bg-blue-50"
          icon="🔄"
        />
        <StatCard
          label="Completed"
          value={stats?.completed ?? 0}
          color="bg-green-50"
          icon="✅"
        />
      </div>

      {/* Overdue Alert */}
      {stats?.overdue > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-red-700 font-medium">
              {stats.overdue} overdue {stats.overdue === 1 ? "task" : "tasks"}
            </p>
            <p className="text-red-500 text-sm">
              Please check the Tasks page and update these.
            </p>
          </div>
        </div>
      )}

      {/* Tips for role */}
      <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-5">
        <h3 className="font-semibold text-indigo-800 mb-2">
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

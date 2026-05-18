import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Fix 2 — updated status names
const statusColor = {
  "To Do": "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Done": "bg-green-100 text-green-700",
};

const priorityColor = {
  "Low": "bg-gray-100 text-gray-600",
  "Medium": "bg-orange-100 text-orange-700",
  "High": "bg-red-100 text-red-700",
};

const isOverdue = (dueDate, status) => {
  return new Date(dueDate) < new Date() && status !== "Done";
};

// ── Task Form Modal (admin only) ─────────────────────────────────────────────
function TaskModal({ onClose, onSave, projects, users, initial }) {
  const [form, setForm] = useState(
    initial
      ? {
          title: initial.title,
          description: initial.description,
          projectId: initial.projectId?._id || "",
          assignedTo: initial.assignedTo?._id || "",
          dueDate: initial.dueDate?.slice(0, 10) || "",
          status: initial.status,
          priority: initial.priority || "Medium",
        }
      : {
          title: "",
          description: "",
          projectId: "",
          assignedTo: "",
          dueDate: "",
          status: "To Do",
          priority: "Medium",
        }
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.projectId || !form.assignedTo || !form.dueDate) {
      return toast.error("Please fill in all required fields");
    }
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">
          {initial ? "Edit Task" : "Create New Task"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Task title"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Task details..."
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
            <select
              name="projectId"
              value={form.projectId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Select a project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign To *</label>
            <select
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Select a member</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>

          {/* Fix 1 — Priority field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {initial && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {initial ? "Save Changes" : "Create Task"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Status Modal (member only) ────────────────────────────────────────────────
function StatusModal({ task, onClose, onSave }) {
  const [status, setStatus] = useState(task.status);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Update Status</h2>
        <p className="text-sm text-gray-500 mb-4">{task.title}</p>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white mb-4"
        >
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>

        <div className="flex gap-3">
          <button
            onClick={() => onSave(status)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium"
          >
            Update
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tasks Page ───────────────────────────────────────────────────────────────
export default function Tasks() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [statusTask, setStatusTask] = useState(null);

  const fetchData = async () => {
    try {
      const [taskRes, projRes] = await Promise.all([
        API.get("/tasks"),
        API.get("/projects"),
      ]);
      setTasks(taskRes.data);
      setProjects(projRes.data);

      if (isAdmin) {
        const usersRes = await API.get("/users");
        setAllUsers(usersRes.data);
      }
    } catch (err) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (form) => {
    try {
      if (editTask) {
        await API.put(`/tasks/${editTask._id}`, form);
        toast.success("Task updated!");
      } else {
        await API.post("/tasks", form);
        toast.success("Task created!");
      }
      setShowModal(false);
      setEditTask(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await API.put(`/tasks/${statusTask._id}`, { status: newStatus });
      toast.success("Status updated!");
      setStatusTask(null);
      fetchData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  if (loading) {
    return <div className="text-gray-400 text-center mt-20">Loading tasks...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
          <p className="text-sm text-gray-500 mt-1">
            {isAdmin ? "Manage all team tasks" : "Your assigned tasks"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setEditTask(null); setShowModal(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + New Task
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-lg font-medium">No tasks yet</p>
          {isAdmin && <p className="text-sm mt-1">Create your first task to assign work.</p>}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Task</th>
                <th className="px-6 py-3 text-left">Project</th>
                <th className="px-6 py-3 text-left">Assigned To</th>
                <th className="px-6 py-3 text-left">Priority</th>
                <th className="px-6 py-3 text-left">Due Date</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{t.title}</p>
                    {t.description && (
                      <p className="text-gray-400 text-xs mt-0.5 max-w-xs truncate">{t.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{t.projectId?.title || "—"}</td>
                  <td className="px-6 py-4 text-gray-600">{t.assignedTo?.name || "—"}</td>
                  {/* Fix 1 — show priority */}
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityColor[t.priority] || "bg-gray-100 text-gray-600"}`}>
                      {t.priority || "Medium"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={isOverdue(t.dueDate, t.status) ? "text-red-500 font-medium" : "text-gray-500"}>
                      {new Date(t.dueDate).toLocaleDateString()}
                      {isOverdue(t.dueDate, t.status) && " ⚠️"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {/* Fix 2 — updated status names */}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => { setEditTask(t); setShowModal(true); }}
                            className="text-indigo-600 hover:underline text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(t._id)}
                            className="text-red-500 hover:underline text-xs"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setStatusTask(t)}
                          className="text-indigo-600 hover:underline text-xs"
                        >
                          Update Status
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <TaskModal
          onClose={() => { setShowModal(false); setEditTask(null); }}
          onSave={handleSave}
          projects={projects}
          users={allUsers}
          initial={editTask}
        />
      )}

      {statusTask && (
        <StatusModal
          task={statusTask}
          onClose={() => setStatusTask(null)}
          onSave={handleStatusUpdate}
        />
      )}
    </div>
  );
}

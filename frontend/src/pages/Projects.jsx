import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

// ── Project Form Modal ──────────────────────────────────────────────────────
function ProjectModal({ onClose, onSave, allUsers, initial }) {
  const [form, setForm] = useState(
    initial || { title: "", description: "", members: [] }
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Toggle a member in/out of the list
  const toggleMember = (userId) => {
    const isSelected = form.members.includes(userId);
    setForm({
      ...form,
      members: isSelected
        ? form.members.filter((id) => id !== userId)
        : [...form.members, userId],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">
          {initial ? "Edit Project" : "Create New Project"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Project title"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What is this project about?"
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Members
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg divide-y">
              {allUsers.map((u) => (
                <label
                  key={u._id}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={form.members.includes(u._id)}
                    onChange={() => toggleMember(u._id)}
                    className="accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700">{u.name}</span>
                  <span className="text-xs text-gray-400 capitalize">({u.role})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {initial ? "Save Changes" : "Create Project"}
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

// ── Projects Page ───────────────────────────────────────────────────────────
export default function Projects() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);

  const fetchData = async () => {
    try {
      const [projRes, usersRes] = await Promise.all([
        API.get("/projects"),
        isAdmin ? API.get("/users") : Promise.resolve({ data: [] }),
      ]);
      setProjects(projRes.data);
      setAllUsers(usersRes.data);
    } catch (err) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (form) => {
    try {
      if (editProject) {
        await API.put(`/projects/${editProject._id}`, form);
        toast.success("Project updated!");
      } else {
        await API.post("/projects", form);
        toast.success("Project created!");
      }
      setShowModal(false);
      setEditProject(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      await API.delete(`/projects/${id}`);
      toast.success("Project deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  if (loading) {
    return <div className="text-gray-400 text-center mt-20">Loading projects...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
          <p className="text-sm text-gray-500 mt-1">
            {isAdmin ? "Manage your team projects" : "Projects you're part of"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setEditProject(null); setShowModal(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + New Project
          </button>
        )}
      </div>

      {/* Empty state */}
      {projects.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📁</p>
          <p className="text-lg font-medium">No projects yet</p>
          {isAdmin && (
            <p className="text-sm mt-1">Create your first project to get started!</p>
          )}
        </div>
      ) : (
        /* Projects Table */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Members</th>
                <th className="px-6 py-3 text-left">Created</th>
                {isAdmin && <th className="px-6 py-3 text-left">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{p.title}</td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                    {p.description || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {p.members?.length > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                          {p.members.length} member{p.members.length !== 1 ? "s" : ""}
                        </span>
                      </span>
                    ) : (
                      <span className="text-gray-400">No members</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditProject(p); setShowModal(true); }}
                          className="text-indigo-600 hover:underline text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-red-500 hover:underline text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProjectModal
          onClose={() => { setShowModal(false); setEditProject(null); }}
          onSave={handleSave}
          allUsers={allUsers}
          initial={editProject}
        />
      )}
    </div>
  );
}

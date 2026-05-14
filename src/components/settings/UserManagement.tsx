import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Users, UserPlus, Pencil, Trash2 } from "lucide-react";
import AddUserModal from "../modals/users/AddUserModal";
import type { Doc, Id } from "../../../convex/_generated/dataModel";

interface UserManagementProps {
  userRole: "staff" | "admin" | "super-admin";
}

export default function UserManagement({ userRole }: UserManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Doc<"users"> | null>(null);

  const users = useQuery(api.users.getUsers);
  const deleteUser = useMutation(api.users.deleteUser);

  const canAddUsers = userRole !== "staff";
  const canEditStaff = userRole === "admin" || userRole === "super-admin";
  const canDeleteUsers = userRole === "super-admin";

  const openAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: Doc<"users">) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id: Id<"users">) => {
  if (!canDeleteUsers) return;
  if (!confirm("Delete this user? This action cannot be undone.")) return;

  await deleteUser({ id });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black italic text-white uppercase">User Profiles</h3>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest text-xs">Manage login roles, staff, and permissions</p>
        </div>

        {canAddUsers && (
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            onClick={openAddModal}
          >
            <UserPlus size={16} /> Add User
          </button>
        )}
      </div>

      {!users ? (
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 text-center">
          <Users className="mx-auto text-slate-800 mb-4" size={48} />
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Loading user profiles...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 text-center">
          <Users className="mx-auto text-slate-800 mb-4" size={48} />
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No users have been created yet.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden">
          <table className="min-w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-[0.2em] text-[9px]">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Login Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const canEdit = canEditStaff && (userRole === "super-admin" || user.role === "staff");
                return (
                  <tr key={user._id} className="border-t border-slate-800 hover:bg-slate-950/60 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{user.name}</td>
                    <td className="px-6 py-4 uppercase tracking-[0.2em]">{user.role}</td>
                    <td className="px-6 py-4">{user.role === "staff" ? "PIN" : "Username"}</td>
                    <td className="px-6 py-4">{user.status}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => canEdit ? openEditModal(user) : undefined}
                        disabled={!canEdit}
                        className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-[10px] uppercase font-black transition ${canEdit ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      {canDeleteUsers && (
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white text-[10px] uppercase font-black transition"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUserRole={userRole as "admin" | "super-admin"}
        existingUser={editingUser}
      />
    </div>
  );
}

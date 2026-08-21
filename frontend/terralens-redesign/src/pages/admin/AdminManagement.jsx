import { useEffect, useState } from "react";
import api from "../../api/client";

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Admin
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("employee");
  const [creating, setCreating] = useState(false);

  // Edit Admin
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("employee");
  const [editIsActive, setEditIsActive] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Delete Admin
  const [deletingId, setDeletingId] = useState(null);

  // =====================================================
  // LOAD ADMINS
  // =====================================================

  const loadAdmins = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/admin/users");

      setAdmins(data);
    } catch (error) {
      console.error("Failed to load admins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  // =====================================================
  // ADD ADMIN FORM
  // =====================================================

  const openAddForm = () => {
    setEditingAdmin(null);

    setNewUsername("");
    setNewPassword("");
    setNewRole("employee");

    setShowAddForm(true);
  };

  const closeAddForm = () => {
    setShowAddForm(false);

    setNewUsername("");
    setNewPassword("");
    setNewRole("employee");
  };

  // =====================================================
  // CREATE ADMIN
  // =====================================================

  const createAdmin = async () => {
    if (!newUsername.trim()) {
      alert("Username is required.");
      return;
    }

    if (!newPassword.trim()) {
      alert("Password is required.");
      return;
    }

    try {
      setCreating(true);

      await api.post("/admin/users", {
        username: newUsername.trim(),
        password: newPassword,
        role: newRole,
      });

      alert("Admin created successfully.");

      closeAddForm();

      await loadAdmins();
    } catch (error) {
      console.error("Failed to create admin:", error);

      const message =
        error.response?.data?.detail ||
        "Failed to create admin.";

      alert(message);
    } finally {
      setCreating(false);
    }
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const openEditForm = (admin) => {
    setShowAddForm(false);

    setEditingAdmin(admin);

    setEditUsername(admin.username);
    setEditPassword("");
    setEditRole(admin.role || "employee");
    setEditIsActive(admin.is_active);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // CLOSE EDIT FORM
  // =====================================================

  const closeEditForm = () => {
    setEditingAdmin(null);

    setEditUsername("");
    setEditPassword("");
    setEditRole("employee");
    setEditIsActive(true);
  };

  // =====================================================
  // UPDATE ADMIN
  // =====================================================

  const updateAdmin = async () => {
    if (!editingAdmin) return;

    if (!editUsername.trim()) {
      alert("Username is required.");
      return;
    }

    try {
      setUpdating(true);

      await api.put(
        `/admin/users/${editingAdmin.id}`,
        {
          username: editUsername.trim(),
          password: editPassword,
          role: editRole,
          is_active: editIsActive,
        }
      );

      alert("Admin updated successfully.");

      closeEditForm();

      await loadAdmins();
    } catch (error) {
      console.error("Failed to update admin:", error);

      const message =
        error.response?.data?.detail ||
        "Failed to update admin.";

      alert(message);
    } finally {
      setUpdating(false);
    }
  };

  // =====================================================
  // DELETE ADMIN
  // =====================================================

  const deleteAdmin = async (admin) => {
    if (!admin) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${admin.username}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(admin.id);

      await api.delete(`/admin/users/${admin.id}`);

      alert("Admin deleted successfully.");

      await loadAdmins();
    } catch (error) {
      console.error("Failed to delete admin:", error);

      const message =
        error.response?.data?.detail ||
        "Failed to delete admin.";

      alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admin-management">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="admin-management-header">

        <div>
          <h1>Admin Management</h1>

          <p>
            Manage TerraLens administrator accounts.
          </p>
        </div>

        <button
          type="button"
          className="add-admin-button"
          onClick={openAddForm}
        >
          + Add Admin
        </button>

      </div>


      {/* =================================================
          ADD ADMIN FORM
      ================================================= */}

      {showAddForm && (
        <div className="admin-form-card">

          <div className="admin-form-header">

            <div>
              <h2>Add Administrator</h2>

              <p>
                Create a new TerraLens administrator account.
              </p>
            </div>

            <button
              type="button"
              className="close-form-button"
              onClick={closeAddForm}
              aria-label="Close add administrator form"
            >
              ×
            </button>

          </div>


          {/* Username */}

          <div className="form-field">

            <label htmlFor="new-admin-username">
              Username
            </label>

            <input
              id="new-admin-username"
              type="text"
              placeholder="Enter username"
              value={newUsername}
              onChange={(e) =>
                setNewUsername(e.target.value)
              }
              disabled={creating}
            />

          </div>


          {/* Password */}

          <div className="form-field">

            <label htmlFor="new-admin-password">
              Password
            </label>

            <input
              id="new-admin-password"
              type="password"
              placeholder="Enter password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              disabled={creating}
            />

          </div>


          {/* Role */}

          <div className="form-field">

            <label htmlFor="new-admin-role">
              Role
            </label>

            <select
              id="new-admin-role"
              value={newRole}
              onChange={(e) =>
                setNewRole(e.target.value)
              }
              disabled={creating}
            >
              <option value="employee">
                Employee
              </option>

              <option value="manager">
                Manager
              </option>
            </select>

          </div>


          {/* Form Actions */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={closeAddForm}
              disabled={creating}
            >
              Cancel
            </button>

            <button
              type="button"
              className="primary-action-button"
              onClick={createAdmin}
              disabled={creating}
            >
              {creating
                ? "Creating..."
                : "Create Admin"}
            </button>

          </div>

        </div>
      )}


      {/* =================================================
          EDIT ADMIN FORM
      ================================================= */}

      {editingAdmin && (
        <div className="admin-form-card">

          <div className="admin-form-header">

            <div>
              <h2>Edit Administrator</h2>

              <p>
                Update this administrator account.
              </p>
            </div>

            <button
              type="button"
              className="close-form-button"
              onClick={closeEditForm}
              aria-label="Close edit administrator form"
            >
              ×
            </button>

          </div>


          {/* Username */}

          <div className="form-field">

            <label htmlFor="edit-admin-username">
              Username
            </label>

            <input
              id="edit-admin-username"
              type="text"
              placeholder="Enter username"
              value={editUsername}
              onChange={(e) =>
                setEditUsername(e.target.value)
              }
              disabled={updating}
            />

          </div>


          {/* Password */}

          <div className="form-field">

            <label htmlFor="edit-admin-password">
              New Password
            </label>

            <input
              id="edit-admin-password"
              type="password"
              placeholder="Leave blank to keep current password"
              value={editPassword}
              onChange={(e) =>
                setEditPassword(e.target.value)
              }
              disabled={updating}
            />

          </div>


          {/* Role */}

          <div className="form-field">

            <label htmlFor="edit-admin-role">
              Role
            </label>

            <select
              id="edit-admin-role"
              value={editRole}
              onChange={(e) =>
                setEditRole(e.target.value)
              }
              disabled={updating}
            >
              <option value="employee">
                Employee
              </option>

              <option value="manager">
                Manager
              </option>
            </select>

          </div>


          {/* Status */}

          <div className="form-field">

            <label htmlFor="edit-admin-status">
              Status
            </label>

            <select
              id="edit-admin-status"
              value={editIsActive ? "active" : "disabled"}
              onChange={(e) =>
                setEditIsActive(
                  e.target.value === "active"
                )
              }
              disabled={updating}
            >
              <option value="active">
                Active
              </option>

              <option value="disabled">
                Disabled
              </option>
            </select>

          </div>


          {/* Form Actions */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={closeEditForm}
              disabled={updating}
            >
              Cancel
            </button>

            <button
              type="button"
              className="primary-action-button"
              onClick={updateAdmin}
              disabled={updating}
            >
              {updating
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </div>
      )}


      {/* =================================================
          ADMIN TABLE
      ================================================= */}

      {loading ? (

        <p className="loading-text">
          Loading admins...
        </p>

      ) : (

        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>

              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {admins.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="empty-state"
                  >
                    No administrator accounts found.
                  </td>

                </tr>

              ) : (

                admins.map((admin) => (

                  <tr key={admin.id}>

                    {/* Username */}

                    <td>
                      <span className="username">
                        {admin.username}
                      </span>
                    </td>


                    {/* Role */}

                    <td>

                      <span className="role-badge">
                        {admin.role}
                      </span>

                    </td>


                    {/* Status */}

                    <td>

                      <span
                        className={
                          admin.is_active
                            ? "status-active"
                            : "status-disabled"
                        }
                      >
                        {admin.is_active
                          ? "Active"
                          : "Disabled"}
                      </span>

                    </td>


                    {/* Actions */}

                    <td>

                      <div className="action-buttons">

                        <button
                          type="button"
                          className="edit-button"
                          onClick={() =>
                            openEditForm(admin)
                          }
                          disabled={
                            deletingId === admin.id
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            deleteAdmin(admin)
                          }
                          disabled={
                            deletingId === admin.id
                          }
                        >
                          {deletingId === admin.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      )}


      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`

        /* =================================================
           MAIN
        ================================================= */

        .admin-management {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }


        /* =================================================
           HEADER
        ================================================= */

        .admin-management-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 24px;

          margin-bottom: 32px;
        }


        .admin-management-header h1 {
          margin: 0;

          font-size: 32px;
          line-height: 1.2;

          font-weight: 700;

          color: #0f172a;
        }


        .admin-management-header p {
          margin: 8px 0 0;

          color: #64748b;

          font-size: 15px;
        }


        /* =================================================
           ADD BUTTON
        ================================================= */

        .add-admin-button {
          border: none;

          border-radius: 12px;

          padding: 13px 18px;

          background: #0284c7;
          color: white;

          font-size: 14px;
          font-weight: 600;

          cursor: pointer;

          white-space: nowrap;

          transition:
            background 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }


        .add-admin-button:hover {
          background: #0369a1;

          transform: translateY(-1px);

          box-shadow:
            0 8px 20px rgba(2, 132, 199, 0.2);
        }


        /* =================================================
           FORM CARD
        ================================================= */

        .admin-form-card {
          margin-bottom: 32px;

          padding: 26px;

          background: #ffffff;

          border: 1px solid #e2e8f0;

          border-radius: 16px;

          box-shadow:
            0 8px 30px rgba(15, 23, 42, 0.05);
        }


        .admin-form-header {
          display: flex;

          align-items: flex-start;
          justify-content: space-between;

          gap: 20px;

          margin-bottom: 26px;
        }


        .admin-form-header h2 {
          margin: 0;

          font-size: 21px;

          color: #0f172a;
        }


        .admin-form-header p {
          margin: 6px 0 0;

          color: #64748b;

          font-size: 14px;
        }


        /* =================================================
           CLOSE BUTTON
        ================================================= */

        .close-form-button {
          width: 38px;
          height: 38px;

          flex-shrink: 0;

          border: 1px solid #e2e8f0;

          border-radius: 10px;

          background: white;

          color: #64748b;

          font-size: 24px;

          line-height: 1;

          cursor: pointer;

          display: flex;

          align-items: center;
          justify-content: center;

          transition: 0.2s ease;
        }


        .close-form-button:hover {
          background: #f8fafc;

          color: #0f172a;
        }


        /* =================================================
           FORM FIELDS
        ================================================= */

        .form-field {
          display: flex;

          flex-direction: column;

          gap: 8px;

          margin-bottom: 18px;
        }


        .form-field label {
          color: #334155;

          font-size: 14px;

          font-weight: 600;
        }


        .form-field input,
        .form-field select {
          width: 100%;

          box-sizing: border-box;

          padding: 13px 14px;

          border: 1px solid #cbd5e1;

          border-radius: 10px;

          background: white;

          color: #0f172a;

          font-size: 14px;

          outline: none;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }


        .form-field input:focus,
        .form-field select:focus {
          border-color: #0284c7;

          box-shadow:
            0 0 0 3px rgba(2, 132, 199, 0.1);
        }


        .form-field input:disabled,
        .form-field select:disabled {
          background: #f8fafc;

          cursor: not-allowed;
        }


        /* =================================================
           FORM ACTIONS
        ================================================= */

        .form-actions {
          display: flex;

          justify-content: flex-end;

          gap: 12px;

          margin-top: 26px;
        }


        .cancel-button,
        .primary-action-button {
          border: none;

          border-radius: 10px;

          padding: 11px 18px;

          font-size: 14px;

          font-weight: 600;

          cursor: pointer;

          transition:
            background 0.2s ease,
            opacity 0.2s ease;
        }


        .cancel-button {
          background: #f1f5f9;

          color: #475569;
        }


        .cancel-button:hover {
          background: #e2e8f0;
        }


        .primary-action-button {
          background: #0284c7;

          color: white;
        }


        .primary-action-button:hover {
          background: #0369a1;
        }


        .cancel-button:disabled,
        .primary-action-button:disabled {
          opacity: 0.6;

          cursor: not-allowed;
        }


        /* =================================================
           TABLE
        ================================================= */

        .admin-table-wrapper {
          width: 100%;

          overflow-x: auto;

          background: white;

          border: 1px solid #e2e8f0;

          border-radius: 16px;
        }


        .admin-table {
          width: 100%;

          min-width: 650px;

          border-collapse: collapse;
        }


        .admin-table th,
        .admin-table td {
          padding: 18px 20px;

          text-align: left;

          border-bottom: 1px solid #e2e8f0;
        }


        .admin-table tbody tr:last-child td {
          border-bottom: none;
        }


        .admin-table th {
          color: #64748b;

          font-size: 13px;

          font-weight: 600;
        }


        .admin-table td {
          color: #0f172a;

          font-size: 14px;
        }


        .username {
          font-weight: 600;
        }


        /* =================================================
           BADGES
        ================================================= */

        .role-badge,
        .status-active,
        .status-disabled {
          display: inline-flex;

          align-items: center;

          padding: 5px 10px;

          border-radius: 999px;

          font-size: 12px;

          font-weight: 600;

          text-transform: capitalize;
        }


        .role-badge {
          background: #e0f2fe;

          color: #0369a1;
        }


        .status-active {
          background: #dcfce7;

          color: #166534;
        }


        .status-disabled {
          background: #fee2e2;

          color: #991b1b;
        }


        /* =================================================
           ACTION BUTTONS
        ================================================= */

        .action-buttons {
          display: flex;

          align-items: center;

          gap: 8px;
        }


        .edit-button,
        .delete-button {
          border: none;

          border-radius: 8px;

          padding: 8px 12px;

          font-size: 12px;

          font-weight: 600;

          cursor: pointer;

          transition:
            background 0.2s ease,
            opacity 0.2s ease;
        }


        .edit-button {
          background: #f1f5f9;

          color: #334155;
        }


        .edit-button:hover {
          background: #e2e8f0;
        }


        .delete-button {
          background: #fef2f2;

          color: #dc2626;
        }


        .delete-button:hover {
          background: #fee2e2;
        }


        .edit-button:disabled,
        .delete-button:disabled {
          opacity: 0.6;

          cursor: not-allowed;
        }


        /* =================================================
           LOADING
        ================================================= */

        .loading-text {
          color: #64748b;

          font-size: 14px;
        }


        /* =================================================
           EMPTY STATE
        ================================================= */

        .empty-state {
          padding: 40px !important;

          text-align: center !important;

          color: #64748b !important;
        }


        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 640px) {

          .admin-management-header {
            flex-direction: column;

            margin-bottom: 24px;
          }


          .admin-management-header h1 {
            font-size: 26px;
          }


          .admin-management-header p {
            font-size: 14px;
          }


          .add-admin-button {
            width: 100%;
          }


          .admin-form-card {
            padding: 18px;

            border-radius: 14px;
          }


          .admin-form-header {
            gap: 12px;
          }


          .admin-form-header h2 {
            font-size: 19px;
          }


          .form-actions {
            flex-direction: column-reverse;
          }


          .cancel-button,
          .primary-action-button {
            width: 100%;
          }


          .admin-table-wrapper {
            border-radius: 12px;
          }


          .admin-table {
            min-width: 600px;
          }


          .admin-table th,
          .admin-table td {
            padding: 14px 16px;
          }


          .action-buttons {
            flex-wrap: wrap;
          }

        }

      `}</style>

    </div>
  );
}
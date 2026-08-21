import { useEffect, useState } from "react";
import api from "../../api/client";

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAdmins = async () => {
    try {
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

  return (
    <div className="admin-management">
      <div className="admin-management-header">
        <div>
          <h1>Admin Management</h1>
          <p>Manage TerraLens administrator accounts.</p>
        </div>

        <button className="add-admin-button">
          + Add Admin
        </button>
      </div>

      {loading ? (
        <p>Loading admins...</p>
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
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.username}</td>

                  <td>
                    <span className="role-badge">
                      {admin.role}
                    </span>
                  </td>

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

                  <td>
                    <button>Edit</button>
                    <button>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .admin-management {
          width: 100%;
        }

        .admin-management-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 32px;
        }

        .admin-management-header h1 {
          margin: 0;
          font-size: 32px;
          color: #0f172a;
        }

        .admin-management-header p {
          margin: 8px 0 0;
          color: #64748b;
        }

        .add-admin-button {
          border: none;
          border-radius: 12px;
          padding: 13px 18px;
          background: #0284c7;
          color: white;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

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

        .admin-table th {
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
        }

        .admin-table td {
          color: #0f172a;
        }

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

        @media (max-width: 640px) {
          .admin-management-header {
            flex-direction: column;
          }

          .admin-management-header h1 {
            font-size: 26px;
          }

          .add-admin-button {
            width: 100%;
          }

          .admin-table-wrapper {
            border-radius: 12px;
          }

          .admin-table th,
          .admin-table td {
            padding: 14px 16px;
          }
        }
      `}</style>
    </div>
  );
}
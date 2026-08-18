import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  Trash2,
  User,
  MessageSquare,
} from "lucide-react";
import {
  getContacts,
  deleteContact,
} from "../../api/contact";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const loadContacts = async () => {
    try {
      setLoading(true);

      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      console.error(
        "Failed to load contacts:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) return;

    try {
      setDeleting(id);

      await deleteContact(id);

      setContacts((current) =>
        current.filter(
          (contact) => contact.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete contact:",
        error
      );

      alert("Failed to delete message.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      {/* Header */}

      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            color: "#0f172a",
            fontSize: "2rem",
            fontWeight: "700",
            margin: 0,
            letterSpacing: "-0.025em",
          }}
        >
          Contacts
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "8px",
            marginBottom: 0,
            fontSize: "1rem",
          }}
        >
          Manage messages submitted through the website.
        </p>
      </div>

      {/* Loading */}

      {loading && (
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            padding: "48px",
            textAlign: "center",
            color: "#64748b",
            boxShadow:
              "0 8px 30px rgba(15,23,42,0.05)",
          }}
        >
          Loading messages...
        </div>
      )}

      {/* Empty */}

      {!loading && contacts.length === 0 && (
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            padding: "64px 32px",
            textAlign: "center",
            boxShadow:
              "0 8px 30px rgba(15,23,42,0.05)",
          }}
        >
          <MessageSquare
            size={42}
            style={{
              color: "#0ea5e9",
              marginBottom: "20px",
            }}
          />

          <h2
            style={{
              color: "#0f172a",
              margin: 0,
              fontSize: "1.4rem",
              fontWeight: "700",
            }}
          >
            No Messages Yet
          </h2>

          <p
            style={{
              color: "#64748b",
              marginTop: "10px",
              marginBottom: 0,
            }}
          >
            Messages submitted through the Contact page
            will appear here.
          </p>
        </div>
      )}

      {/* Contacts */}

      {!loading && contacts.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {contacts.map((contact) => (
            <div
              key={contact.id}
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                padding: "28px",
                boxShadow:
                  "0 8px 30px rgba(15,23,42,0.05)",
                boxSizing: "border-box",
              }}
            >
              {/* Top */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2
                    style={{
                      color: "#0f172a",
                      margin: 0,
                      fontSize: "1.3rem",
                      fontWeight: "700",
                    }}
                  >
                    {contact.subject || "No Subject"}
                  </h2>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "18px",
                      marginTop: "14px",
                    }}
                  >
                    {/* Name */}

                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                        color: "#475569",
                      }}
                    >
                      <User
                        size={16}
                        color="#0ea5e9"
                      />
                      {contact.name}
                    </span>

                    {/* Email */}

                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                        color: "#475569",
                      }}
                    >
                      <Mail
                        size={16}
                        color="#0ea5e9"
                      />
                      {contact.email}
                    </span>

                    {/* Phone */}

                    {contact.phone && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                          color: "#475569",
                        }}
                      >
                        <Phone
                          size={16}
                          color="#0ea5e9"
                        />
                        {contact.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete */}

                <button
                  onClick={() =>
                    handleDelete(contact.id)
                  }
                  disabled={
                    deleting === contact.id
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "42px",
                    height: "42px",
                    flexShrink: 0,
                    borderRadius: "10px",
                    border: "1px solid #fecaca",
                    background: "#fef2f2",
                    color: "#dc2626",
                    cursor:
                      deleting === contact.id
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      deleting === contact.id
                        ? 0.5
                        : 1,
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Message */}

              <div
                style={{
                  marginTop: "24px",
                  paddingTop: "22px",
                  borderTop:
                    "1px solid #e2e8f0",
                }}
              >
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    margin: 0,
                    fontWeight: "600",
                  }}
                >
                  Message
                </p>

                <p
                  style={{
                    color: "#475569",
                    lineHeight: "1.7",
                    marginTop: "10px",
                    marginBottom: 0,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {contact.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { cormorant, inter } from "@/components/ui/fonts";

interface Registration {
  id: string;
  created_at: string;
  full_name: string;
  date_of_birth: string;
  mobile_number: string;
  email: string;
  city_suburb: string;
  state: string;
  country: string;
  dietary_requirements: string;
  dietary_other?: string;
  medical_conditions: string;
  medical_details?: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
  vocation_status?: string;
  is_catholic?: string;
  parish?: string;
  first_ymg_event?: string;
  how_heard?: string;
  how_heard_other?: string;
  confirms_18_or_older: boolean;
  agrees_to_code_of_conduct: boolean;
  photo_consent: boolean;
  marketing_consent: boolean;
  registration_type: string;
  amount_paid: number;
  paid: boolean;
  discount_code?: string;
}

const ADMIN_PASSWORD = "iloveJesus123";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [markingPaidId, setMarkingPaidId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
      // Store in session storage so refresh doesn't log out
      sessionStorage.setItem("adminAuth", "true");
    } else {
      setPasswordError("Incorrect password");
    }
  };

  useEffect(() => {
    // Check if already authenticated this session
    if (sessionStorage.getItem("adminAuth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
    }
  }, [isAuthenticated]);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/registrations");
      if (!response.ok) {
        throw new Error("Failed to fetch registrations");
      }
      const data = await response.json();
      setRegistrations(data.registrations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatVocation = (vocation?: string) => {
    if (!vocation) return "N/A";
    return vocation.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleMarkAsPaid = async (reg: Registration) => {
    if (reg.paid) return;
    setMarkingPaidId(reg.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/registrations/${reg.id}`, {
        method: "PATCH",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update");
      }
      setRegistrations((prev) =>
        prev.map((r) => (r.id === reg.id ? { ...r, paid: true } : r))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setMarkingPaidId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card p-8 w-full max-w-md">
          <h1 className={`${cormorant.className} text-3xl font-bold text-[var(--foreground)] mb-6 text-center`}>
            Admin Access
          </h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className={`${inter.className} block text-[var(--foreground)] font-medium mb-2`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-subtle)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                placeholder="Enter admin password"
              />
              {passwordError && (
                <p className={`${inter.className} text-red-400 text-sm mt-2`}>{passwordError}</p>
              )}
            </div>
            <button type="submit" className="btn-primary w-full py-3">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`${cormorant.className} text-4xl font-bold text-[var(--foreground)]`}>
              Registrations
            </h1>
            <p className={`${inter.className} text-[var(--foreground-muted)] mt-2`}>
              {registrations.length} total registrations • {registrations.filter(r => r.paid).length} paid
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={fetchRegistrations}
              className="px-4 py-2 bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)] text-[var(--accent-primary)] rounded-lg hover:bg-[var(--accent-primary)]/30 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("adminAuth");
                setIsAuthenticated(false);
              }}
              className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="card p-4 mb-8 border-red-500 border bg-red-500/10">
            <p className={`${inter.className} text-red-400`}>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className={`${inter.className} text-[var(--foreground-muted)]`}>Loading registrations...</p>
          </div>
        )}

        {/* Table */}
        {!loading && registrations.length > 0 && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--background-secondary)]">
                    <th className={`${inter.className} text-left px-4 py-3 text-[var(--foreground)] font-semibold text-sm`}>Name</th>
                    <th className={`${inter.className} text-left px-4 py-3 text-[var(--foreground)] font-semibold text-sm`}>Email</th>
                    <th className={`${inter.className} text-left px-4 py-3 text-[var(--foreground)] font-semibold text-sm`}>Location</th>
                    <th className={`${inter.className} text-left px-4 py-3 text-[var(--foreground)] font-semibold text-sm`}>Type</th>
                    <th className={`${inter.className} text-left px-4 py-3 text-[var(--foreground)] font-semibold text-sm`}>Amount</th>
                    <th className={`${inter.className} text-left px-4 py-3 text-[var(--foreground)] font-semibold text-sm`}>Paid</th>
                    <th className={`${inter.className} text-left px-4 py-3 text-[var(--foreground)] font-semibold text-sm`}>Registered</th>
                    <th className={`${inter.className} text-left px-4 py-3 text-[var(--foreground)] font-semibold text-sm`}></th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <>
                      <tr 
                        key={reg.id} 
                        className="border-b border-[var(--border-subtle)] hover:bg-[var(--background-secondary)]/50 transition-colors"
                      >
                        <td className={`${inter.className} px-4 py-3 text-[var(--foreground)]`}>{reg.full_name}</td>
                        <td className={`${inter.className} px-4 py-3 text-[var(--foreground-muted)] text-sm`}>{reg.email}</td>
                        <td className={`${inter.className} px-4 py-3 text-[var(--foreground-muted)] text-sm`}>
                          {reg.city_suburb}, {reg.state}
                        </td>
                        <td className={`${inter.className} px-4 py-3 text-sm`}>
                          <span className={`px-2 py-1 rounded text-xs ${
                            reg.registration_type === "early_bird" 
                              ? "bg-green-500/20 text-green-400" 
                              : reg.discount_code 
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-blue-500/20 text-blue-400"
                          }`}>
                            {reg.discount_code || (reg.registration_type === "early_bird" ? "Early Bird" : "Standard")}
                          </span>
                        </td>
                        <td className={`${inter.className} px-4 py-3 text-[var(--foreground)]`}>${reg.amount_paid}</td>
                        <td className={`${inter.className} px-4 py-3`}>
                          <span className={`px-2 py-1 rounded text-xs ${
                            reg.paid 
                              ? "bg-green-500/20 text-green-400" 
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {reg.paid ? "Paid" : "Pending"}
                          </span>
                        </td>
                        <td className={`${inter.className} px-4 py-3 text-[var(--foreground-muted)] text-sm`}>
                          {formatDate(reg.created_at)}
                        </td>
                        <td className={`${inter.className} px-4 py-3`}>
                          <button
                            onClick={() => setExpandedRow(expandedRow === reg.id ? null : reg.id)}
                            className="text-[var(--accent-primary)] hover:underline text-sm"
                          >
                            {expandedRow === reg.id ? "Hide" : "Details"}
                          </button>
                        </td>
                      </tr>
                      {expandedRow === reg.id && (
                        <tr key={`${reg.id}-details`} className="bg-[var(--background-secondary)]/30">
                          <td colSpan={8} className="px-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Personal Info */}
                              <div>
                                <h4 className={`${inter.className} font-semibold text-[var(--foreground)] mb-2`}>Personal Info</h4>
                                <div className={`${inter.className} text-sm space-y-1 text-[var(--foreground-muted)]`}>
                                  <p><span className="text-[var(--foreground)]">DOB:</span> {reg.date_of_birth}</p>
                                  <p><span className="text-[var(--foreground)]">Mobile:</span> {reg.mobile_number}</p>
                                  <p><span className="text-[var(--foreground)]">Country:</span> {reg.country}</p>
                                </div>
                              </div>

                              {/* Dietary & Medical */}
                              <div>
                                <h4 className={`${inter.className} font-semibold text-[var(--foreground)] mb-2`}>Dietary & Medical</h4>
                                <div className={`${inter.className} text-sm space-y-1 text-[var(--foreground-muted)]`}>
                                  <p><span className="text-[var(--foreground)]">Dietary:</span> {reg.dietary_requirements}{reg.dietary_other ? ` (${reg.dietary_other})` : ""}</p>
                                  <p><span className="text-[var(--foreground)]">Medical:</span> {reg.medical_conditions}{reg.medical_details ? ` - ${reg.medical_details}` : ""}</p>
                                </div>
                              </div>

                              {/* Emergency Contact */}
                              <div>
                                <h4 className={`${inter.className} font-semibold text-[var(--foreground)] mb-2`}>Emergency Contact</h4>
                                <div className={`${inter.className} text-sm space-y-1 text-[var(--foreground-muted)]`}>
                                  <p><span className="text-[var(--foreground)]">Name:</span> {reg.emergency_contact_name}</p>
                                  <p><span className="text-[var(--foreground)]">Relationship:</span> {reg.emergency_contact_relationship}</p>
                                  <p><span className="text-[var(--foreground)]">Phone:</span> {reg.emergency_contact_phone}</p>
                                </div>
                              </div>

                              {/* Faith & Background */}
                              <div>
                                <h4 className={`${inter.className} font-semibold text-[var(--foreground)] mb-2`}>Faith & Background</h4>
                                <div className={`${inter.className} text-sm space-y-1 text-[var(--foreground-muted)]`}>
                                  <p><span className="text-[var(--foreground)]">Vocation:</span> {formatVocation(reg.vocation_status)}</p>
                                  <p><span className="text-[var(--foreground)]">Catholic:</span> {reg.is_catholic || "N/A"}</p>
                                  <p><span className="text-[var(--foreground)]">Parish:</span> {reg.parish || "N/A"}</p>
                                  <p><span className="text-[var(--foreground)]">First YMG:</span> {reg.first_ymg_event || "N/A"}</p>
                                  <p><span className="text-[var(--foreground)]">How Heard:</span> {reg.how_heard || "N/A"}{reg.how_heard_other ? ` (${reg.how_heard_other})` : ""}</p>
                                </div>
                              </div>

                              {/* Consent */}
                              <div>
                                <h4 className={`${inter.className} font-semibold text-[var(--foreground)] mb-2`}>Consent</h4>
                                <div className={`${inter.className} text-sm space-y-1 text-[var(--foreground-muted)]`}>
                                  <p><span className="text-[var(--foreground)]">18+ Confirmed:</span> {reg.confirms_18_or_older ? "Yes" : "No"}</p>
                                  <p><span className="text-[var(--foreground)]">Code of Conduct:</span> {reg.agrees_to_code_of_conduct ? "Yes" : "No"}</p>
                                  <p><span className="text-[var(--foreground)]">Photo Consent:</span> {reg.photo_consent ? "Yes" : "No"}</p>
                                  <p><span className="text-[var(--foreground)]">Marketing:</span> {reg.marketing_consent ? "Yes" : "No"}</p>
                                </div>
                              </div>

                              {/* Registration Details */}
                              <div>
                                <h4 className={`${inter.className} font-semibold text-[var(--foreground)] mb-2`}>Registration</h4>
                                <div className={`${inter.className} text-sm space-y-1 text-[var(--foreground-muted)]`}>
                                  <p><span className="text-[var(--foreground)]">ID:</span> {reg.id}</p>
                                  <p><span className="text-[var(--foreground)]">Discount:</span> {reg.discount_code || "None"}</p>
                                  <p><span className="text-[var(--foreground)]">Paid:</span> {reg.paid ? "Yes" : "Pending"}</p>
                                  {!reg.paid && (
                                    <button
                                      type="button"
                                      onClick={() => handleMarkAsPaid(reg)}
                                      disabled={markingPaidId === reg.id}
                                      className="mt-3 px-4 py-2 bg-green-500/20 border border-green-500 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                    >
                                      {markingPaidId === reg.id ? "Updating..." : "Mark as Paid"}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && registrations.length === 0 && !error && (
          <div className="text-center py-12">
            <p className={`${inter.className} text-[var(--foreground-muted)]`}>No registrations yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cormorant, inter } from "@/components/ui/fonts";
import { POWER_TALK_LABELS, POWER_TALKS, getPowerTalkLimit, type PowerTalkId } from "@/lib/powerTalks";
import type { Registration } from "@/lib/supabase";

const ADMIN_PASSWORD = "iloveJesus123";

type PowerRegistration = Pick<Registration, "id" | "full_name" | "power_talk">;

export default function PowerAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [registrations, setRegistrations] = useState<PowerRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedRegistrationId, setExpandedRegistrationId] = useState<string | null>(null);
  const [selectedTalkByRegistration, setSelectedTalkByRegistration] = useState<Record<string, PowerTalkId | undefined>>({});
  const [savingRegistrationId, setSavingRegistrationId] = useState<string | null>(null);
  const [nameSearch, setNameSearch] = useState("");

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
      sessionStorage.setItem("adminAuth", "true");
    } else {
      setPasswordError("Incorrect password");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/power/registrations");

      if (!response.ok) {
        throw new Error("Failed to fetch power registrations");
      }

      const data = await response.json();
      setRegistrations(data.registrations || []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
    }
  }, [isAuthenticated]);

  const talkCounts = useMemo(() => {
    return POWER_TALKS.reduce<Record<PowerTalkId, number>>((accumulator, talk) => {
      accumulator[talk.id] = registrations.filter((registration) => registration.power_talk === talk.id).length;
      return accumulator;
    }, {
      talk_1: 0,
      talk_2: 0,
      talk_3: 0,
      talk_4: 0,
    });
  }, [registrations]);

  const unassignedRegistrations = useMemo(
    () => registrations.filter((registration) => !registration.power_talk),
    [registrations]
  );

  const visibleRegistrations = useMemo(() => {
    const search = nameSearch.trim().toLowerCase();

    if (!search) {
      return unassignedRegistrations;
    }

    return unassignedRegistrations.filter((registration) =>
      registration.full_name.toLowerCase().includes(search)
    );
  }, [nameSearch, unassignedRegistrations]);

  const handleAssignTalk = async (registrationId: string) => {
    const selectedTalk = selectedTalkByRegistration[registrationId];

    if (!selectedTalk) {
      setError("Please choose a talk before submitting");
      return;
    }

    setSavingRegistrationId(registrationId);
    setError("");

    try {
      const response = await fetch(`/api/admin/power/registrations/${registrationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ powerTalk: selectedTalk }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to assign talk");
      }

      setRegistrations((current) => current.filter((registration) => registration.id !== registrationId));
      setSelectedTalkByRegistration((current) => {
        const next = { ...current };
        delete next[registrationId];
        return next;
      });
      setExpandedRegistrationId(null);
    } catch (assignError) {
      setError(assignError instanceof Error ? assignError.message : "Something went wrong");
    } finally {
      setSavingRegistrationId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card p-8 w-full max-w-md">
          <h1 className={`${cormorant.className} text-3xl font-bold text-[var(--foreground)] mb-6 text-center`}>
            Power Admin Access
          </h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className={`${inter.className} block text-[var(--foreground)] font-medium mb-2`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
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
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
          <div>
            <div className="flex flex-wrap gap-3 mb-4">
              <Link href="/admin/power/allocated" className="px-4 py-2 rounded-lg border border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20 transition-colors">
                View allocations
              </Link>
              <button
                type="button"
                onClick={fetchRegistrations}
                className="px-4 py-2 rounded-lg border border-[var(--border-subtle)] text-[var(--foreground)] bg-[var(--background-secondary)] hover:border-[var(--accent-primary)] transition-colors"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={() => {
                  sessionStorage.removeItem("adminAuth");
                  setIsAuthenticated(false);
                }}
                className="px-4 py-2 rounded-lg border border-red-500 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
              >
                Logout
              </button>
            </div>
            <h1 className={`${cormorant.className} text-4xl font-bold text-[var(--foreground)]`}>
              Power talk allocation
            </h1>
            <p className={`${inter.className} text-[var(--foreground-muted)] mt-2`}>
              {unassignedRegistrations.length} waiting, {registrations.length - unassignedRegistrations.length} allocated.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto md:min-w-[360px]">
            {POWER_TALKS.map((talk) => (
              <div key={talk.id} className="card p-4">
                <div className={`${inter.className} text-xs uppercase tracking-wide text-[var(--foreground-muted)]`}>
                  {POWER_TALK_LABELS[talk.id]}
                </div>
                <div className={`${cormorant.className} text-2xl font-bold text-[var(--foreground)] mt-1`}>
                  {talkCounts[talk.id]}/{getPowerTalkLimit(talk.id)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4 mb-6">
          <label className={`${inter.className} block text-sm font-medium text-[var(--foreground)] mb-2`}>
            Search names
          </label>
          <input
            type="text"
            value={nameSearch}
            onChange={(event) => setNameSearch(event.target.value)}
            placeholder="Type a name to filter the waiting list"
            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-subtle)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
          />
        </div>

        {error && (
          <div className="card p-4 mb-6 border border-red-500 bg-red-500/10">
            <p className={`${inter.className} text-red-400`}>{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <p className={`${inter.className} text-[var(--foreground-muted)]`}>Loading registrations...</p>
          </div>
        )}

        {!loading && visibleRegistrations.length > 0 && (
          <div className="space-y-4">
            {visibleRegistrations.map((registration) => {
              const expanded = expandedRegistrationId === registration.id;

              return (
                <div key={registration.id} className="card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedRegistrationId(expanded ? null : registration.id || null)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--background-secondary)]/50 transition-colors"
                  >
                    <span className={`${cormorant.className} text-2xl text-[var(--foreground)]`}>
                      {registration.full_name}
                    </span>
                    <span className={`${inter.className} text-sm text-[var(--foreground-muted)]`}>
                      {expanded ? "Hide options" : "Choose talk"}
                    </span>
                  </button>

                  {expanded && (
                    <div className="px-5 pb-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {POWER_TALKS.map((talk) => {
                          const limit = getPowerTalkLimit(talk.id);
                          const isFull = talkCounts[talk.id] >= limit;
                          const isSelected = selectedTalkByRegistration[registration.id || ""] === talk.id;

                          return (
                            <button
                              key={talk.id}
                              type="button"
                              disabled={isFull}
                              onClick={() => {
                                if (!registration.id || isFull) return;
                                setSelectedTalkByRegistration((current) => ({
                                  ...current,
                                  [registration.id as string]: talk.id,
                                }));
                              }}
                              className={`relative flex flex-col items-center justify-center rounded-full border px-4 py-8 transition-all ${
                                isSelected
                                  ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/20"
                                  : isFull
                                    ? "border-[var(--border-subtle)] bg-[var(--background-secondary)] opacity-60 cursor-not-allowed"
                                    : "border-[var(--border-subtle)] bg-[var(--background)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10"
                              }`}
                            >
                              <span className={`${inter.className} text-sm font-semibold text-[var(--foreground)]`}>
                                {POWER_TALK_LABELS[talk.id]}
                              </span>
                              <span className={`${inter.className} text-xs text-[var(--foreground-muted)] mt-2`}>
                                {talkCounts[talk.id]}/{limit} spots
                              </span>
                              {isFull && (
                                <span className={`${inter.className} absolute inset-0 flex items-center justify-center text-sm font-bold tracking-widest text-[var(--foreground-muted)]`}>
                                  FULL
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
                        <p className={`${inter.className} text-sm text-[var(--foreground-muted)]`}>
                          Selected: {selectedTalkByRegistration[registration.id || ""] ? POWER_TALK_LABELS[selectedTalkByRegistration[registration.id as string] as PowerTalkId] : "None"}
                        </p>
                        <button
                          type="button"
                          onClick={() => registration.id && handleAssignTalk(registration.id)}
                          disabled={!registration.id || !selectedTalkByRegistration[registration.id || ""] || savingRegistrationId === registration.id}
                          className="px-5 py-3 rounded-lg bg-[var(--accent-primary)] text-[var(--background)] font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {savingRegistrationId === registration.id ? "Submitting..." : "Submit"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loading && unassignedRegistrations.length === 0 && !error && (
          <div className="text-center py-16 card">
            <p className={`${inter.className} text-[var(--foreground-muted)]`}>
              Everyone currently has a talk allocated.
            </p>
          </div>
        )}
        {!loading && unassignedRegistrations.length > 0 && visibleRegistrations.length === 0 && !error && (
          <div className="text-center py-16 card">
            <p className={`${inter.className} text-[var(--foreground-muted)]`}>
              No waiting registrations match that search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
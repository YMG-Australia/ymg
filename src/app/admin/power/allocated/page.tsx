"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cormorant, inter } from "@/components/ui/fonts";
import { POWER_TALK_LABELS, POWER_TALK_LIMIT, POWER_TALKS, type PowerTalkId } from "@/lib/powerTalks";
import type { Registration } from "@/lib/supabase";

const ADMIN_PASSWORD = "iloveJesus123";

type PowerRegistration = Pick<Registration, "id" | "full_name" | "power_talk">;

export default function PowerAllocatedPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [registrations, setRegistrations] = useState<PowerRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [undoingRegistrationId, setUndoingRegistrationId] = useState<string | null>(null);
  const [nameSearch, setNameSearch] = useState("");
  const [showAllocationText, setShowAllocationText] = useState(false);

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

  const allocatedByTalk = useMemo(() => {
    return POWER_TALKS.reduce<Record<PowerTalkId, PowerRegistration[]>>((accumulator, talk) => {
      accumulator[talk.id] = registrations
        .filter((registration) => registration.power_talk === talk.id)
        .sort((left, right) => left.full_name.localeCompare(right.full_name));
      return accumulator;
    }, {
      talk_1: [],
      talk_2: [],
      talk_3: [],
      talk_4: [],
    });
  }, [registrations]);

  const visibleAllocatedByTalk = useMemo(() => {
    const search = nameSearch.trim().toLowerCase();

    if (!search) {
      return allocatedByTalk;
    }

    return POWER_TALKS.reduce<Record<PowerTalkId, PowerRegistration[]>>((accumulator, talk) => {
      accumulator[talk.id] = allocatedByTalk[talk.id].filter((registration) =>
        registration.full_name.toLowerCase().includes(search)
      );
      return accumulator;
    }, {
      talk_1: [],
      talk_2: [],
      talk_3: [],
      talk_4: [],
    });
  }, [allocatedByTalk, nameSearch]);

  const handleUndo = async (registrationId: string) => {
    setUndoingRegistrationId(registrationId);
    setError("");

    try {
      const response = await fetch(`/api/admin/power/registrations/${registrationId}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to undo talk assignment");
      }

      setRegistrations((current) => current.map((registration) => (
        registration.id === registrationId
          ? { ...registration, power_talk: null }
          : registration
      )));
    } catch (undoError) {
      setError(undoError instanceof Error ? undoError.message : "Something went wrong");
    } finally {
      setUndoingRegistrationId(null);
    }
  };

  const totalAllocated = registrations.filter((registration) => registration.power_talk).length;

  const allocationText = useMemo(() => {
    return POWER_TALKS.map((talk) => {
      const people = allocatedByTalk[talk.id].map((registration) => registration.full_name);
      const lines = [
        `${POWER_TALK_LABELS[talk.id]} (${people.length})`,
        ...(people.length > 0 ? people.map((person) => `- ${person}`) : ["- None"]),
      ];

      return lines.join("\n");
    }).join("\n\n");
  }, [allocatedByTalk]);

  const copyAllocationText = async () => {
    try {
      await navigator.clipboard.writeText(allocationText);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = allocationText;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card p-8 w-full max-w-md">
          <h1 className={`${cormorant.className} text-3xl font-bold text-[var(--foreground)] mb-6 text-center`}>
            Power Allocations Access
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
              <Link href="/admin/power" className="px-4 py-2 rounded-lg border border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20 transition-colors">
                Back to waiting list
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
              Allocated people
            </h1>
            <p className={`${inter.className} text-[var(--foreground-muted)] mt-2`}>
              {totalAllocated} people allocated, {registrations.length - totalAllocated} waiting.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto md:min-w-[360px]">
            {POWER_TALKS.map((talk) => {
              const count = allocatedByTalk[talk.id].length;

              return (
                <div key={talk.id} className="card p-4">
                  <div className={`${inter.className} text-xs uppercase tracking-wide text-[var(--foreground-muted)]`}>
                    {POWER_TALK_LABELS[talk.id]}
                  </div>
                  <div className={`${cormorant.className} text-2xl font-bold text-[var(--foreground)] mt-1`}>
                    {count}/{POWER_TALK_LIMIT}
                  </div>
                </div>
              );
            })}
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
            placeholder="Type a name to filter allocated people"
            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-subtle)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
          />
        </div>

        <div className="card p-4 mb-6">
          <button
            type="button"
            onClick={() => setShowAllocationText((current) => !current)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--background-secondary)] hover:border-[var(--accent-primary)] transition-colors"
          >
            <span className={`${inter.className} font-medium text-[var(--foreground)]`}>
              {showAllocationText ? "Hide copyable allocation text" : "Show copyable allocation text"}
            </span>
            <span className={`${inter.className} text-sm text-[var(--foreground-muted)]`}>
              {showAllocationText ? "Open" : "Closed"}
            </span>
          </button>

          {showAllocationText && (
            <div className="mt-4 space-y-3">
              <p className={`${inter.className} text-sm text-[var(--foreground-muted)]`}>
                Copy this plain text into a message, spreadsheet, or document.
              </p>
              <textarea
                readOnly
                value={allocationText}
                className="w-full min-h-72 px-4 py-3 bg-[var(--background)] border border-[var(--border-subtle)] rounded-lg text-[var(--foreground)] font-mono text-sm whitespace-pre-wrap focus:outline-none"
              />
              <button
                type="button"
                onClick={copyAllocationText}
                className="px-4 py-2 rounded-lg border border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20 transition-colors"
              >
                Copy text
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="card p-4 mb-6 border border-red-500 bg-red-500/10">
            <p className={`${inter.className} text-red-400`}>{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <p className={`${inter.className} text-[var(--foreground-muted)]`}>Loading allocations...</p>
          </div>
        )}

        {!loading && (
          <div className="space-y-6">
            {POWER_TALKS.map((talk) => (
              <div key={talk.id} className="card p-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className={`${cormorant.className} text-3xl font-bold text-[var(--foreground)]`}>
                      {POWER_TALK_LABELS[talk.id]}
                    </h2>
                    <p className={`${inter.className} text-[var(--foreground-muted)] text-sm`}>
                      {allocatedByTalk[talk.id].length}/{POWER_TALK_LIMIT} allocated
                    </p>
                  </div>
                </div>

                {visibleAllocatedByTalk[talk.id].length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {visibleAllocatedByTalk[talk.id].map((registration) => (
                      <div
                        key={registration.id}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-secondary)]/50 px-4 py-4"
                      >
                        <span className={`${inter.className} text-[var(--foreground)] font-medium`}>
                          {registration.full_name}
                        </span>
                        <button
                          type="button"
                          onClick={() => registration.id && handleUndo(registration.id)}
                          disabled={undoingRegistrationId === registration.id}
                          className="px-3 py-2 rounded-lg border border-yellow-500 text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {undoingRegistrationId === registration.id ? "Undoing..." : "Undo"}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`${inter.className} text-[var(--foreground-muted)]`}>
                    {nameSearch.trim() ? "No allocated names match that search." : "No one allocated yet."}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
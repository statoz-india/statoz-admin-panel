"use client";

import { useEffect, useState } from "react";
import { Waitlist } from "../api/waitlist/route";

export default function WaitlistSection() {
  const [waitlist, setWaitlist] = useState<Waitlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWaitlist = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/waitlist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch waitlist");
      }

      const response = await res.json();
      const data =
        response.success && response.data.data ? response.data.data : [];
      setWaitlist(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load waitlist");
      setWaitlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p className="text-gray-400">Loading waitlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Waitlist</h2>
      </div>

      {waitlist.length === 0 ? (
        <div className="p-4 bg-zinc-800 rounded-lg">
          <p className="text-gray-400">No waitlist entries yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-zinc-700">
            <thead>
              <tr className="bg-zinc-800">
                <th className="border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white">
                  Email
                </th>
                <th className="border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white">
                  Type
                </th>
                <th className="border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white">
                  Submission Time
                </th>
              </tr>
            </thead>
            <tbody>
              {waitlist.map((entry) => (
                <tr
                  key={entry._id}
                  className="hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="border border-zinc-700 px-4 py-3 text-gray-300">
                    {entry.email}
                  </td>
                  <td className="border border-zinc-700 px-4 py-3 text-gray-300">
                    {entry.type}
                  </td>
                  <td className="border border-zinc-700 px-4 py-3 text-gray-300">
                    {entry.submissionTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

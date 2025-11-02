import React, { useEffect, useState } from "react";
import { Bell, Calendar, Users } from "lucide-react";
import API_CONFIG from "../../config/api"; // ✅ Your existing config file

export const ActivityPanel = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE}/activity/`);
        const data = await response.json();
        if (data.success) {
          setActivities(data.activities);
        } else {
          console.error("❌ Failed to fetch activities");
        }
      } catch (err) {
        console.error("❌ Error fetching activities:", err);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="flex h-full bg-[#0B0B0B] text-gray-200">
      {/* Left Sidebar (Activity List) */}
      <div className="w-80 border-r border-[#1f1f1f] flex flex-col">
        <div className="p-4 text-lg font-semibold border-b border-[#1f1f1f]">
          Activity
        </div>

        <div className="flex-1 overflow-y-auto">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-[#1a1a1a] cursor-pointer transition"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-sm font-semibold">
                    {activity.title?.[0]?.toUpperCase() || "A"}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{activity.title}</div>
                  <div className="text-xs text-gray-400 line-clamp-1">
                    {activity.description}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{activity.context || "General"}</span>
                    <span>
                      {new Date(activity.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              No recent activity
            </div>
          )}
        </div>
      </div>

      {/* Right Content Placeholder */}
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <Bell size={48} className="mx-auto mb-3 text-gray-500" />
          <p className="text-lg font-semibold">Select an activity to view details</p>
          <p className="text-sm text-gray-500 mt-1">
            Activities like invites, replies, or reactions will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

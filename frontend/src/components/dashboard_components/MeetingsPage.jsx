import React from "react";
import { MeetingActionCard } from "../dashboard_components/MeetingActionCard";
import { Link2, Calendar, Hash, CalendarDays } from "lucide-react";

const MeetingsPage = () => {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-6 text-gray-100">Meet</h1>

      {/* Meeting Actions */}
      <div className="flex flex-wrap gap-4 mb-10 justify-center sm:justify-start">
        <MeetingActionCard
          icon={Link2}
          title="Create a meeting link"
          variant="primary"
        />
        <MeetingActionCard icon={Calendar} title="Schedule a meeting" />
        <MeetingActionCard icon={Hash} title="Join with a meeting ID" />
      </div>

      {/* Meeting Links */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">
          Meeting links
        </h2>
        <div className="bg-[#1f1f1f] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between border border-[#2a2a2a] transition hover:bg-[#242424]">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              <img
                src="https://statics.teams.cdn.live.net/evergreen-assets//illustrations/png/384/link-d-standard-384x384.png"
                width="54px"
                height="54px"
                class="fui-Image ___1erkwlp fj3muxo f1akhkt f1aperda f1lxtadh f1fabniw f1ewtqcl f14t3ns0"
              />
            </div>
            <p className="text-gray-200 font-medium">
              Quickly create, save, and share links with anyone.
            </p>
          </div>
          <a
            href="#"
            className="text-[#7b7dcf] hover:underline text-sm ml-auto"
          >
            Learn more about meeting links
          </a>
        </div>
      </section>

      {/* Scheduled Meetings */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-300">
            Scheduled meetings
          </h2>
          <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-gray-200 transition">
            <CalendarDays className="w-4 h-4" />
            <span>View in calendar</span>
          </button>
        </div>

        <div className="bg-[#1f1f1f] rounded-xl border border-[#2a2a2a] overflow-hidden">
          <div className="p-8 flex flex-col items-center justify-center text-gray-400">
            <p>You don't have anything scheduled.</p>
          </div>
          <div className="h-40 bg-gradient-to-b from-transparent to-[#242424] flex items-end justify-center"></div>
        </div>
      </section>
    </>
  );
};

export default MeetingsPage;

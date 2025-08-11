import React from "react";

interface TimelineItem {
  time: string;
  label: string;
  type: "feed" | "nap" | "play" | "bed";
}

interface AgendaTimelineProps {
  items: TimelineItem[];
}

const colors = {
  feed: "#FFB6B6",
  nap: "#B6D8FF",
  play: "#C3F584",
  bed: "#D6B6FF",
};

const AgendaTimeline: React.FC<AgendaTimelineProps> = ({ items }) => {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", fontSize: "1.5rem", marginBottom: "20px" }}>
        Baby's Daily Plan
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              borderRadius: "8px",
              background: colors[item.type],
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontWeight: "bold", width: "90px" }}>{item.time}</div>
            <div style={{ flex: 1 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgendaTimeline;


export function useActivityLog() {
  // Activity log data - ini nanti akan diganti dengan API call
  const activityLog = [
    { action: "Login", device: "Chrome on Windows", date: "2025-05-04T14:30:00", ip: "198.51.100.42" },
    { action: "Password changed", device: "Chrome on Windows", date: "2025-05-01T10:15:00", ip: "198.51.100.42" },
    { action: "Login", device: "Mobile App on Android", date: "2025-04-29T08:45:00", ip: "203.0.113.17" },
  ];

  return {
    activityLog,
  };
}

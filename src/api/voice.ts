import { Device } from "@twilio/voice-sdk";

let device: Device | null = null;

export async function startCall() {
  if (device) return device;
  const res = await fetch("/.netlify/functions/generate-twilio-token");
  if (!res.ok) throw new Error("Failed to fetch Twilio token");
  const { token } = await res.json();
  device = new Device(token, { logLevel: "error" });
  await device.register();
  await device.connect();
  return device;
}

export function endCall() {
  if (device) {
    device.disconnectAll();
    device.destroy();
    device = null;
  }
}

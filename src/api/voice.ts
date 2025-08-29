import type { Device } from "@twilio/voice-sdk";

let device: Device | null = null;
let stream: MediaStream | null = null;

/**
 * Initialize and start a Twilio Voice call.
 * - Fetches a Twilio voice token from serverless function
 * - Requests microphone access
 * - Creates and registers a Twilio Device
 */
export async function startCall(): Promise<Device> {
  if (device) return device;

  const res = await fetch("/.netlify/functions/voice-token");
  if (!res.ok) {
    throw new Error(`Voice token request failed: ${res.status} ${res.statusText}`);
  }
  const { token } = (await res.json()) as { token?: string };
  if (!token) {
    throw new Error("Voice token missing in response");
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    throw new Error("Microphone access was denied");
  }

  const { Device: TwilioDevice } = await import("@twilio/voice-sdk");
  device = new TwilioDevice(token, { audio: { input: stream }, logLevel: "error" });

  await device.register();
  await device.connect();

  return device;
}

/**
 * Cleanly end the current call and release resources.
 */
export function endCall() {
  if (device) {
    device.disconnectAll?.();
    device.destroy?.();
    device = null;
  }
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }
}

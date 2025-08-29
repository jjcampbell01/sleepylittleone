import type { Device } from '@twilio/voice-sdk';

/**
 * Fetch a voice token from the server and prepare the Twilio Device.
 * Errors during token retrieval or microphone access are surfaced so
 * the UI can notify the user and ensure media tracks are cleaned up.
 */
export async function setupVoiceDevice(): Promise<Device> {
  let stream: MediaStream | null = null;
  let device: Device | null = null;

  try {
    const res = await fetch('/.netlify/functions/voice-token');
    if (!res.ok) {
      throw new Error(`Voice token request failed: ${res.status} ${res.statusText}`);
    }
    const data = (await res.json()) as { token?: string };
    if (!data.token) {
      throw new Error('Voice token missing in response');
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      throw new Error('Microphone access was denied');
    }

    const { Device: TwilioDevice } = await import('@twilio/voice-sdk');
    device = new TwilioDevice(data.token, { audio: { input: stream } });
    return device;
  } catch (err) {
    if (device && typeof device.destroy === 'function') {
      device.destroy();
    }
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    throw err;
  }
}

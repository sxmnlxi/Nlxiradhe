// Generates/reads a stable per-device ID, used later by your backend to
// enforce "one account per device". This alone does NOT enforce anything —
// enforcement has to happen server-side (check this ID against your
// database when someone registers). This just gets the ID ready to send.
//
// On Android, Application.androidId is a good, hard-to-fake device ID that
// survives app reinstalls (it only changes on factory reset).

import * as Application from 'expo-application';

export function getDeviceId() {
  if (Application.androidId) {
    return Application.androidId;
  }
  return 'unknown-device';
}

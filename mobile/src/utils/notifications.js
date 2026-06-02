import * as Notifications from "expo-notifications";
import { savePushToken } from "../lib/firebase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForReminders(walletAddress) {
  const permission = await Notifications.requestPermissionsAsync();

  if (!permission.granted) {
    return;
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync();
    await savePushToken({ walletAddress, token: token.data });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "PayLoop contribution reminder",
        body: "Your next group contribution is due soon.",
      },
      trigger: {
        seconds: 10,
      },
    });
  } catch (error) {
    console.warn("Failed to register for notifications:", error);
  }
}

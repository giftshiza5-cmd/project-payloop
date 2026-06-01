const { messaging } = require("./firebase");

async function sendPushNotification({ token, title, body, data = {} }) {
  return messaging.send({
    token,
    notification: { title, body },
    data: Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, String(value)])
    ),
  });
}

module.exports = { sendPushNotification };

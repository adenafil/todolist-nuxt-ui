self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: "/taskify.png",
      badge: "/taskify.png",
      vibrate: [200, 100, 200],
      data: {
        taskId: data.taskId,
        url: data.url || "/dashboard",
      },
      actions: [
        {
          action: "view",
          title: "View Task",
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "view") {    
    event.waitUntil(clients.openWindow(event.notification.data.url));
  } else if (event.action === "dismiss") {
    // Handle dismiss action, if needed
    // event.waitUntil(clients.openWindow('https://elohim.id/wp-content/uploads/2022/02/Ayo-lawan-rasa-malas.png'));
    return;
  } else {
    // Default click action
    event.waitUntil(clients.openWindow("/dashboard"));
  }
});

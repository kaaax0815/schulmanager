declare let self: ServiceWorkerGlobalScope;

self.addEventListener('message', async (event) => {
  if (!event) {
    return;
  }
  if (!event.data) {
    return;
  }
  switch (event.data.action) {
    default:
      return "I don't know what you're talking about.";
  }
});

export {};

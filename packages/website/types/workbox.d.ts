declare class Workbox {
  messageSW(data: Record<string, unknown>): Promise<unknown>;
  get active(): Promise<ServiceWorker>;
}

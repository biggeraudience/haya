// simple duck-typing for Workers vs Node
export function isCloudflareWorker() {
  // Workers global fetch is `self.fetch`, Node doesn't have that
  return typeof self === "object" && typeof self.fetch === "function";
}

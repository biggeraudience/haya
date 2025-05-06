// utils/runtimeCheck.js

function isCloudflareWorker() {
  try {
    return (
      typeof WebSocketPair === "function" &&
      typeof self === "object" &&
      typeof self.fetch === "function" &&
      typeof process === "undefined"
    );
  } catch {
    return false;
  }
}

module.exports = { isCloudflareWorker };

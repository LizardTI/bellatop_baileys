import { startBot } from "./bot.js";

(async () => {
  try {
    console.log("Starting WhatsApp bot...");
    await startBot();
  } catch (error) {
    console.error("Failed to start the bot:", error);
  }
})();

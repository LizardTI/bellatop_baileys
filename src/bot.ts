import {
  makeWASocket,
  useMultiFileAuthState,
  WAMessage,
  WASocket,
  ConnectionState,
} from "@whiskeysockets/baileys";

export async function startBot(): Promise<WASocket> {
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");

  const sock: WASocket = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  // Save credentials when updated
  sock.ev.on("creds.update", saveCreds);

  // Listen for incoming messages
  sock.ev.on("messages.upsert", async (messageUpdate) => {
    const message: WAMessage = messageUpdate.messages[0];
    if (!message.key.fromMe && message.message) {
      const sender = message.key.remoteJid;
      if (sender) {
        console.log(
          `\nReceived a message from ${sender}: ${JSON.stringify(
            message.message.conversation
          )}\n`
        );

        // Respond with "hello"
        // await sock.sendMessage(sender, { text: "hello" });
        // Needs to be sent to other api
        // standby code
      }
    }
  });

  // Handle connection updates
  sock.ev.on("connection.update", (update: Partial<ConnectionState>) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error &&
        (lastDisconnect.error as any)?.output?.statusCode !== 401;
      console.log("Connection closed. Reconnecting...", shouldReconnect);
      if (shouldReconnect) startBot(); // Restart bot
    } else if (connection === "open") {
      console.log("Connected to WhatsApp");
    }
  });

  return sock;
}

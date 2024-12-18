import {
  makeWASocket,
  useMultiFileAuthState,
  WAMessage,
  WASocket,
  ConnectionState,
  MessageUpsertType,
} from "@whiskeysockets/baileys";
import QRCode from "qrcode-terminal"; // Import qrcode-terminal

export async function startBot(): Promise<WASocket> {
  // types
  interface MessagesUpsert {
    messages: WAMessage[];
    type: MessageUpsertType;
    requestId?: string;
  }

  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");

  const sock: WASocket = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on<any>("qr", (qr: string) => {
    console.log("QR Code data:", qr);
    QRCode.generate(qr, { small: true });
  });

  // Save credentials when updated
  sock.ev.on("creds.update", saveCreds);

  // Listen for incoming messages
  sock.ev.on("messages.upsert", async (messageUpdate: MessagesUpsert) => {
    const message: WAMessage = messageUpdate.messages[0];
    if (!message.key.fromMe && message.message) {
      const sender = message.key.remoteJid;
      if (sender) {
        console.log(
          `\nReceived a message from ${sender}: ${JSON.stringify(
            message.message.conversation
          )}\n`
        );

        // Talk to AI or whatever you need to process here
        // send ai response to user or other actions
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

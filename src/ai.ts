import { WAMessage } from "@whiskeysockets/baileys";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const API_URI = process.env.API_URI || "http://127.0.0.1:8000/chat";
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

console.log("Ai api uri:", API_URI);
console.log("Google api key:", GOOGLE_API_KEY);
console.log("Groq api key:", GROQ_API_KEY);

export async function getAiResponse(message: WAMessage): Promise<string> {
  if (!message.message) {
    return "";
  }
  let body = {
    user_input: message.message.conversation,
  };
  let res = await axios.post(API_URI, body);
  let statusCode = res.status;
  let data = res.data;
  console.log("Status code:", statusCode);
  console.log("Response:", data);
  return `${data}`;
}

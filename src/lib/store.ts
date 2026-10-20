import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { MongoClient, ObjectId, type Db } from "mongodb";
import { defaultContent } from "@/data/resume";
import { contentSchema, type Content, type Message } from "./types";

/*
 * Two drivers behind one interface:
 *  - MongoDB when MONGODB_URI is set (production, e.g. Atlas + Vercel)
 *  - JSON files in .data/ otherwise (zero-setup local development)
 */

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "portfolio";

const globalForMongo = globalThis as unknown as { _mongo?: Promise<MongoClient> };

async function db(): Promise<Db> {
  if (!globalForMongo._mongo) globalForMongo._mongo = new MongoClient(uri!).connect();
  return (await globalForMongo._mongo).db(dbName);
}

const dataDir = path.join(process.cwd(), ".data");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path.join(dataDir, file), "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown) {
  await fs.mkdir(dataDir, { recursive: true });
  const target = path.join(dataDir, file);
  await fs.writeFile(`${target}.tmp`, JSON.stringify(data, null, 2));
  await fs.rename(`${target}.tmp`, target);
}

type ContentDoc = { _id: string; data: Content; updatedAt: Date };
type MessageDoc = Omit<Message, "id" | "createdAt"> & { _id?: ObjectId; createdAt: Date };

export async function getContent(): Promise<Content> {
  try {
    const stored = uri
      ? (await (await db()).collection<ContentDoc>("content").findOne({ _id: "site" }))?.data
      : await readJson<Content | null>("content.json", null);
    const parsed = contentSchema.safeParse(stored);
    return parsed.success ? parsed.data : defaultContent;
  } catch (err) {
    console.error("[store] failed to read content, using defaults", err);
    return defaultContent;
  }
}

export async function saveContent(content: Content) {
  if (uri) {
    await (await db())
      .collection<ContentDoc>("content")
      .updateOne({ _id: "site" }, { $set: { data: content, updatedAt: new Date() } }, { upsert: true });
  } else {
    await writeJson("content.json", content);
  }
}

export async function addMessage(input: Pick<Message, "name" | "email" | "message">) {
  const createdAt = new Date();
  if (uri) {
    await (await db()).collection<MessageDoc>("messages").insertOne({ ...input, read: false, createdAt });
  } else {
    const all = await readJson<Message[]>("messages.json", []);
    all.unshift({ id: randomUUID(), ...input, read: false, createdAt: createdAt.toISOString() });
    await writeJson("messages.json", all.slice(0, 500));
  }
}

export async function listMessages(): Promise<Message[]> {
  if (!uri) return readJson<Message[]>("messages.json", []);
  const docs = await (await db()).collection<MessageDoc>("messages").find().sort({ createdAt: -1 }).limit(200).toArray();
  return docs.map(({ _id, createdAt, ...m }) => ({ ...m, id: String(_id), createdAt: createdAt.toISOString() }));
}

export async function updateMessage(id: string, patch: { read: boolean }) {
  if (uri) {
    if (!ObjectId.isValid(id)) return;
    await (await db()).collection<MessageDoc>("messages").updateOne({ _id: new ObjectId(id) }, { $set: patch });
  } else {
    const all = await readJson<Message[]>("messages.json", []);
    await writeJson("messages.json", all.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }
}

export async function deleteMessage(id: string) {
  if (uri) {
    if (!ObjectId.isValid(id)) return;
    await (await db()).collection<MessageDoc>("messages").deleteOne({ _id: new ObjectId(id) });
  } else {
    const all = await readJson<Message[]>("messages.json", []);
    await writeJson("messages.json", all.filter((m) => m.id !== id));
  }
}

export const storageMode = uri ? "mongodb" : "file";

import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb+srv://threedot:Ajar003@threedot.zjgkhdo.mongodb.net/";
const dbName = "budget";
let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await connectToDatabase();
  const db = client.db(dbName);
  const collection = db.collection("custom_expenses");

  if (req.method === "GET") {
    const { id } = req.query;
    if (id) {
      // Fetch one by id
      const item = await collection.findOne({
        _id: new ObjectId(id as string),
      });
      res.status(200).json({ item });
      return;
    }
    // Fetch all
    const items = await collection.find({}).sort({ createdAt: -1 }).toArray();
    res.status(200).json({ items });
    return;
  }

  if (req.method === "POST") {
    // Add a new custom expense project
    const { title, description } = req.body;
    if (!title) {
      res.status(400).json({ error: "Title is required" });
      return;
    }
    const result = await collection.insertOne({
      title,
      description: description || "",
      createdAt: new Date(),
    });
    res.status(200).json({ ok: true, id: result.insertedId });
    return;
  }

  if (req.method === "PUT") {
    // Update a custom expense project (optional)
    const { id, title, description } = req.body;
    if (!id || !title) {
      res.status(400).json({ error: "ID and title are required" });
      return;
    }
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, description } }
    );
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === "DELETE") {
    // Delete a custom expense project (optional)
    const { id } = req.body;
    if (!id) {
      res.status(400).json({ error: "ID is required" });
      return;
    }
    await collection.deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).end();
}

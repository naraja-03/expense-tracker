import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://threedot:Ajar003@threedot.zjgkhdo.mongodb.net/";
const dbName = "budget"; // you can use any db name
let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
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

  if (req.method === "GET") {
    const { month } = req.query;

    // Get expenses for month
    const days = await db
      .collection("days")
      .find(
        month && typeof month === "string"
          ? { date: { $regex: `^${month}` } }
          : {}
      )
      .toArray();

    // Get target for month
    const targetDoc = await db.collection("targets").findOne({ month });
    const target = targetDoc?.target ?? 0;
    res.status(200).json({ expenses: days, target });
    return;
  }

  if (req.method === "POST") {
    const { type, date, index, newItem, target, month } = req.body;

    if (type === "add") {
      // Upsert day
      await db
        .collection("days")
        .updateOne({ date }, { $push: { items: newItem } }, { upsert: true });
    } else if (type === "edit") {
      // Edit an existing item in a day's items array
      if (typeof index === "number") {
        const day = await db.collection("days").findOne({ date });
        if (!day || !day.items || !day.items[index]) {
          res.status(404).json({ error: "Item not found" });
          return;
        }
        day.items[index] = newItem;
        await db
          .collection("days")
          .updateOne({ date }, { $set: { items: day.items } });
      }
    } else if (type === "target") {
      // Upsert target for month
      await db
        .collection("targets")
        .updateOne({ month }, { $set: { target } }, { upsert: true });
    } else if (type === "update") {
      // Overwrite all days (admin use)
      await db.collection("days").deleteMany({});
      await db.collection("days").insertMany(newItem);
    }
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).end();
}

import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";
import type { DayExpense } from "@/types/expense";

const DATA_PATH = path.join(process.cwd(), "db.json");

async function readData(): Promise<DayExpense[]> {
  try {
    const file = await fs.readFile(DATA_PATH, "utf-8");
    const json = JSON.parse(file);
    return json.days || [];
  } catch (e) {
    console.log(e);
    return [];
  }
}
async function writeData(days: DayExpense[]): Promise<void> {
  const json = JSON.stringify({ days }, null, 2);
  await fs.writeFile(DATA_PATH, json, "utf-8");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const days = await readData();
    res.status(200).json(days);
    return;
  }
  if (req.method === "POST") {
    const { type, date, index, newItem } = req.body;
    let days = await readData();

    if (type === "add") {
      const idx = days.findIndex((d) => d.date === date);
      if (idx !== -1) {
        days[idx] = {
          ...days[idx],
          items: [...days[idx].items, newItem],
        };
      } else {
        days.push({ date, items: [newItem] });
      }
    } else if (type === "edit") {
      const idx = days.findIndex((d) => d.date === date);
      if (idx !== -1 && Number.isFinite(index)) {
        days[idx] = {
          ...days[idx],
          items: days[idx].items.map((item, i) =>
            i === index ? newItem : item
          ),
        };
      }
    } else if (type === "update") {
      days = newItem;
    }
    await writeData(days);
    res.status(200).json({ ok: true });
    return;
  }
  res.status(405).end();
}

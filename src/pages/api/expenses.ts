import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";
import type { DayExpense } from "@/types/expense";

interface ExpensesFileData {
  targetByMonth: { [month: string]: number };
  days: DayExpense[];
}

const DATA_PATH = path.join(process.cwd(), "data", "expenses.json");

async function readData(): Promise<ExpensesFileData> {
  try {
    const file = await fs.readFile(DATA_PATH, "utf-8");
    const json = JSON.parse(file);
    return {
      targetByMonth: json.targetByMonth || {},
      days: json.days || [],
    };
  } catch (e) {
    console.log(e);
    return { targetByMonth: {}, days: [] };
  }
}

async function writeData(data: ExpensesFileData): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(DATA_PATH, json, "utf-8");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { month } = req.query;
    const data = await readData();

    let filtered = data.days;
    if (month && typeof month === "string") {
      filtered = data.days.filter((day) => day.date.startsWith(month));
    }
    const target = month && typeof month === "string"
      ? data.targetByMonth[month] ?? 0
      : 0;
    res.status(200).json({ expenses: filtered, target });
    return;
  }

  if (req.method === "POST") {
    const { type, date, index, newItem, target, month } = req.body;
    const data = await readData();

    if (type === "add") {
      const idx = data.days.findIndex((d) => d.date === date);
      if (idx !== -1) {
        data.days[idx] = {
          ...data.days[idx],
          items: [...data.days[idx].items, newItem],
        };
      } else {
        data.days.push({ date, items: [newItem] });
      }
    } else if (type === "edit") {
      const idx = data.days.findIndex((d) => d.date === date);
      if (idx !== -1 && Number.isFinite(index)) {
        data.days[idx] = {
          ...data.days[idx],
          items: data.days[idx].items.map((item, i) =>
            i === index ? newItem : item
          ),
        };
      }
    } else if (type === "target") {
      // month is required for setting target
      if (month && typeof target === "number") {
        data.targetByMonth[month] = target;
      }
    } else if (type === "update") {
      data.days = newItem;
    }
    await writeData(data);
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).end();
}
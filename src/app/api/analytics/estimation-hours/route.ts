import { NextResponse } from "next/server";
import tasksData from "@/app/frontend-assignment.json";
import { EstimationHoursData } from "@/app/Components/types";

export async function GET() {
  try {
    const categories: Record<string, number> = {
      "0-3": 0,
      "4-6": 0,
      "7-9": 0,
      "10+": 0,
    };

    tasksData.tasks.forEach((task) => {
      const hours = task.estimatedHours || 0;
      if (hours <= 3) categories["0-3"]++;
      else if (hours <= 6) categories["4-6"]++;
      else if (hours <= 9) categories["7-9"]++;
      else categories["10+"]++;
    });

    const data: EstimationHoursData[] = Object.entries(categories)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value,
      }));

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

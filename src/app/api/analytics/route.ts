import { NextResponse } from "next/server";
import tasksData from "@/app/frontend-assignment.json";
import { AnalyticsData } from "@/app/Components/types";

const getDateRange = (dates: string[]) => {
  if (dates.length === 0) return [];
  const sorted = [...dates].sort();
  return [sorted[0], sorted[sorted.length - 1]];
};

const generateAllDates = (start: string, end: string) => {
  const dates = [];
  const startDate = new Date(start);
  const endDate = new Date(end);

  while (startDate <= endDate) {
    dates.push(startDate.toISOString().split("T")[0]);
    startDate.setDate(startDate.getDate() + 1);
  }
  return dates;
};

export async function GET() {
  try {
    // Collect all relevant dates
    const allDates = new Set<string>();

    tasksData.tasks.forEach((task) => {
      if (task.completedAt) allDates.add(task.completedAt.split("T")[0]);
      if (task.dueDate) allDates.add(task.dueDate);
    });

    // Get date range
    const dateArray = Array.from(allDates);
    const [startDate, endDate] = getDateRange(dateArray);

    if (!startDate || !endDate) {
      return NextResponse.json({
        completedPerDay: [],
        dueDatePerDay: [],
      });
    }

    // Generate all dates in range
    const fullDateRange = generateAllDates(startDate, endDate);

    // Initialize data structures with zeros
    const completedPerDay: Record<string, number> = {};
    const dueDatePerDay: Record<string, number> = {};

    fullDateRange.forEach((date) => {
      completedPerDay[date] = 0;
      dueDatePerDay[date] = 0;
    });

    // Count actual values
    tasksData.tasks.forEach((task) => {
      // Completed tasks
      if (task.status === "Completed" && task.completedAt) {
        const dateKey = task.completedAt.split("T")[0];
        completedPerDay[dateKey]++;
      }

      // Due dates
      if (task.dueDate) {
        dueDatePerDay[task.dueDate]++;
      }
    });

    // Convert to array format
    const responseData: AnalyticsData = {
      completedPerDay: Object.entries(completedPerDay).map(([date, count]) => ({
        date,
        count,
      })),
      dueDatePerDay: Object.entries(dueDatePerDay).map(([date, count]) => ({
        date,
        count,
      })),
    };

    return NextResponse.json(responseData);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

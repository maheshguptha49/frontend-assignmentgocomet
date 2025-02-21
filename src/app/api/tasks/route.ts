import { NextResponse } from "next/server";
import tasksData from "@/app/frontend-assignment.json";
import { Task, TaskResponseData } from "@/app/Components/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const filters = {
      name: searchParams.get("name") || undefined,
      description: searchParams.get("description") || undefined,
      assignee: searchParams.get("assignee") || undefined,
      status: searchParams.get("status") || undefined,
      dueDate: searchParams.get("dueDate") || undefined,
    };

    const sort = {
      field:
        (searchParams.get("sortBy") as "createdAt" | "dueDate") || undefined,
      order: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    };

    const search = searchParams.get("search") || undefined;

    return NextResponse.json<TaskResponseData>(
      getPaginatedTasks(page, limit, filters, sort, search)
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export const getPaginatedTasks = (
  page: number,
  limit: number,
  filters?: {
    name?: string;
    description?: string;
    assignee?: string;
    status?: string;
    dueDate?: string;
  },
  sort?: { field: "createdAt" | "dueDate"; order: "asc" | "desc" },
  search?: string
): TaskResponseData => {
  let filteredTasks = tasksData.tasks;
  // Apply search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredTasks = filteredTasks.filter(
      (task) =>
        task.name.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
    );
  }

  // Apply filters
  if (filters) {
    filteredTasks = filteredTasks.filter((task) => {
      console.log(task, " filteredTasks task");
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const taskValue = task[key as keyof Task];

        // Special handling for dates
        if (key === "dueDate") {
          return task.dueDate === value;
        }

        return String(taskValue).toLowerCase().includes(value.toLowerCase());
      });
    });
  }

  // Apply sorting
  if (sort?.field) {
    filteredTasks = filteredTasks.sort((a, b) => {
      const aValue =
        sort.field === "createdAt"
          ? new Date(a.createdAt).getTime()
          : new Date(a.dueDate).getTime();

      const bValue =
        sort.field === "createdAt"
          ? new Date(b.createdAt).getTime()
          : new Date(b.dueDate).getTime();

      return sort.order === "asc" ? aValue - bValue : bValue - aValue;
    });
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  console.log(filteredTasks, "filteredTasks");

  return {
    data: filteredTasks.slice(startIndex, endIndex) as Task[],
    total: filteredTasks.length,
    totalPages: Math.ceil(filteredTasks.length / limit),
    currentPage: page,
  };
};

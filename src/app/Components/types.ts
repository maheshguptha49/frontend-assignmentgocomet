export type Comment = {
  id: number;
  author: string;
  text: string;
  timestamp: string;
};

export type Task = {
  id: number;
  name: string;
  description: string;
  assignee: string;
  status: "Pending" | "In Progress" | "Completed";
  dueDate: string;
  createdAt: string;
  comments?: Comment[];
  details: string;
};

export interface TaskResponseData {
  data: Task[];
  total: number;
  totalPages: number;
  currentPage: number;
}

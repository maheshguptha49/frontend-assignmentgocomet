import styled from "styled-components";
import { Task } from "./types";

const TaskGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TaskHeader = styled.div`
  display: flex;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  gap: 1rem;
`;

const TaskRow = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  gap: 1rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const TaskCell = styled.div<{ width?: string }>`
  flex: ${(props) => props.width || "1"};
  padding: 0.5rem;
`;

const StatusBadge = styled.div<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  background-color: ${(props) =>
    props.status === "Completed"
      ? "#e6f4ea"
      : props.status === "In Progress"
      ? "#fff8e6"
      : "#f0f0f0"};
  color: ${(props) =>
    props.status === "Completed"
      ? "#137333"
      : props.status === "In Progress"
      ? "#f9ab00"
      : "#5f6368"};
`;

export default function TaskList({
  tasks,
  onTaskSelect,
}: {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
}) {
  return (
    <TaskGrid>
      <TaskHeader>
        <TaskCell width="5%">#</TaskCell>
        <TaskCell width="10%">Created</TaskCell>
        <TaskCell width="15%">ID</TaskCell>
        <TaskCell width="20%">Name</TaskCell>
        <TaskCell width="25%">Description</TaskCell>
        <TaskCell width="10%">Assignee</TaskCell>
        <TaskCell width="15%">Status</TaskCell>
        <TaskCell width="10%">Due Date</TaskCell>
      </TaskHeader>

      {tasks.map((task, index) => (
        <TaskRow key={task.id} onClick={() => onTaskSelect(task)}>
          <TaskCell width="5%">{index + 1}</TaskCell>
          {task.createdAt && (
            <TaskCell width="10%">
              {new Date(task.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </TaskCell>
          )}
          <TaskCell width="15%">
            TASK-{task.id.toString().padStart(3, "0")}
          </TaskCell>
          <TaskCell width="20%">
            <div style={{ fontWeight: 500 }}>{task.name}</div>
          </TaskCell>
          <TaskCell width="25%">{task.description}</TaskCell>
          <TaskCell width="10%">{task.assignee}</TaskCell>
          <TaskCell width="15%">
            <StatusBadge status={task.status}>{task.status}</StatusBadge>
          </TaskCell>
          <TaskCell width="10%">
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </TaskCell>
        </TaskRow>
      ))}
    </TaskGrid>
  );
}

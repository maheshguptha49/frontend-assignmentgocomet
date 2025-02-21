import styled from "styled-components";
import { Task } from "./types";
import { FixedSizeList as List } from "react-window";

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
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    background-color: #f8f9fa;
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px #007bff;
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

const ListContainer = styled.div`
  height: 600px; // Set a fixed height for virtualization
  width: 100%;
`;

export default function TaskList({
  tasks,
  onTaskSelect,
  visibleColumns,
}: {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  visibleColumns: string[];
}) {
  const Row = ({
    index,
    style,
    data,
  }: {
    index: number;
    style: React.CSSProperties;
    data: {
      tasks: Task[];
      visibleColumns: string[];
      onTaskSelect: (task: Task) => void;
    };
  }) => {
    const task = data.tasks[index];
    return (
      <TaskRow
        style={style}
        role="button"
        tabIndex={0}
        aria-label={`View details of task ${task.name}`}
        onClick={() => data.onTaskSelect(task)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            data.onTaskSelect(task);
          }
        }}
      >
        {data.visibleColumns.includes("index") && (
          <TaskCell width="5%">{index + 1}</TaskCell>
        )}
        {data.visibleColumns.includes("createdAt") && task.createdAt && (
          <TaskCell width="10%">
            {new Date(task.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </TaskCell>
        )}
        {data.visibleColumns.includes("id") && (
          <TaskCell width="15%">
            TASK-{task.id.toString().padStart(3, "0")}
          </TaskCell>
        )}
        {data.visibleColumns.includes("name") && (
          <TaskCell width="20%">
            <div style={{ fontWeight: 500 }}>{task.name}</div>
          </TaskCell>
        )}
        {data.visibleColumns.includes("description") && (
          <TaskCell width="25%">{task.description}</TaskCell>
        )}
        {data.visibleColumns.includes("assignee") && (
          <TaskCell width="10%">{task.assignee}</TaskCell>
        )}
        {data.visibleColumns.includes("status") && (
          <TaskCell width="15%">
            <StatusBadge status={task.status}>{task.status}</StatusBadge>
          </TaskCell>
        )}
        {data.visibleColumns.includes("dueDate") && (
          <TaskCell width="10%">
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </TaskCell>
        )}
      </TaskRow>
    );
  };

  return (
    <TaskGrid>
      <TaskHeader>
        {visibleColumns.includes("index") && <TaskCell width="5%">#</TaskCell>}
        {visibleColumns.includes("createdAt") && (
          <TaskCell width="10%">Created</TaskCell>
        )}
        {visibleColumns.includes("id") && <TaskCell width="15%">ID</TaskCell>}
        {visibleColumns.includes("name") && (
          <TaskCell width="20%">Name</TaskCell>
        )}
        {visibleColumns.includes("description") && (
          <TaskCell width="25%">Description</TaskCell>
        )}
        {visibleColumns.includes("assignee") && (
          <TaskCell width="10%">Assignee</TaskCell>
        )}
        {visibleColumns.includes("status") && (
          <TaskCell width="15%">Status</TaskCell>
        )}
        {visibleColumns.includes("dueDate") && (
          <TaskCell width="10%">Due Date</TaskCell>
        )}
      </TaskHeader>

      <ListContainer>
        <List
          height={600}
          itemCount={tasks.length}
          itemSize={80}
          width="100%"
          itemData={{
            tasks,
            visibleColumns,
            onTaskSelect,
          }}
        >
          {Row}
        </List>
      </ListContainer>
    </TaskGrid>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useGetTasksQuery } from "./redux/taskApiSlice";
import TaskList from "./TaskList";
import Controls from "./Controls";
import styled from "styled-components";
import { Task } from "./types";
import TaskDrawer from "./TaskDrawer";

const WrapperContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const LoadingText = styled.div`
  padding: 2rem;
  text-align: center;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorText = styled.div`
  padding: 2rem;
  text-align: center;
  color: #dc3545;
  font-size: 1.2rem;
`;

const LoadMoreButton = styled.button`
  padding: 1rem 2rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
  margin-left: auto;
  display: block;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const LoadingSkeleton = styled.div`
  height: 50px;
  background: #f0f0f0;
  border-radius: 4px;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export default function TaskListWrapper() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Partial<Task>>({});
  const [sortBy, setSortBy] = useState<"createdAt" | "dueDate">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data, error, isLoading, isFetching } = useGetTasksQuery({
    page,
    limit: 10,
    filters,
    sortBy,
    sortOrder,
    search,
  });

  const loadMore = () => {
    if (data && page < data.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filters, sortBy, sortOrder, search]);

  return (
    <WrapperContainer>
      <Controls
        filters={filters}
        setFilters={setFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        search={search}
        setSearch={setSearch}
      />

      {error && <ErrorText>Error loading tasks</ErrorText>}
      {isLoading && <LoadingText>Loading tasks...</LoadingText>}

      {data && (
        <>
          <TaskList tasks={data.data} onTaskSelect={setSelectedTask} />
          {data.currentPage < data.totalPages && (
            <LoadMoreButton onClick={loadMore} disabled={isFetching}>
              {isFetching ? "Loading..." : "Load More"}
            </LoadMoreButton>
          )}
          <TaskDrawer
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        </>
      )}

      {isLoading && (
        <div aria-live="polite">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
        </div>
      )}
    </WrapperContainer>
  );
}

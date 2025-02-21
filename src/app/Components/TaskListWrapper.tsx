"use client";

import { useState, useEffect, useCallback } from "react";
import { useGetTasksQuery } from "./redux/taskApiSlice";
import TaskList from "./TaskList";
import Controls from "./Controls";
import styled from "styled-components";
import { Task } from "./types";
import TaskDrawer from "./TaskDrawer";
import ColumnConfigDrawer from "./ColumnConfigDrawer";

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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState([
    "index",
    "createdAt",
    "id",
    "name",
    "description",
    "assignee",
    "status",
    "dueDate",
  ]);

  const { data, error, isLoading, isFetching } = useGetTasksQuery({
    page,
    limit: 15,
    filters,
    sortBy,
    sortOrder,
    search,
  });

  const loadMore = useCallback(() => {
    if (data && page < data.totalPages && !isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [data, page, isFetching]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 500 && !isFetching) {
        loadMore();
      }
    };

    const debouncedScroll = debounce(handleScroll, 100);
    window.addEventListener("scroll", debouncedScroll);
    return () => window.removeEventListener("scroll", debouncedScroll);
  }, [loadMore, isFetching]);

  useEffect(() => {
    if (data?.currentPage === 1 && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [data, isInitialLoad]);

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
        assignees={Array.from(
          new Set(
            (data?.data
              ?.map((task) => task.assignee)
              .filter(Boolean) as string[]) || []
          )
        )}
        onColumnConfigClick={() => setShowColumnConfig(true)}
      />

      <ColumnConfigDrawer
        isOpen={showColumnConfig}
        onClose={() => setShowColumnConfig(false)}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
      />

      {error && <ErrorText>Error loading tasks</ErrorText>}
      {isLoading && <LoadingText>Loading tasks...</LoadingText>}

      {data && (
        <>
          <TaskList
            tasks={data.data}
            onTaskSelect={setSelectedTask}
            visibleColumns={visibleColumns}
          />
          <TaskDrawer
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        </>
      )}

      {(isFetching || isLoading) && (
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

function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

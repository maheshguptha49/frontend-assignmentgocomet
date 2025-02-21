import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

type Filters = Partial<{
  name: string;
  description: string;
  assignee: string;
  status: "Pending" | "In Progress" | "Completed";
  dueDate: string;
}>;

type ControlsProps = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  sortBy: "createdAt" | "dueDate";
  setSortBy: (value: "createdAt" | "dueDate") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
  search: string;
  setSearch: (value: string) => void;
  assignees: string[];
  onColumnConfigClick: () => void;
};

const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

function useDebounce<T>(value: T, delay: number, options = { leading: false }) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLeadingCalledRef = useRef(false);

  useEffect(() => {
    if (options.leading && !isLeadingCalledRef.current) {
      setDebouncedValue(value);
      isLeadingCalledRef.current = true;
    }

    timeoutRef.current = setTimeout(() => {
      if (!options.leading) {
        setDebouncedValue(value);
      }
      isLeadingCalledRef.current = false;
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, options.leading]);

  return debouncedValue;
}

export default function Controls({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  search,
  setSearch,
  assignees,
  onColumnConfigClick,
}: ControlsProps) {
  const [localInputValue, setLocalInputValue] = useState(search);
  const debouncedSearchValue = useDebounce(localInputValue, 300);

  useEffect(() => {
    setSearch(debouncedSearchValue);
  }, [debouncedSearchValue, setSearch]);

  return (
    <ControlsContainer>
      <Input
        type="text"
        placeholder="Search name/description..."
        value={localInputValue}
        onChange={(e) => setLocalInputValue(e.target.value)}
      />

      <Select
        value={filters.assignee || ""}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, assignee: e.target.value }))
        }
      >
        <option value="">All Assignees</option>
        {assignees.map((assignee) => (
          <option key={assignee} value={assignee}>
            {assignee}
          </option>
        ))}
      </Select>

      <Select
        value={filters.status || ""}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            status: e.target.value as "Pending" | "In Progress" | "Completed",
          }))
        }
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </Select>

      <Input
        type="date"
        value={filters.dueDate || ""}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, dueDate: e.target.value }))
        }
      />

      {/* Sorting Controls */}
      <Select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as "createdAt" | "dueDate")}
      >
        <option value="createdAt">Sort by Created Date</option>
        <option value="dueDate">Sort by Due Date</option>
      </Select>

      <Select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </Select>

      <button
        onClick={onColumnConfigClick}
        className="p-2 hover:bg-gray-100 rounded-lg"
      >
        Edit Columns
      </button>
    </ControlsContainer>
  );
}

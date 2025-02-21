"use client";

import { styled } from "styled-components";

const DrawerWrapper = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: ${({ $isOpen }) => ($isOpen ? "0" : "-100%")};
  width: 300px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease-in-out;
  padding: 2rem;
  z-index: 1000;
  overflow-y: auto;
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
`;

const ConfigSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ConfigLabel = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #2c3e50;
`;

const ConfigOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }
`;

export default function ColumnConfigDrawer({
  isOpen,
  onClose,
  visibleColumns,
  setVisibleColumns,
}: {
  isOpen: boolean;
  onClose: () => void;
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
}) {
  return (
    <>
      <Overlay $isOpen={isOpen} onClick={onClose} />
      <DrawerWrapper $isOpen={isOpen}>
        <button
          onClick={onClose}
          style={{ float: "right", fontSize: "1.5rem", padding: "0.5rem" }}
          aria-label="Close configuration"
        >
          &times;
        </button>

        <ConfigSection>
          <ConfigLabel>Visible Columns</ConfigLabel>
          {[
            { id: "index", label: "#" },
            { id: "createdAt", label: "Created Date" },
            { id: "id", label: "Task ID" },
            { id: "name", label: "Name" },
            { id: "description", label: "Description" },
            { id: "assignee", label: "Assignee" },
            { id: "status", label: "Status" },
            { id: "dueDate", label: "Due Date" },
          ].map((column) => (
            <ConfigOption key={column.id}>
              <input
                type="checkbox"
                checked={visibleColumns.includes(column.id)}
                onChange={() => {
                  const newColumns = visibleColumns.includes(column.id)
                    ? visibleColumns.filter((c) => c !== column.id)
                    : [...visibleColumns, column.id];
                  setVisibleColumns(newColumns);
                }}
              />
              {column.label}
            </ConfigOption>
          ))}
        </ConfigSection>
      </DrawerWrapper>
    </>
  );
}

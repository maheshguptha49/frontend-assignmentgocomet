"use client";

import styled from "styled-components";
import { Task } from "./types";

const DrawerWrapper = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: ${({ $isOpen }) => ($isOpen ? "0" : "-100%")};
  width: 600px;
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

const Section = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Label = styled.h3`
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #ecf0f1;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #7f8c8d;
`;

const DetailValue = styled.span`
  color: #2c3e50;
`;

const CommentContainer = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const CommentAuthor = styled.span`
  font-weight: 600;
  color: #3498db;
`;

const CommentTime = styled.span`
  color: #95a5a6;
  font-size: 0.85rem;
`;

const CommentText = styled.p`
  color: #34495e;
  line-height: 1.6;
  margin: 0;
`;

export default function TaskDrawer({
  task,
  onClose,
}: {
  task: Task | null;
  onClose: () => void;
}) {
  return (
    <>
      <Overlay $isOpen={!!task} onClick={onClose} />
      <DrawerWrapper $isOpen={!!task}>
        {task && (
          <div>
            <button
              onClick={onClose}
              style={{ float: "right", fontSize: "1.5rem", padding: "0.5rem" }}
              aria-label="Close drawer"
            >
              &times;
            </button>

            <Section>
              <Label>Task Details</Label>
              <DetailRow>
                <DetailLabel>Details:</DetailLabel>
                <DetailValue>
                  {task.details || "No additional details provided"}
                </DetailValue>
              </DetailRow>
            </Section>

            <Section>
              <Label>Comments ({task.comments?.length || 0})</Label>
              {task.comments?.map((comment) => (
                <CommentContainer key={comment.id}>
                  <CommentHeader>
                    <CommentAuthor>{comment.author}</CommentAuthor>
                    <CommentTime>
                      {comment.timestamp &&
                        new Date(comment.timestamp).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                    </CommentTime>
                  </CommentHeader>
                  <CommentText>{comment.text}</CommentText>
                </CommentContainer>
              ))}
              {!task.comments?.length && (
                <div style={{ color: "#95a5a6", textAlign: "center" }}>
                  No comments available for this task
                </div>
              )}
            </Section>
          </div>
        )}
      </DrawerWrapper>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";

const Nav = styled.nav`
  background: #f8f9fa;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e9ecef;
`;

const NavList = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
  justify-content: center;
`;

const NavItem = styled.li<{ $active: boolean }>`
  a {
    color: ${({ $active }) => ($active ? "#2c3e50" : "#7f8c8d")};
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      color: #2c3e50;
      background: #e9ecef;
    }
  }
`;

export default function Navbar() {
  const pathname = usePathname();

  return (
    <Nav>
      <NavList>
        <NavItem $active={pathname === "/dashboard"}>
          <Link href="/dashboard">Dashboard</Link>
        </NavItem>
        <NavItem $active={pathname === "/table"}>
          <Link href="/table">Table View</Link>
        </NavItem>
      </NavList>
    </Nav>
  );
}

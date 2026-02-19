import { NavLink } from "react-router-dom";
import "./sidebar.css";

export function Sidebar() {
  return (
    <nav aria-label="Primary" className="sidebar">
      <div className="sectionTitle">Console</div>

      <NavItem to="/users">Users</NavItem>
      <NavItem to="/policies">Policies</NavItem>
      <NavItem to="/audit">Audit Log</NavItem>

      <div style={{ flex: 1 }} />

      <div className="sectionTitle">Session</div>
      <NavItem to="/login">Login</NavItem>
    </nav>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "navItem navItemActive" : "navItem")}
    >
      {children}
    </NavLink>
  );
}


function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={sectionTitleStyle}>{children}</div>;
}

const sidebarStyle: React.CSSProperties = {
  borderRight: "1px solid #e5e7eb",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const navItemStyle: React.CSSProperties = {
  display: "block",
  padding: "10px 12px",
  borderRadius: 10,
  textDecoration: "none",
  border: "1px solid #e5e7eb",
};

const sectionTitleStyle: React.CSSProperties = {
  marginTop: 8,
  marginBottom: 4,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  opacity: 0.7,
};

// NavLink is like an <a> tag but intercepts clicks to prevent full page reloads.
// It also auto-applies an "active" CSS class when its URL matches the current route.
import { NavLink } from "react-router-dom";

// Defines the shape of props this component accepts.
// isCollapsed: tracks whether the sidebar is open or closed.
// onCollapse: a function passed in from Layout that toggles isCollapsed.
// The sidebar doesn't own this state — Layout does. Sidebar just calls the function.
type SidebarProps = {
  isCollapsed: boolean;
  onCollapse: () => void;
};

// Props are destructured directly in the parameter list.
// Instead of writing props.isCollapsed, destructuring lets you use isCollapsed directly.
const Sidebar = ({ isCollapsed, onCollapse }: SidebarProps) => {
  return (
    // Semantic HTML element for sidebar content.
    // The template literal dynamically adds the "collapsed" class when isCollapsed is true.
    // Template literal syntax: `static-class ${condition ? "class-if-true" : "class-if-false"}`
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Calls onCollapse when clicked, which flips isCollapsed in Layout via setIsCollapsed.
          The label reflects the action the button will perform, not the current state. */}
      <button onClick={onCollapse}>
        {isCollapsed ? "Expand" : "Collapse"}
      </button>

      {/* Short-circuit rendering: if isCollapsed is true, nothing renders after &&.
          If isCollapsed is false, the nav renders.
          Pattern: {condition && <Component />} */}
      {!isCollapsed && (
        // Semantic HTML element that wraps navigation links.
        <nav>
          {/* to="/" is the route this link navigates to, equivalent to href in a plain <a> tag. */}
          <NavLink to="/">Dashboard</NavLink>
        </nav>
      )}
    </aside>
  );
};

export default Sidebar;

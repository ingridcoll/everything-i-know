// type is a TypeScript keyword for defining the shape of an object
// Anything called HeaderProps must have exactly these two properties, with exactly these types
type HeaderProps = {
  isDark: boolean;
  onToggleDark: () => void;
  // subtitle?: string; -> Adding a ? after the prop name make sit optional
};

// The props coming into this component must match the HeaderProps shape
// A default value can be assigned in this line, like isDark = false
const Header = ({ isDark, onToggleDark }: HeaderProps) => {
  return (
    <header className="header">
      <span className="header-title">Recipes</span>
      <button onClick={onToggleDark}>
        {isDark ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
  );
};

export default Header;

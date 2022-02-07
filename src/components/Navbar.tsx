type NavItem = {
  text: string;
  href: string;
};

export default function Navbar({
  space,
  juiceboxLink,
  governanceProcessLink,
}: {
  space: string;
  juiceboxLink?: string;
  governanceProcessLink?: string;
}) {
  const navItems: NavItem[] = [
    { text: "Snapshot", href: `https://snapshot.org/#/${space}` },
    juiceboxLink ? { text: "Juicebox", href: juiceboxLink } : undefined,
    governanceProcessLink
      ? {
          text: "Governance process",
          href: governanceProcessLink,
        }
      : undefined,
  ].filter((n): n is NavItem => n !== undefined);

  return (
    <nav>
      <ul
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {navItems.map((n, i) => (
          <li key={n.text} style={{ listStyle: "none" }}>
            <a href={n.href} target="_blank" rel="noopener noreferrer">
              {n.text}
            </a>
            <span style={{ padding: "0 0.7rem" }}>
              {i < navItems.length - 1 && "•"}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}

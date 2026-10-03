import type { ReactNode } from "react";

/** C4 card label: the paper tester strip that hangs under a tall photo (ivory paper, notched tip). */
export default function Blotter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`blotter ${className}`}>{children}</div>;
}

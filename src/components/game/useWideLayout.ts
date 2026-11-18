import { useEffect, useState } from "react";

// Matches the `wide` breakpoint in globals.css (56.25rem = 900px).
const WIDE_QUERY = "(min-width: 56.25rem)";

export function useWideLayout(): boolean | null {
  const [wide, setWide] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return wide;
}

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-steel px-6 py-4 text-center text-xs text-smoke">
      <p>
        Built with Cursor. Verified by Kane CLI.{" "}
        <Link
          href="/about"
          className="text-brass underline underline-offset-4 hover:text-ash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
        >
          How this was tested
        </Link>
      </p>
    </footer>
  );
}

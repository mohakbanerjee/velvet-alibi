import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How this was tested | Velvet Alibi",
  description: "How Velvet Alibi was built with Cursor and checked with Kane CLI.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <p className="font-typewriter text-xs uppercase tracking-[0.25em] text-brass">About this build</p>
      <h1 className="font-display text-4xl font-bold text-ash">How this was tested</h1>

      <p className="leading-relaxed text-smoke">
        Velvet Alibi was written by Cursor&apos;s AI agent from one spec. Every time the agent changes the game code, a
        Cursor hook runs Kane CLI, TestMu AI&apos;s browser testing tool. Kane opens a real Chrome window and clicks
        through the flows written in plain English, such as taking the case, logging clues, and making an accusation.
      </p>

      <ol className="flex list-decimal flex-col gap-3 pl-6 leading-relaxed text-smoke">
        <li>Cursor edits the code under <code className="font-typewriter text-ash">src/</code>.</li>
        <li>A hook marks the change, then runs Kane once the agent finishes its turn.</li>
        <li>If a flow fails, the failure goes into <code className="font-typewriter text-ash">.kane/FAILURES.md</code> and is sent back to Cursor as its next message.</li>
        <li>Cursor fixes the bug and Kane checks again, until every flow passes.</li>
      </ol>

      <p className="leading-relaxed text-smoke">
        The flows and the run history are committed to the repository, so you can read what Kane actually checked.
      </p>

      <p className="text-sm">
        <a
          href="https://github.com/YOUR_GITHUB/velvet-alibi"
          className="text-brass underline underline-offset-4 hover:text-ash"
        >
          Source on GitHub
        </a>
      </p>

      <p>
        <Link href="/" className="font-typewriter text-sm text-ash underline underline-offset-4 hover:text-brass">
          Back to the case
        </Link>
      </p>
    </main>
  );
}

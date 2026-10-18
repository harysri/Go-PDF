import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkBreaks from "remark-breaks";
import rehypeKatex from "rehype-katex";
import { Check, Copy } from "lucide-react";

/*
 * FormatResponse
 * ---------------
 * Renders an arbitrary LLM answer (Markdown + GFM + LaTeX) inside the chat UI.
 *
 * Supported out of the box:
 *  - headings (h1-h6) and subheadings
 *  - paragraphs, bold/italic/strikethrough, inline code
 *  - fenced code blocks with a language label and a copy button
 *  - ordered / unordered / task lists (nested too)
 *  - tables, blockquotes, horizontal rules, links and images
 *  - inline math ($...$ / \(...\)) and display math ($$...$$ / \[...\])
 *  - ```math, ```latex and ```tex fences
 *  - plain text, and non-string payloads (objects/arrays are shown as JSON)
 *
 * Raw HTML from the model is never injected (react-markdown keeps it inert),
 * so a hostile response cannot execute markup in the page.
 */

const remarkPlugins = [remarkGfm, remarkMath, remarkBreaks];
const rehypePlugins = [
  [rehypeKatex, { throwOnError: false, strict: false, output: "htmlAndMathml" }],
];

const MATH_ENVIRONMENT =
  /\\begin\{(align|aligned|equation|gather|gathered|multline|matrix|pmatrix|bmatrix|cases|array)\*?\}[\s\S]*?\\end\{\1\*?\}/g;

/**
 * "It costs $5 and $10" is not math. Escape a dollar sign that introduces an
 * amount so micromark does not pair it with the next dollar sign.
 */
const escapeCurrency = (segment) =>
  segment.replace(
    /(^|[\s([{])\$(\d[\d,]*(?:\.\d+)?)(?=$|[\s.,;:!?)\]}])/g,
    (_, before, amount) => `${before}\\$${amount}`
  );

// Rewrites prose only: code spans and fences must stay byte-for-byte intact.
const transformProse = (segment) => {
  let out = segment;

  // \( ... \) -> $ ... $
  out = out.replace(/\\\(([\s\S]*?)\\\)/g, (_, body) => `$${body.trim()}$`);

  // Bare LaTeX environments (align, cases, matrix, ...) -> display math.
  // Skip environments that already sit inside math delimiters.
  out = out.replace(MATH_ENVIRONMENT, (match, _env, offset, full) => {
    const before = full.slice(0, offset).trimEnd();
    const after = full.slice(offset + match.length).trimStart();
    const alreadyDelimited =
      (before.endsWith("$$") && after.startsWith("$$")) ||
      (before.endsWith("\\[") && after.startsWith("\\]")) ||
      (before.endsWith("$") && after.startsWith("$"));
    return alreadyDelimited ? match : `\n$$\n${match}\n$$\n`;
  });

  // \[ ... \] -> $$ ... $$
  out = out.replace(/\\\[([\s\S]*?)\\\]/g, (_, body) => {
    const trimmed = body.trim();
    const alreadyWrapped = /^\$\$[\s\S]*\$\$$/.test(trimmed);
    return alreadyWrapped ? `\n${trimmed}\n` : `\n$$\n${trimmed}\n$$\n`;
  });

  // remark-math only treats $$ as display math when the markers own their line,
  // so split one-line $$...$$ blocks while keeping list indentation.
  out = out.replace(
    /^([ \t]*)\$\$([^\n$]+?)\$\$[ \t]*$/gm,
    (_, indent, body) => `\n${indent}$$\n${indent}${body.trim()}\n${indent}$$\n`
  );

  return escapeCurrency(out);
};

/**
 * Models mix delimiters: Cohere/GPT style `\( \)` and `\[ \]`, fenced ```math
 * blocks, one-line `$$...$$`, or bare environments. remark-math only
 * understands `$`/`$$`, so normalise everything before parsing.
 */
const prepareMarkdown = (text) => {
  let out = text.replace(/\r\n?/g, "\n");

  // An answer wrapped in a single ```markdown fence should be unwrapped.
  const wholeFence = out.match(/^\s*```(?:markdown|md|gfm)\s*\n([\s\S]*?)\n```\s*$/i);
  if (wholeFence) out = wholeFence[1];

  // ```math / ```latex / ```tex fences -> display math
  out = out.replace(
    /```(?:math|latex|tex)\s*\n([\s\S]*?)```/gi,
    (_, body) => `\n$$\n${body.trim()}\n$$\n`
  );

  // Everything else is only rewritten outside of code fences / inline code.
  return out
    .split(/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]+`)/g)
    .map((part, index) => (index % 2 === 1 ? part : transformProse(part)))
    .join("");
};

const normalizeContent = (content) => {
  if (content === null || content === undefined) return "";
  if (typeof content === "string") return prepareMarkdown(content);
  if (typeof content === "object") {
    try {
      return `\`\`\`json\n${JSON.stringify(content, null, 2)}\n\`\`\``;
    } catch {
      return String(content);
    }
  }
  return String(content);
};

const copyText = async (text) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path (e.g. insecure origin)
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-1000px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
};

function CodeBlock({ code, language }) {
  const [status, setStatus] = useState("idle");
  const timerRef = useRef(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const handleCopy = async () => {
    const copied = await copyText(code);
    setStatus(copied ? "copied" : "error");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus("idle"), 2000);
  };

  const label =
    status === "copied" ? "Copied" : status === "error" ? "Copy failed" : "Copy";

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-ink/10 bg-ink">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-mist">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={status === "copied" ? "Code copied" : "Copy code"}
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium text-cream/80 transition-colors hover:bg-white/10 hover:text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {status === "copied" ? (
            <Check className="h-3.5 w-3.5 text-accent" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span>{label}</span>
        </button>
      </div>
      <pre className="overflow-x-auto px-3 py-3 text-[12.5px] leading-[1.65]">
        <code className="font-mono text-cream">{code}</code>
      </pre>
    </div>
  );
}

const components = {
  pre: ({ children }) => <>{children}</>,

  code: ({ className, children }) => {
    const text = String(children ?? "");
    const languageMatch = /language-([\w+#.-]+)/.exec(className || "");
    const isBlock = Boolean(languageMatch) || text.includes("\n");

    if (isBlock) {
      return (
        <CodeBlock
          code={text.replace(/\n$/, "")}
          language={languageMatch?.[1]?.toLowerCase()}
        />
      );
    }

    return (
      <code className="rounded-md border border-mist/60 bg-paper px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
        {children}
      </code>
    );
  },

  h1: ({ children }) => (
    <h1 className="mb-2 mt-4 text-[17px] font-medium leading-snug tracking-tight text-ink first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-4 text-[15px] font-medium leading-snug tracking-tight text-ink first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-1.5 mt-3 text-sm font-semibold text-ink first:mt-0">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-1 mt-3 text-sm font-medium text-ink first:mt-0">
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className="mb-1 mt-3 text-[13px] font-medium text-ink first:mt-0">
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className="mb-1 mt-3 text-[11px] font-medium uppercase tracking-[0.1em] text-stone first:mt-0">
      {children}
    </h6>
  ),

  p: ({ children }) => (
    <p className="my-2 text-sm leading-relaxed text-body [overflow-wrap:anywhere] first:mt-0 last:mb-0">
      {children}
    </p>
  ),

  strong: ({ children }) => (
    <strong className="font-semibold text-ink">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => (
    <del className="text-muted line-through">{children}</del>
  ),

  ul: ({ children }) => (
    <ul className="my-2 list-disc space-y-1 pl-5 marker:text-stone">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-stone">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-0.5 text-sm leading-relaxed text-body [&>ol]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&>ul]:my-1">
      {children}
    </li>
  ),

  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-2 border-accent bg-paper/60 py-1.5 pl-3 pr-3 text-body [&>p]:my-1">
      {children}
    </blockquote>
  ),

  hr: () => <hr className="my-4 border-0 border-t border-sand" />,

  a: ({ href = "", children }) => {
    const external = /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-2 transition-colors hover:text-stone [overflow-wrap:anywhere]"
      >
        {children}
      </a>
    );
  },

  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || ""}
      loading="lazy"
      className="my-3 max-h-72 w-auto max-w-full rounded-xl border border-sand"
    />
  ),

  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-xl border border-sand">
      <table className="w-full border-collapse text-left text-xs">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-paper">{children}</thead>,
  th: ({ children }) => (
    <th className="whitespace-nowrap px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-t border-sand px-3 py-2 align-top text-body">
      {children}
    </td>
  ),

  input: ({ type, checked }) => {
    if (type !== "checkbox") return null;
    return (
      <input
        type="checkbox"
        checked={Boolean(checked)}
        readOnly
        disabled
        className="mr-1.5 h-3.5 w-3.5 align-middle accent-accent"
      />
    );
  },
};

/**
 * @param {object} props
 * @param {string | object} props.content Raw answer from the API.
 * @param {string} [props.className] Extra classes for the wrapper.
 */
const FormatResponse = ({ content, className = "" }) => {
  const markdown = normalizeContent(content);

  if (!markdown.trim()) return null;

  return (
    <div
      className={`format-response text-sm leading-relaxed text-body [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default FormatResponse;

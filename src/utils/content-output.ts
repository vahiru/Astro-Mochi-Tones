import MarkdownIt from "markdown-it";
import striptags from "striptags";
import { sanitizeAssetUrl, sanitizeLinkUrl } from "./security";

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
});

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
const MODULE_STATEMENT = /^\s*(?:import\s|export\s+(?:default\b|const\b|let\b|var\b|function\b|class\b|\{))/;
const FENCE_MARKER = /^\s*(`{3,}|~{3,})/;

function stripMdxModuleStatements(source: string) {
  const output: string[] = [];
  let fenceCharacter = "";
  let fenceLength = 0;

  for (const line of source.split(/\r?\n/)) {
    const fence = FENCE_MARKER.exec(line);
    if (fence) {
      const marker = fence[1];
      if (!fenceCharacter) {
        fenceCharacter = marker[0];
        fenceLength = marker.length;
      } else if (marker[0] === fenceCharacter && marker.length >= fenceLength) {
        fenceCharacter = "";
        fenceLength = 0;
      }
      output.push(line);
      continue;
    }

    if (!fenceCharacter && MODULE_STATEMENT.test(line)) continue;
    output.push(line);
  }

  return output.join("\n");
}

function readQuotedAttribute(attributes: string, name: string) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`\\b${escapedName}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, "i").exec(attributes);
  return match?.[2]?.trim() ?? "";
}

function escapeMarkdownLabel(value: string) {
  return value.replace(/[\\[\]]/g, "\\$&").replace(/\s+/g, " ").trim();
}

function transformPortableComponents(source: string) {
  return source
    .replace(/<(?:Image|img)\b([\s\S]*?)\/\s*>/gi, (_match, attributes: string) => {
      const sourceUrl = sanitizeAssetUrl(readQuotedAttribute(attributes, "src"));
      if (!sourceUrl) return "";
      const label = escapeMarkdownLabel(
        readQuotedAttribute(attributes, "alt") ||
          readQuotedAttribute(attributes, "desc") ||
          readQuotedAttribute(attributes, "title"),
      );
      return `![${label}](${sourceUrl})`;
    })
    .replace(/<Link\b([\s\S]*?)\/\s*>/gi, (_match, attributes: string) => {
      const href = sanitizeLinkUrl(readQuotedAttribute(attributes, "href"), {
        allowHttp: true,
      });
      if (!href) return "";
      const label = escapeMarkdownLabel(
        readQuotedAttribute(attributes, "title") ||
          readQuotedAttribute(attributes, "desc") ||
          href,
      );
      return `[${label}](${href})`;
    })
    .replace(/<Copy\b([\s\S]*?)\/\s*>/gi, (_match, attributes: string) =>
      readQuotedAttribute(attributes, "text"),
    );
}

function processOutsideFences(source: string) {
  const output: string[] = [];
  let plainText: string[] = [];
  let fenceCharacter = "";
  let fenceLength = 0;

  const flushPlainText = () => {
    if (plainText.length === 0) return;
    output.push(striptags(transformPortableComponents(plainText.join("\n"))));
    plainText = [];
  };

  for (const line of source.split(/\r?\n/)) {
    const fence = FENCE_MARKER.exec(line);
    if (fence) {
      const marker = fence[1];
      const wasInsideFence = Boolean(fenceCharacter);
      if (!wasInsideFence) {
        flushPlainText();
        fenceCharacter = marker[0];
        fenceLength = marker.length;
      }

      output.push(line);

      if (wasInsideFence && marker[0] === fenceCharacter && marker.length >= fenceLength) {
        fenceCharacter = "";
        fenceLength = 0;
      }
      continue;
    }

    if (fenceCharacter) output.push(line);
    else plainText.push(line);
  }

  flushPlainText();
  return output.join("\n");
}

export function normalizeMdxForPortableOutput(source?: string) {
  if (!source) return "";
  return processOutsideFences(stripMdxModuleStatements(source));
}

export function renderPortableMarkdown(source?: string) {
  return markdown.render(normalizeMdxForPortableOutput(source));
}

function collectTokenText(tokens: ReturnType<typeof markdown.parse>) {
  const parts: string[] = [];

  for (const token of tokens) {
    if (token.children) {
      parts.push(collectTokenText(token.children));
      continue;
    }

    if (["text", "code_inline", "code_block", "fence"].includes(token.type)) {
      parts.push(token.content);
    } else if (token.type === "softbreak" || token.type === "hardbreak") {
      parts.push(" ");
    }
  }

  return parts.join(" ");
}

export function markdownToPlainText(source: string | undefined, maxCharacters = 5000) {
  const normalized = normalizeMdxForPortableOutput(source);
  const tokens = markdown.parse(normalized, {});
  const plainText = collectTokenText(tokens)
    .replace(CONTROL_CHARACTERS, " ")
    .replace(/\s+/g, " ")
    .trim();

  return Array.from(plainText).slice(0, maxCharacters).join("");
}

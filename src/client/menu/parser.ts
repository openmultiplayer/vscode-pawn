import * as vscode from "vscode";
import { ColorSegment } from "../dialog/types";
import { parseColorCodes } from "../dialog/parser";
import { PawnMenu } from "./types";

type FunctionCall = {
  args: string[];
  startIndex: number;
  endIndex: number;
  rawText: string;
};

const stringRegex = /"((?:[^"\\]|\\.)*)"/g;

const isEscaped = (text: string, index: number) => {
  let backslashes = 0;
  for (let i = index - 1; i >= 0 && text[i] === "\\"; i--) {
    backslashes++;
  }
  return backslashes % 2 === 1;
};

const processEscapeSequences = (text: string) => {
  return text.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
};

const extractStringContent = (arg: string) => {
  let content = "";
  let match;
  while ((match = stringRegex.exec(arg)) !== null) {
    content += match[1];
  }
  return processEscapeSequences(content);
};

const normalizeIdentifier = (arg: string) => {
  const trimmed = arg.trim();
  const match = trimmed.match(/[A-Za-z_@][\w:@]*/);
  if (!match) return "";
  const raw = match[0];
  const parts = raw.split(":");
  return parts[parts.length - 1] || raw;
};

const findAssignedIdentifier = (text: string, startIndex: number) => {
  let i = startIndex - 1;
  while (i >= 0 && /\s/.test(text[i])) i--;
  if (i < 0 || text[i] !== "=") return "";
  i--;
  while (i >= 0 && /\s/.test(text[i])) i--;
  const end = i;
  while (i >= 0 && /[\w:]/.test(text[i])) i--;
  const raw = text.slice(i + 1, end + 1);
  const parts = raw.split(":");
  return parts[parts.length - 1] || raw;
};

const findFunctionCalls = (text: string, name: string): FunctionCall[] => {
  const calls: FunctionCall[] = [];
  const nameRegex = new RegExp(`\\b${escapeRegex(name)}\\s*\\(`, "g");
  let match;

  while ((match = nameRegex.exec(text)) !== null) {
    const startIndex = match.index;
    const openParenIndex = match.index + match[0].lastIndexOf("(");
    const parsed = parseFunctionArgs(text, openParenIndex + 1);
    if (!parsed) continue;

    const { args, endIndex } = parsed;
    calls.push({
      args,
      startIndex,
      endIndex,
      rawText: text.substring(startIndex, endIndex + 1),
    });
  }

  return calls;
};

const parseFunctionArgs = (text: string, startIndex: number): { args: string[]; endIndex: number } | null => {
  const args: string[] = [];
  let current = "";
  let depth = 0;
  let inString = false;

  for (let i = startIndex; i < text.length; i++) {
    const ch = text[i];

    if (inString) {
      current += ch;
      if (ch === '"' && !isEscaped(text, i)) {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      current += ch;
      continue;
    }

    if (ch === "(") {
      depth++;
      current += ch;
      continue;
    }

    if (ch === ")") {
      if (depth === 0) {
        if (current.trim().length > 0) {
          args.push(current.trim());
        }
        return { args, endIndex: i };
      }
      depth--;
      current += ch;
      continue;
    }

    if (ch === "," && depth === 0) {
      args.push(current.trim());
      current = "";
      continue;
    }

    current += ch;
  }

  return null;
};

const escapeRegex = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const parseMenuTitle = (arg: string) => {
  const title = extractStringContent(arg);
  return parseColorCodes(title);
};

const parseMenuItem = (arg: string) => {
  const text = extractStringContent(arg) || arg.trim();
  return parseColorCodes(text);
};

const parseMenuColumns = (arg: string) => {
  const num = parseInt(arg.replace(/[^\d-]/g, ""), 10);
  if (!isNaN(num) && num > 0) return num;
  return 1;
};

export function parseMenuPreviews(document: vscode.TextDocument): PawnMenu[] {
  const text = document.getText();
  const menus = new Map<string, { title: ColorSegment[]; columns: number; items: ColorSegment[][][] }>();

  for (const call of findFunctionCalls(text, "CreateMenu")) {
    if (call.args.length < 2) continue;
    const menuName = findAssignedIdentifier(text, call.startIndex);
    if (!menuName) continue;
    const title = parseMenuTitle(call.args[0] || '""');
    const columns = parseMenuColumns(call.args[1] || "1");
    const items = Array.from({ length: columns }, () => []);
    menus.set(menuName, { title, columns, items });
  }

  for (const call of findFunctionCalls(text, "AddMenuItem")) {
    if (call.args.length < 3) continue;
    const menuName = normalizeIdentifier(call.args[0]);
    if (!menuName) continue;
    const menu = menus.get(menuName);
    if (!menu) continue;
    const columnIndex = parseInt(call.args[1] || "0", 10);
    if (isNaN(columnIndex) || columnIndex < 0 || columnIndex >= menu.columns) continue;
    menu.items[columnIndex].push(parseMenuItem(call.args[2]));
  }

  const previews: PawnMenu[] = [];
  for (const call of findFunctionCalls(text, "ShowMenuForPlayer")) {
    if (call.args.length < 1) continue;
    const menuName = normalizeIdentifier(call.args[0]);
    if (!menuName) continue;
    const menu = menus.get(menuName);
    if (!menu) continue;
    const startPos = document.positionAt(call.startIndex);
    const endPos = document.positionAt(call.endIndex + 1);
    previews.push({
      menuName,
      title: menu.title,
      columns: menu.columns,
      items: menu.items,
      range: new vscode.Range(startPos, endPos),
      documentUri: document.uri.toString(),
      rawText: call.rawText,
    });
  }

  return previews;
}

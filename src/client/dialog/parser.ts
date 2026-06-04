import * as vscode from "vscode";
import { SAMPDialog, DialogStyle, ColorSegment, DialogListItem, DialogResponseHandler } from "./types";

/**
 * External dialog library function mappings
 * Maps function names to their dialog styles and parameter positions
 */
interface ExternalDialogPattern {
  name: string;
  minArgs: number;
  maxArgs?: number;
  style: DialogStyle | "dynamic"; // 'dynamic' means style is a parameter
  styleParamIndex?: number; // Index of style parameter (0-based)
  captionParamIndex: number;
  infoParamIndex: number;
  button1ParamIndex: number;
  button2ParamIndex: number;
  dialogIdPrefix: string;
}

const nativeDialogFunctionNames = ["ShowPlayerDialog", "ShowPlayerDialog_s", "MDialogFix_ShowPlayerDialog", "MDialog_ShowPlayerDialog"];

const sampAsyncDialogPatterns: ExternalDialogPattern[] = [
  {
    name: "ShowAsyncDialog",
    minArgs: 6,
    maxArgs: 6,
    style: "dynamic",
    styleParamIndex: 1,
    captionParamIndex: 2,
    infoParamIndex: 3,
    button1ParamIndex: 4,
    button2ParamIndex: 5,
    dialogIdPrefix: "AsyncDialog",
  },
  // ShowAsyncDialog_s (same structure)
  {
    name: "ShowAsyncDialog_s",
    minArgs: 6,
    maxArgs: 6,
    style: "dynamic",
    styleParamIndex: 1,
    captionParamIndex: 2,
    infoParamIndex: 3,
    button1ParamIndex: 4,
    button2ParamIndex: 5,
    dialogIdPrefix: "AsyncDialog_s",
  },
  {
    name: "ShowAsyncNumberInputDialog",
    minArgs: 5,
    maxArgs: 5,
    style: DialogStyle.INPUT,
    captionParamIndex: 1,
    infoParamIndex: 2,
    button1ParamIndex: 3,
    button2ParamIndex: 4,
    dialogIdPrefix: "NumberInput",
  },
  {
    name: "ShowAsyncFloatInputDialog",
    minArgs: 5,
    maxArgs: 5,
    style: DialogStyle.INPUT,
    captionParamIndex: 1,
    infoParamIndex: 2,
    button1ParamIndex: 3,
    button2ParamIndex: 4,
    dialogIdPrefix: "FloatInput",
  },
  {
    name: "ShowAsyncStringInputDialog",
    minArgs: 5,
    maxArgs: 5,
    style: DialogStyle.INPUT,
    captionParamIndex: 1,
    infoParamIndex: 2,
    button1ParamIndex: 3,
    button2ParamIndex: 4,
    dialogIdPrefix: "StringInput",
  },
  {
    name: "ShowAsyncPasswordDialog",
    minArgs: 5,
    maxArgs: 5,
    style: DialogStyle.PASSWORD,
    captionParamIndex: 1,
    infoParamIndex: 2,
    button1ParamIndex: 3,
    button2ParamIndex: 4,
    dialogIdPrefix: "Password",
  },
  {
    name: "ShowAsyncConfirmationDialog",
    minArgs: 5,
    maxArgs: 5,
    style: DialogStyle.MSGBOX,
    captionParamIndex: 1,
    infoParamIndex: 2,
    button1ParamIndex: 3,
    button2ParamIndex: 4,
    dialogIdPrefix: "Confirmation",
  },
  {
    name: "ShowAsyncConfirmationDialog",
    minArgs: 4,
    maxArgs: 4,
    style: DialogStyle.MSGBOX,
    captionParamIndex: 1,
    infoParamIndex: 2,
    button1ParamIndex: 3,
    button2ParamIndex: -1,
    dialogIdPrefix: "Confirmation",
  },
  {
    name: "ShowAsyncListitemTextDialog",
    minArgs: 6,
    maxArgs: 6,
    style: "dynamic",
    styleParamIndex: 1,
    captionParamIndex: 2,
    infoParamIndex: 3,
    button1ParamIndex: 4,
    button2ParamIndex: 5,
    dialogIdPrefix: "ListitemText",
  },
  {
    name: "ShowAsyncListitemIndexDialog",
    minArgs: 6,
    maxArgs: 6,
    style: "dynamic",
    styleParamIndex: 1,
    captionParamIndex: 2,
    infoParamIndex: 3,
    button1ParamIndex: 4,
    button2ParamIndex: 5,
    dialogIdPrefix: "ListitemIndex",
  },
  {
    name: "ShowAsyncEntityIndexDialog",
    minArgs: 6,
    maxArgs: 6,
    style: "dynamic",
    styleParamIndex: 1,
    captionParamIndex: 2,
    infoParamIndex: 3,
    button1ParamIndex: 4,
    button2ParamIndex: 5,
    dialogIdPrefix: "EntityIndex",
  },
];

const tdialogsPatterns: ExternalDialogPattern[] = [
  {
    name: "ShowAsyncNumberInputDialog",
    minArgs: 6,
    maxArgs: 6,
    style: DialogStyle.INPUT,
    captionParamIndex: 1,
    infoParamIndex: 2,
    button1ParamIndex: 3,
    button2ParamIndex: 4,
    dialogIdPrefix: "NumberInput",
  },
  {
    name: "ShowAsyncNumberInputDialog_s",
    minArgs: 5,
    maxArgs: 5,
    style: DialogStyle.INPUT,
    captionParamIndex: 1,
    infoParamIndex: 2,
    button1ParamIndex: 3,
    button2ParamIndex: 4,
    dialogIdPrefix: "NumberInput_s",
  },
  {
    name: "ShowAsyncFloatInputDialog",
    minArgs: 6,
    maxArgs: 6,
    style: DialogStyle.INPUT,
    captionParamIndex: 1,
    infoParamIndex: 2,
    button1ParamIndex: 3,
    button2ParamIndex: 4,
    dialogIdPrefix: "FloatInput",
  },
  {
    name: "ShowAsyncFloatInputDialog_s",
    minArgs: 5,
    maxArgs: 5,
    style: DialogStyle.INPUT,
    captionParamIndex: 1,
    infoParamIndex: 2,
    button1ParamIndex: 3,
    button2ParamIndex: 4,
    dialogIdPrefix: "FloatInput_s",
  },
  {
    name: "ShowAsyncStringInputDialog",
    minArgs: 6,
    maxArgs: 6,
    style: DialogStyle.INPUT,
    captionParamIndex: 1,
    infoParamIndex: 2,
    button1ParamIndex: 3,
    button2ParamIndex: 4,
    dialogIdPrefix: "StringInput",
  },
  {
    name: "ShowAsyncStringInputDialog_s",
    minArgs: 5,
    maxArgs: 5,
    style: DialogStyle.INPUT,
    captionParamIndex: 1,
    infoParamIndex: 2,
    button1ParamIndex: 3,
    button2ParamIndex: 4,
    dialogIdPrefix: "StringInput_s",
  },
  {
    name: "ShowAsyncPasswordDialog",
    minArgs: 6,
    maxArgs: 6,
    style: DialogStyle.PASSWORD,
    captionParamIndex: 1,
    infoParamIndex: 2,
    button1ParamIndex: 3,
    button2ParamIndex: 4,
    dialogIdPrefix: "Password",
  },
  {
    name: "ShowAsyncPasswordDialog_s",
    minArgs: 5,
    maxArgs: 5,
    style: DialogStyle.PASSWORD,
    captionParamIndex: 1,
    infoParamIndex: 2,
    button1ParamIndex: 3,
    button2ParamIndex: 4,
    dialogIdPrefix: "Password_s",
  },
  {
    name: "ShowAsyncConfirmationDialog_s",
    minArgs: 5,
    maxArgs: 5,
    style: DialogStyle.MSGBOX,
    captionParamIndex: 1,
    infoParamIndex: 2,
    button1ParamIndex: 3,
    button2ParamIndex: 4,
    dialogIdPrefix: "Confirmation_s",
  },
  {
    name: "ShowAsyncConfirmationDialog_s",
    minArgs: 4,
    maxArgs: 4,
    style: DialogStyle.MSGBOX,
    captionParamIndex: 1,
    infoParamIndex: 2,
    button1ParamIndex: 3,
    button2ParamIndex: -1,
    dialogIdPrefix: "Confirmation_s",
  },
  {
    name: "ShowAsyncListitemTextDialog_s",
    minArgs: 6,
    maxArgs: 6,
    style: "dynamic",
    styleParamIndex: 1,
    captionParamIndex: 2,
    infoParamIndex: 3,
    button1ParamIndex: 4,
    button2ParamIndex: 5,
    dialogIdPrefix: "ListitemText_s",
  },
  {
    name: "ShowAsyncListitemIndexDialog_s",
    minArgs: 6,
    maxArgs: 6,
    style: "dynamic",
    styleParamIndex: 1,
    captionParamIndex: 2,
    infoParamIndex: 3,
    button1ParamIndex: 4,
    button2ParamIndex: 5,
    dialogIdPrefix: "ListitemIndex_s",
  },
  {
    name: "ShowAsyncEntityIndexDialog_s",
    minArgs: 6,
    maxArgs: 6,
    style: "dynamic",
    styleParamIndex: 1,
    captionParamIndex: 2,
    infoParamIndex: 3,
    button1ParamIndex: 4,
    button2ParamIndex: 5,
    dialogIdPrefix: "EntityIndex_s",
  },
  {
    name: "ShowAsyncPaginatedDialog",
    minArgs: 6,
    maxArgs: 8,
    style: "dynamic",
    styleParamIndex: 1,
    captionParamIndex: 3,
    infoParamIndex: 6,
    button1ParamIndex: 4,
    button2ParamIndex: 5,
    dialogIdPrefix: "Paginated",
  },
];

const easyDialogPatterns: ExternalDialogPattern[] = [
  {
    name: "Dialog_Open",
    minArgs: 7,
    style: "dynamic",
    styleParamIndex: 2,
    captionParamIndex: 3,
    infoParamIndex: 4,
    button1ParamIndex: 5,
    button2ParamIndex: 6,
    dialogIdPrefix: "Dialog_Open",
  },
  {
    name: "Dialog_Show",
    minArgs: 7,
    style: "dynamic",
    styleParamIndex: 2,
    captionParamIndex: 3,
    infoParamIndex: 4,
    button1ParamIndex: 5,
    button2ParamIndex: 6,
    dialogIdPrefix: "Dialog_Show",
  },
];

const yDialogPatterns: ExternalDialogPattern[] = [
  {
    name: "Dialog_Show",
    minArgs: 5,
    maxArgs: 6,
    style: "dynamic",
    styleParamIndex: 1,
    captionParamIndex: 2,
    infoParamIndex: 3,
    button1ParamIndex: 4,
    button2ParamIndex: 5,
    dialogIdPrefix: "Dialog_Show",
  },
  {
    name: "Dialog_ShowCallback",
    minArgs: 6,
    maxArgs: 7,
    style: "dynamic",
    styleParamIndex: 2,
    captionParamIndex: 3,
    infoParamIndex: 4,
    button1ParamIndex: 5,
    button2ParamIndex: 6,
    dialogIdPrefix: "Dialog_ShowCallback",
  },
  {
    name: "Dialog_ShowCallbackData",
    minArgs: 6,
    maxArgs: 7,
    style: "dynamic",
    styleParamIndex: 2,
    captionParamIndex: 3,
    infoParamIndex: 4,
    button1ParamIndex: 5,
    button2ParamIndex: 6,
    dialogIdPrefix: "Dialog_ShowCallbackData",
  },
];

const mdialogPatterns: ExternalDialogPattern[] = [
  {
    name: "Dialog_Message",
    minArgs: 4,
    style: DialogStyle.MSGBOX,
    captionParamIndex: 1,
    infoParamIndex: 2,
    button1ParamIndex: 3,
    button2ParamIndex: -1,
    dialogIdPrefix: "Dialog_Message",
  },
  {
    name: "Dialog_MessageEx",
    minArgs: 6,
    style: DialogStyle.MSGBOX,
    captionParamIndex: 2,
    infoParamIndex: 3,
    button1ParamIndex: 4,
    button2ParamIndex: 5,
    dialogIdPrefix: "Dialog_MessageEx",
  },
];

const ppDialogsPatterns: ExternalDialogPattern[] = [
  {
    name: "ShowPlayerAsyncDialog",
    minArgs: 5,
    maxArgs: 6,
    style: "dynamic",
    styleParamIndex: 1,
    captionParamIndex: 2,
    infoParamIndex: 3,
    button1ParamIndex: 4,
    button2ParamIndex: 5,
    dialogIdPrefix: "ShowPlayerAsyncDialog",
  },
  {
    name: "ShowPlayerAsyncDialogStr",
    minArgs: 5,
    maxArgs: 6,
    style: "dynamic",
    styleParamIndex: 1,
    captionParamIndex: 2,
    infoParamIndex: 3,
    button1ParamIndex: 4,
    button2ParamIndex: 5,
    dialogIdPrefix: "ShowPlayerAsyncDialogStr",
  },
  {
    name: "ShowPlayerDialogStr",
    minArgs: 6,
    maxArgs: 7,
    style: "dynamic",
    styleParamIndex: 2,
    captionParamIndex: 3,
    infoParamIndex: 4,
    button1ParamIndex: 5,
    button2ParamIndex: 6,
    dialogIdPrefix: "ShowPlayerDialogStr",
  },
];

const tdwDialogPatterns: ExternalDialogPattern[] = [
  {
    name: "OpenDialog",
    minArgs: 7,
    maxArgs: 7,
    style: "dynamic",
    styleParamIndex: 2,
    captionParamIndex: 3,
    infoParamIndex: 4,
    button1ParamIndex: 5,
    button2ParamIndex: 6,
    dialogIdPrefix: "OpenDialog",
  },
];

const externalDialogPatterns: ExternalDialogPattern[] = [
  ...sampAsyncDialogPatterns,
  ...tdialogsPatterns,
  ...easyDialogPatterns,
  ...yDialogPatterns,
  ...mdialogPatterns,
  ...ppDialogsPatterns,
  ...tdwDialogPatterns,
];

/**
 * Parse ShowPlayerDialog calls from a document
 */
export function parseDialogs(document: vscode.TextDocument): SAMPDialog[] {
  const text = document.getText();
  const dialogs: SAMPDialog[] = [];

  for (const name of nativeDialogFunctionNames) {
    for (const call of findFunctionCalls(text, name)) {
      if (call.args.length < 7) continue;

      const dialogId = call.args[1].trim();
      const styleArg = call.args[2].trim();
      const style = parseDialogStyle(styleArg);
      const formattedText = resolveFormattedDialogText(text, call.args.slice(3, 7), call.args.slice(7), call.startIndex);

      dialogs.push({
        dialogId,
        style,
        caption: formattedText[0],
        info: formattedText[1],
        button1: formattedText[2],
        button2: formattedText[3],
        range: new vscode.Range(document.positionAt(call.startIndex), document.positionAt(call.endIndex + 1)),
        documentUri: document.uri.toString(),
        rawText: call.rawText,
      });
    }
  }

  // Parse external dialog library functions
  const patternsByName = new Map<string, ExternalDialogPattern[]>();
  for (const extPattern of externalDialogPatterns) {
    const list = patternsByName.get(extPattern.name) || [];
    list.push(extPattern);
    patternsByName.set(extPattern.name, list);
  }

  for (const [name, patterns] of patternsByName.entries()) {
    const calls = findFunctionCalls(text, name);
    for (const call of calls) {
      const pattern = patterns.find((p) => {
        if (call.args.length < p.minArgs) return false;
        if (p.maxArgs !== undefined && call.args.length > p.maxArgs) return false;
        return true;
      });
      if (!pattern) continue;

      let style: DialogStyle;
      if (pattern.style === "dynamic" && pattern.styleParamIndex !== undefined) {
        style = parseDialogStyle(call.args[pattern.styleParamIndex] || "");
      } else {
        style = pattern.style as DialogStyle;
      }

      const infoArg =
        pattern.name === "ShowAsyncPaginatedDialog"
          ? getPaginatedDialogInfoArgument(text, call.args[pattern.infoParamIndex] || '""', call.startIndex)
          : call.args[pattern.infoParamIndex] || '""';
      const formattedText = resolveFormattedDialogText(
        text,
        [
          call.args[pattern.captionParamIndex] || '""',
          infoArg,
          call.args[pattern.button1ParamIndex] || '""',
          pattern.button2ParamIndex >= 0 ? call.args[pattern.button2ParamIndex] || '""' : '""',
        ],
        [],
        call.startIndex
      );

      dialogs.push({
        dialogId: `[${pattern.dialogIdPrefix}]`,
        style,
        caption: formattedText[0],
        info: formattedText[1],
        button1: formattedText[2],
        button2: pattern.button2ParamIndex >= 0 ? formattedText[3] : "",
        range: new vscode.Range(document.positionAt(call.startIndex), document.positionAt(call.endIndex + 1)),
        documentUri: document.uri.toString(),
        rawText: call.rawText,
      });
    }
  }

  return dialogs;
}

/**
 * Find OnDialogResponse handlers for a specific dialog ID
 */
export function findDialogResponseHandlers(document: vscode.TextDocument, dialogId: string): DialogResponseHandler[] {
  const text = document.getText();
  const handlers: DialogResponseHandler[] = [];

  // Pattern 1: case DIALOGID: or case dialogid:
  const caseRegex = new RegExp(`case\\s+${escapeRegex(dialogId)}\\s*:`, "gi");
  let match;

  while ((match = caseRegex.exec(text)) !== null) {
    const startPos = document.positionAt(match.index);
    const endPos = document.positionAt(match.index + match[0].length);
    handlers.push({
      dialogId,
      range: new vscode.Range(startPos, endPos),
      documentUri: document.uri.toString(),
    });
  }

  // Pattern 2: if(dialogid == DIALOGID) or if(dialogid == dialogid)
  const ifRegex = new RegExp(`if\\s*\\(\\s*dialogid\\s*==\\s*${escapeRegex(dialogId)}\\s*\\)`, "gi");

  while ((match = ifRegex.exec(text)) !== null) {
    const startPos = document.positionAt(match.index);
    const endPos = document.positionAt(match.index + match[0].length);
    handlers.push({
      dialogId,
      range: new vscode.Range(startPos, endPos),
      documentUri: document.uri.toString(),
    });
  }

  return handlers;
}

/**
 * Find all dialogs across workspace
 */
export async function findAllDialogsInWorkspace(): Promise<SAMPDialog[]> {
  const allDialogs: SAMPDialog[] = [];
  const files = await vscode.workspace.findFiles("**/*.{pwn,inc}", "**/node_modules/**");

  for (const file of files) {
    const document = await vscode.workspace.openTextDocument(file);
    const dialogs = parseDialogs(document);
    allDialogs.push(...dialogs);
  }

  return allDialogs;
}

/**
 * Find listitem handler (case X:) within a dialog's response handler
 */
export function findListItemHandler(document: vscode.TextDocument, dialogId: string, listitem: number): DialogResponseHandler | null {
  const text = document.getText();

  // First find the dialog handler section
  const dialogHandlerRegex = new RegExp(`case\\s+${escapeRegex(dialogId)}\\s*:`, "gi");
  let dialogMatch = dialogHandlerRegex.exec(text);

  if (!dialogMatch) {
    const ifRegex = new RegExp(`if\\s*\\(\\s*dialogid\\s*==\\s*${escapeRegex(dialogId)}\\s*\\)`, "gi");
    dialogMatch = ifRegex.exec(text);
  }

  if (!dialogMatch) return null;

  // Search for case listitem: after the dialog handler
  const afterDialogText = text.substring(dialogMatch.index);
  const listitemRegex = new RegExp(`case\\s+${listitem}\\s*:`, "g");
  const listitemMatch = listitemRegex.exec(afterDialogText);

  if (listitemMatch) {
    const absoluteIndex = dialogMatch.index + listitemMatch.index;
    const startPos = document.positionAt(absoluteIndex);
    const endPos = document.positionAt(absoluteIndex + listitemMatch[0].length);

    return {
      dialogId: `${dialogId}:${listitem}`,
      range: new vscode.Range(startPos, endPos),
      documentUri: document.uri.toString(),
    };
  }

  return null;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Parse dialog style from argument string
 */
function parseDialogStyle(styleArg: string): DialogStyle {
  const trimmed = styleArg.trim();

  // Check for named constants
  if (trimmed.includes("DIALOG_STYLE_MSGBOX") || trimmed === "0") {
    return DialogStyle.MSGBOX;
  }
  if (trimmed.includes("DIALOG_STYLE_INPUT") || trimmed === "1") {
    return DialogStyle.INPUT;
  }
  if (trimmed.includes("DIALOG_STYLE_LIST") || trimmed === "2") {
    return DialogStyle.LIST;
  }
  if (trimmed.includes("DIALOG_STYLE_PASSWORD") || trimmed === "3") {
    return DialogStyle.PASSWORD;
  }
  if (trimmed.includes("DIALOG_STYLE_TABLIST_HEADERS") || trimmed === "5") {
    return DialogStyle.TABLIST_HEADERS;
  }
  if (trimmed.includes("DIALOG_STYLE_TABLIST") || trimmed === "4") {
    return DialogStyle.TABLIST;
  }

  // Try to parse as number
  const num = parseInt(trimmed, 10);
  if (!isNaN(num) && num >= 0 && num <= 5) {
    return num as DialogStyle;
  }

  return DialogStyle.MSGBOX; // Default
}

/**
 * Extract string content from a Pawn string argument
 * Handles concatenation, multi-line with \, etc.
 */
function extractStringContent(arg: string): string {
  let content = "";
  const trimmed = arg.trim();
  const captureAllTopLevel = trimmed.startsWith('"');
  const maxDepth = captureAllTopLevel ? 0 : 1;
  const maxCaptures = captureAllTopLevel ? Infinity : 1;
  let captures = 0;

  let depth = 0;
  let inString = false;
  let literal = "";
  let literalDepth = 0;

  for (let i = 0; i < arg.length; i++) {
    const ch = arg[i];

    if (inString) {
      if (ch === '"' && !isEscaped(arg, i)) {
        inString = false;
        if (literalDepth <= maxDepth && captures < maxCaptures) {
          content += processEscapeSequences(literal);
          captures++;
          if (!captureAllTopLevel) break;
        }
        literal = "";
      } else {
        literal += ch;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      literal = "";
      literalDepth = depth;
      continue;
    }

    if (ch === "(") {
      depth++;
    } else if (ch === ")" && depth > 0) {
      depth--;
    }
  }

  return content;
}

function resolveDialogArgumentText(text: string, arg: string, beforeIndex: number): string {
  const literal = extractStringContent(arg);
  if (literal) return literal;

  const identifier = extractIdentifierArgument(arg);
  if (!identifier) return "";

  const formatCall = findLatestFormatCallForIdentifier(text, identifier, beforeIndex);
  if (!formatCall || formatCall.args.length < 3) return "";

  const template = extractStringContent(formatCall.args[2]);
  if (!template) return "";

  return applyFormatArguments(template, formatCall.args.slice(3)).text;
}

function resolveFormattedDialogText(text: string, stringArgs: string[], formatArgs: string[], beforeIndex: number): [string, string, string, string] {
  const result: string[] = [];
  let formatArgIndex = 0;

  for (const arg of stringArgs) {
    const resolved = resolveDialogArgumentText(text, arg, beforeIndex);
    const formatted = applyFormatArguments(resolved, formatArgs.slice(formatArgIndex));
    result.push(formatted.text);
    formatArgIndex += formatted.usedArgs;
  }

  return [result[0] || "", result[1] || "", result[2] || "", result[3] || ""];
}

function getPaginatedDialogInfoArgument(text: string, headerArg: string, beforeIndex: number): string {
  const parts: string[] = [];
  const header = extractStringContent(headerArg);
  if (header) parts.push(header);

  for (const call of findFunctionCalls(text, "AddPaginatedDialogRow")) {
    if (call.startIndex >= beforeIndex) continue;

    const row = extractStringContent(call.args[1] || "");
    if (row) parts.push(row);
  }

  return JSON.stringify(parts.join(""));
}

function extractIdentifierArgument(arg: string): string | null {
  const trimmed = arg.trim();
  const tagged = trimmed.match(/^(?:[A-Za-z_][A-Za-z0-9_]*:)?([A-Za-z_][A-Za-z0-9_]*)$/);
  return tagged ? tagged[1] : null;
}

function findLatestFormatCallForIdentifier(
  text: string,
  identifier: string,
  beforeIndex: number
): { args: string[]; startIndex: number; endIndex: number; rawText: string } | null {
  let latest: { args: string[]; startIndex: number; endIndex: number; rawText: string } | null = null;

  for (const call of findFunctionCalls(text, "format")) {
    if (call.startIndex >= beforeIndex) continue;
    if (extractIdentifierArgument(call.args[0] || "") !== identifier) continue;
    latest = call;
  }

  return latest;
}

function applyFormatArguments(template: string, args: string[]): { text: string; usedArgs: number } {
  let argIndex = 0;

  const text = template.replace(/%[-+0# ]*\d*(?:\.\d+)?[A-Za-z%]/g, (specifier) => {
    if (specifier.endsWith("%")) return "%";

    const replacement = args[argIndex++];
    if (replacement === undefined) return specifier;

    return cleanPreviewExpression(replacement);
  });

  return { text, usedArgs: argIndex };
}

function cleanPreviewExpression(expression: string): string {
  const literal = extractStringContent(expression);
  if (literal) return literal;

  return expression
    .trim()
    .replace(/^(?:[A-Za-z_][A-Za-z0-9_]*|\{[^}]+\}):\s*/, "")
    .replace(/\s+/g, " ");
}

function isEscaped(text: string, index: number): boolean {
  let backslashes = 0;
  for (let i = index - 1; i >= 0 && text[i] === "\\"; i--) {
    backslashes++;
  }
  return backslashes % 2 === 1;
}

/**
 * Process escape sequences in string content
 */
function processEscapeSequences(text: string): string {
  return text.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}

function findFunctionCalls(text: string, name: string): Array<{ args: string[]; startIndex: number; endIndex: number; rawText: string }> {
  const calls: Array<{ args: string[]; startIndex: number; endIndex: number; rawText: string }> = [];
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
}

function parseFunctionArgs(text: string, startIndex: number): { args: string[]; endIndex: number } | null {
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
}

/**
 * Parse color codes from text and return segments
 */
export function parseColorCodes(text: string): ColorSegment[] {
  const segments: ColorSegment[] = [];
  const colorRegex = /\{([0-9A-Fa-f]{6})\}/g;

  let lastIndex = 0;
  let currentColor: string | null = null;
  let match;

  while ((match = colorRegex.exec(text)) !== null) {
    // Add text before color code with current color
    if (match.index > lastIndex) {
      const textBefore = text.substring(lastIndex, match.index);
      if (textBefore) {
        segments.push({ text: textBefore, color: currentColor });
      }
    }

    // Update current color
    currentColor = "#" + match[1];
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({ text: text.substring(lastIndex), color: currentColor });
  }

  // If no segments, return the whole text as one segment
  if (segments.length === 0 && text) {
    segments.push({ text, color: null });
  }

  return segments;
}

/**
 * Parse list items from dialog info text
 * For LIST, TABLIST, TABLIST_HEADERS styles
 */
export function parseListItems(info: string, style: DialogStyle): DialogListItem[] {
  const lines = info.split("\n");
  const items: DialogListItem[] = [];

  // For TABLIST_HEADERS, first line is headers (skip for list items but include for display)
  const startIndex = 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    if (style === DialogStyle.LIST) {
      // LIST style: each line is a single item
      items.push({
        columns: [parseColorCodes(line)],
        rawText: line,
      });
    } else {
      // TABLIST/TABLIST_HEADERS: split by tabs
      const columns = line.split("\t").map((col) => parseColorCodes(col));
      items.push({
        columns,
        rawText: line,
      });
    }
  }

  return items;
}

/**
 * Parse headers for TABLIST_HEADERS style
 */
export function parseHeaders(info: string): ColorSegment[][] {
  const lines = info.split("\n");
  if (lines.length === 0) return [];

  const headerLine = lines[0];
  return headerLine.split("\t").map((col) => parseColorCodes(col));
}

/**
 * Strip color codes from text (for plain text display)
 */
export function stripColorCodes(text: string): string {
  return text.replace(/\{[0-9A-Fa-f]{6}\}/g, "");
}

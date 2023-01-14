import * as vscode from "vscode";
import { format } from "astyle";

interface RegexCodeFix {
  expr: RegExp;
  replacement: string;
}

const beforeFix: RegexCodeFix[] = [
  { expr: /(^[ \t]+#|^#)/gm, replacement: "//pawnd_tag_hash_$1" },
  { expr: /case\s*(\S*)\s*:\s*(\w+\s*.*;)/gm, replacement: "case $1pawnd_switch_case_signle_line$2" },
  { expr: /extract\s*(.*)->\s*(.*?);/gm, replacement: "pawnd_sscanf_export_$1___$2___" },
  { expr: /([^\s:]):([^\s:])(?=(?:[^"]*"[^"]*")*[^"]*$)/gm, replacement: "$1pawnd_tag_semicolon$2" },
  { expr: /([^\s:])::([^\s:])(?=(?:[^"]*"[^"]*")*[^"]*$)/gm, replacement: "$1pawnd_tag_two_semicolon$2" },
  { expr: /([^\s:])@([^\s:])(?=(?:[^"]*"[^"]*")*[^"]*$)/gm, replacement: "$1pawnd_tag_at$2" },
  { expr: /\bconst\b/gm, replacement: "pawnd_tag_const" },
];

const afterFix: RegexCodeFix[] = [
  { expr: /\bpawnd_tag_const\b/gm, replacement: "const" },
  { expr: /case(.*)pawnd_switch_case_signle_line/gm, replacement: "case$1: " },
  { expr: /pawnd_sscanf_export_(.*?)___(.*?)___/gm, replacement: "export $1-> $2;" },
  { expr: /pawnd_tag_semicolon/gm, replacement: ":" },
  { expr: /pawnd_tag_two_semicolon/gm, replacement: "::" },
  { expr: /pawnd_tag_at/gm, replacement: "@" },
  { expr: />(\s+)\nhook/gm, replacement: ">\nhook" },
  { expr: /static(\s+)const/gm, replacement: "static const" },
  { expr: /\.\s\./gm, replacement: ".." },
  { expr: /^[ \t]+\/\/pawnd_tag_hash_|^\/\/pawnd_tag_hash_/gm, replacement: "" },
  { expr: /CMD(.*):\r\n(.*)\(/gmi, replacement: "CMD$1:$2(" },
  { expr: /CMD(.*):\n(.*)\(/gmi, replacement: "CMD$1:$2(" }
];

const formatPawn = async (content: string) => {
  const brace_style = vscode.workspace.getConfiguration().get("pawn.language.brace_style") as
    | "Allman"
    | "K&R"
    | "Stroustrup"
    | "Google"
    | null;

  for (const key in beforeFix) {
    const element = beforeFix[key];
    content = content.replace(element.expr, element.replacement);
  }

  const style = (() => {
    if (brace_style === "Allman")
      return "allman"
    else if (brace_style === "K&R")
      return "kr"
    else if (brace_style === "Stroustrup")
      return "stroustrup"
    else if (brace_style === "Google")
      return "google"
    else
      return "allman"
  })

  const formatterConfig = [
    `--style=${style()}`,
    "--indent-switches",
    "--indent-preproc-define",
    "--indent-col1-comments",
    "--indent-preproc-block",
    "--pad-comma",
    "--pad-oper",
    "--unpad-paren",
    "--pad-header",
    "--attach-return-type"
  ]

  content = await format(content, formatterConfig.join(" "));
  for (const key in afterFix) {
    const element = afterFix[key];
    content = content.replace(element.expr, element.replacement);
  }
  return content;
};

const PawnDocumentFormattingEditProvider = {
  async provideDocumentFormattingEdits(document: vscode.TextDocument) {
    const edits: vscode.TextEdit[] = [];
    let content = document.getText();
    content = await formatPawn(content);
    const range = new vscode.Range(new vscode.Position(0, 0), document.lineAt(document.lineCount - 1).range.end);
    edits.push(new vscode.TextEdit(range, content));
    return edits;
  },
  async provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range) {
    const edits: vscode.TextEdit[] = [];
    let content = document.getText(range);
    content = await formatPawn(content);
    edits.push(new vscode.TextEdit(range, content));
    return edits;
  },
};

export default PawnDocumentFormattingEditProvider;

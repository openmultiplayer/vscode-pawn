import * as vscode from "vscode";
import * as jsbeautifier from "js-beautify";

interface RegexCodeFix {
  expr: RegExp;
  replacement: string;
}

const beforeFix: RegexCodeFix[] = [
  { expr: /(^[ \t]+#|^#)/gm, replacement: "//pawnd_tag_hash_$1" },
  { expr: /([^\s:]):([^\s:])(?=(?:[^"]*"[^"]*")*[^"]*$)/gm, replacement: "$1pawnd_tag_semicolon$2" },
  { expr: /([^\s:])::([^\s:])(?=(?:[^"]*"[^"]*")*[^"]*$)/gm, replacement: "$1pawnd_tag_two_semicolon$2" },
  { expr: /([^\s:]):: +([^\s:])(?=(?:[^"]*"[^"]*")*[^"]*$)/gm, replacement: "$1pawnd_tag_four_semicolon$2" },
  { expr: /([\w^\s:]): +([^\s:])(?=(?:[^"]*"[^"]*")*[^"]*$)/gm, replacement: "$1pawnd_tag_three_semicolon$2" },
  { expr: /([^\s:])@([^\s:])(?=(?:[^"]*"[^"]*")*[^"]*$)/gm, replacement: "$1pawnd_tag_at$2" },
  { expr: /\bconst\b/gm, replacement: "pawnd_tag_const" },
];

const afterFix: RegexCodeFix[] = [
  { expr: /\bpawnd_tag_const\b/gm, replacement: "const" },
  { expr: /pawnd_tag_semicolon/gm, replacement: ":" },
  { expr: /pawnd_tag_two_semicolon/gm, replacement: "::" },
  { expr: /pawnd_tag_three_semicolon/gm, replacement: ": " },
  { expr: /pawnd_tag_four_semicolon/gm, replacement: ":: " },
  { expr: /pawnd_tag_at/gm, replacement: "@" },
  // { expr: /(^if +\(|^[ \t]+if +\()(?=(?:[^"]*"[^"]*")*[^"]*$)/gm, replacement: "if(" },
  { expr: />(\s+)\nhook/gm, replacement: ">\nhook" },
  { expr: /static(\s+)const/gm, replacement: "static const" },
  { expr: /\.\s\./gm, replacement: ".." },
  { expr: /^[ \t]+\/\/pawnd_tag_hash_|^\/\/pawnd_tag_hash_/gm, replacement: "" },
];

const formatPawn = (content: string) => {
  const brace_style = vscode.workspace.getConfiguration().get("pawn.language.brace_style") as
    | "collapse"
    | "expand"
    | "end-expand"
    | "none"
    | "preserve-inline"
    | null;
  for (const key in beforeFix) {
    const element = beforeFix[key];
    content = content.replace(element.expr, element.replacement);
  }
  content = jsbeautifier.js_beautify(content, {
    brace_style: brace_style === null ? undefined : brace_style,
  });
  for (const key in afterFix) {
    const element = afterFix[key];
    content = content.replace(element.expr, element.replacement);
  }
  return content;
};

const PawnDocumentFormattingEditProvider = {
  provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.ProviderResult<Array<vscode.TextEdit>> {
    const edits: vscode.TextEdit[] = [];
    let content = document.getText();
    content = formatPawn(content);
    const range = new vscode.Range(new vscode.Position(0, 0), document.lineAt(document.lineCount - 1).range.end);
    edits.push(new vscode.TextEdit(range, content));
    return edits;
  },
  provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range): vscode.ProviderResult<Array<vscode.TextEdit>> {
    const edits: vscode.TextEdit[] = [];
    let content = document.getText(range);
    content = formatPawn(content);
    edits.push(new vscode.TextEdit(range, content));
    return edits;
  },
};

export default PawnDocumentFormattingEditProvider;

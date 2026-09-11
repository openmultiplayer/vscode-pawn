import * as vscode from "vscode";
import { format } from "astyle";

interface RegexCodeFix {
  expr: RegExp;
  replacement: string;
}

const beforeFix: RegexCodeFix[] = [
  { expr: /(^[ \t]+#|^#)/gm, replacement: "//pawnd_tag_hash_$1" },
  { expr: /\b(task|ptask|timer)\s+([A-Za-z0-9_]+)\s*\[\s*([0-9]+)\s*\]\s*\((.*?)\)/gm, replacement: "void pawnd_ysi_timer_$1___$2___$3___$4()" },
  { expr: /\b(YCMD|CMD|COMMAND|flags)\s*:\s*([A-Za-z0-9_]+)\s*\((.*?)\)/gm, replacement: "void pawnd_cmd_$1___$2___$3()" },
  { expr: /\bINI_Load\s*:\s*([A-Za-z0-9_]+)\s*\[\s*([A-Za-z0-9_]+)\s*\]/gm, replacement: "void pawnd_ini_load_$1___$2" },
  { expr: /\bhook\s+(?:stock\s+|public\s+)?([A-Za-z0-9_]+)\s*\((.*?)\)/gm, replacement: "void pawnd_ysi_hook_$1___$2()" },
  { expr: /\f|\v|\t*(new|static|const)\s*\n\s*((.|\s)*?)\s*;/gm, replacement: "$1 $2;" },
  { expr: /case\s*(\S*)\s*:\s*(\w+\s*.*;)/gm, replacement: "case $1pawnd_switch_case_signle_line$2" },
  { expr: /extract\s*(.*)->\s*(.*?);/gm, replacement: "pawnd_sscanf_extract_$1___$2___" },
  { expr: /([^\s:]):([^\s:])(?=(?:[^"]*"[^"]*")*[^"]*$)/gm, replacement: "$1pawnd_tag_semicolon$2" },
  { expr: /([^\s:])::([^\s:])(?=(?:[^"]*"[^"]*")*[^"]*$)/gm, replacement: "$1pawnd_tag_two_semicolon$2" },
  { expr: /([^\s:])@([^\s:])(?=(?:[^"]*"[^"]*")*[^"]*$)/gm, replacement: "$1pawnd_tag_at$2" },
  { expr: /\bconst\b/gm, replacement: "pawnd_tag_const" },
];

const afterFix: RegexCodeFix[] = [
  { expr: /\bpawnd_tag_const\b/gm, replacement: "const" },
  { expr: /void pawnd_ysi_timer_(task|ptask|timer)___([A-Za-z0-9_]+)___([0-9]+)___\(\)/gm, replacement: "$1 $2[$3]()" },
  { expr: /void pawnd_ysi_timer_(task|ptask|timer)___([A-Za-z0-9_]+)___([0-9]+)___(.*?)\(\)/gm, replacement: "$1 $2[$3]($4)" },
  { expr: /void pawnd_cmd_(YCMD|CMD|COMMAND|flags)___([A-Za-z0-9_]+)___\(\)/gm, replacement: "$1:$2()" },
  { expr: /void pawnd_cmd_(YCMD|CMD|COMMAND|flags)___([A-Za-z0-9_]+)___(.*?)\(\)/gm, replacement: "$1:$2($3)" },
  { expr: /void pawnd_ini_load_([A-Za-z0-9_]+)___([A-Za-z0-9_]+)/gm, replacement: "INI_Load:$1[$2]" },
  { expr: /void pawnd_ysi_hook_([A-Za-z0-9_]+)___\(\)/gm, replacement: "hook $1()" },
  { expr: /void pawnd_ysi_hook_([A-Za-z0-9_]+)___(.*?)\(\)/gm, replacement: "hook $1($2)" },
  { expr: /case(.*)pawnd_switch_case_signle_line/gm, replacement: "case$1: " },
  { expr: /pawnd_sscanf_extract_(.*?)___(.*?)___/gm, replacement: "extract $1-> $2;" },
  { expr: /pawnd_tag_semicolon/gm, replacement: ":" },
  { expr: /pawnd_tag_two_semicolon/gm, replacement: "::" },
  { expr: /pawnd_tag_at/gm, replacement: "@" },
  { expr: />(\s+)\nhook/gm, replacement: ">\nhook" },
  { expr: /static(\s+)const/gm, replacement: "static const" },
  { expr: /\.\s\./gm, replacement: ".." },
  { expr: /^[ \t]+\/\/pawnd_tag_hash_|^\/\/pawnd_tag_hash_/gm, replacement: "" },
  { expr: /(CMD|YCMD|COMMAND|flags)(.*):\r?\n\s*(.*)\(/gim, replacement: "$1$2:$3(" },
  { expr: /(static|const|new) (.*?):\s+/gm, replacement: "$1 $2:" },
];

const formatPawn = async (content: string) => {
  const config = vscode.workspace.getConfiguration();
  const brace_style = config.get("pawn.language.brace_style") as
    | "Allman"
    | "K&R"
    | "Stroustrup"
    | "Google"
    | null;

  const tabIndent = config.get("pawn.formatter.tabIndent", true);
  const indentSize = config.get("pawn.formatter.indentSize", 4);
  const indentFlag = tabIndent ? "--indent=tab" : `--indent=spaces=${indentSize}`;

  for (const key in beforeFix) {
    const element = beforeFix[key];
    content = content.replace(element.expr, element.replacement);
  }

  const style = () => {
    if (brace_style === "Allman") return "allman";
    else if (brace_style === "K&R") return "kr";
    else if (brace_style === "Stroustrup") return "stroustrup";
    else if (brace_style === "Google") return "google";
    else return "allman";
  };

  const formatterConfig = [
    `--style=${style()}`,
    indentFlag,
    "--indent-switches",
    "--indent-preproc-define",
    "--indent-col1-comments",
    "--indent-preproc-block",
    "--indent-after-parens",
    "--pad-comma",
    "--pad-oper",
    "--unpad-paren",
    "--pad-header",
    "--attach-return-type",
  ];

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

import * as vscode from "vscode";

export class PawnCodeActionProvider implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
    vscode.CodeActionKind.RefactorExtract,
    vscode.CodeActionKind.SourceOrganizeImports,
  ];

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    _context: vscode.CodeActionContext
  ): vscode.CodeAction[] {
    const actions: vscode.CodeAction[] = [];

    // 1. Extract to Macro (#define) Action
    const selectedText = document.getText(range).trim();
    if (selectedText.length > 0 && !selectedText.includes("\n")) {
      const extractAction = new vscode.CodeAction("Extract to #define macro", vscode.CodeActionKind.RefactorExtract);
      extractAction.command = {
        command: "pawn-development.extractMacro",
        title: "Extract to #define macro",
        arguments: [document, range, selectedText],
      };
      actions.push(extractAction);
    }

    // 2. Unused Includes Detection & Cleanup Action
    const unusedIncludeActions = this.detectUnusedIncludes(document, range);
    actions.push(...unusedIncludeActions);

    // 3. Rename Local Symbol QuickFix Action
    const wordRange = document.getWordRangeAtPosition(range.start);
    if (wordRange) {
      const word = document.getText(wordRange);
      if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(word)) {
        const localRenameAction = new vscode.CodeAction(
          `Rename local symbol '${word}' in function scope`,
          vscode.CodeActionKind.RefactorRewrite
        );
        localRenameAction.command = {
          command: "editor.action.rename",
          title: "Rename Symbol",
        };
        actions.push(localRenameAction);
      }
    }

    return actions;
  }

  private detectUnusedIncludes(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] {
    const actions: vscode.CodeAction[] = [];
    const fullText = document.getText();
    const lines = fullText.split(/\r?\n/);
    const includeRegex = /^\s*#include\s+[<"]([^>"]+)[>"]/;

    const currentLine = document.lineAt(range.start.line);
    const currentMatch = currentLine.text.match(includeRegex);

    // If cursor is specifically on an include line
    if (currentMatch) {
      const incName = currentMatch[1];
      const baseName = incName.replace(/\.[^/.]+$/, "").split("/").pop() || incName;

      // Check if baseName or symbols from it are used elsewhere in text (ignoring this line)
      const otherLines = lines.filter((_, idx) => idx !== currentLine.lineNumber).join("\n");
      const isReferenced = new RegExp(`\\b${baseName}\\b`, "i").test(otherLines);

      if (!isReferenced) {
        const removeAction = new vscode.CodeAction(
          `Remove unused include: <${incName}>`,
          vscode.CodeActionKind.QuickFix
        );
        const edit = new vscode.WorkspaceEdit();
        // Delete the include line including newline
        edit.delete(document.uri, currentLine.rangeIncludingLineBreak);
        removeAction.edit = edit;
        actions.push(removeAction);
      }
    }

    // "Clean all unused includes" action
    const cleanAllAction = new vscode.CodeAction(
      "Clean all unused include directives",
      vscode.CodeActionKind.SourceOrganizeImports
    );
    cleanAllAction.command = {
      command: "pawn-development.cleanIncludes",
      title: "Clean all unused includes",
      arguments: [document],
    };
    actions.push(cleanAllAction);

    return actions;
  }
}

export class PawnRenameProvider implements vscode.RenameProvider {
  public prepareRename(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Range | { range: vscode.Range; placeholder: string }> {
    const range = document.getWordRangeAtPosition(position);
    if (!range) {
      throw new Error("You cannot rename this element.");
    }
    const text = document.getText(range);
    // Ignore keywords
    const keywords = ["new", "static", "stock", "public", "forward", "native", "if", "else", "for", "while", "return", "enum", "case", "switch"];
    if (keywords.includes(text)) {
      throw new Error("Cannot rename language keywords.");
    }
    return { range, placeholder: text };
  }

  public provideRenameEdits(
    document: vscode.TextDocument,
    position: vscode.Position,
    newName: string,
    _token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.WorkspaceEdit> {
    const range = document.getWordRangeAtPosition(position);
    if (!range) return null;

    const oldName = document.getText(range);
    const edit = new vscode.WorkspaceEdit();
    const fullText = document.getText();

    // Check if symbol is a local variable inside a function body
    const funcScope = this.findEnclosingFunctionScope(document, position);
    const scopeText = funcScope ? document.getText(funcScope) : fullText;
    const scopeOffset = funcScope ? document.offsetAt(funcScope.start) : 0;

    const regex = new RegExp(`\\b${oldName}\\b`, "g");
    let match: RegExpExecArray | null;

    while ((match = regex.exec(scopeText)) !== null) {
      const matchPos = document.positionAt(scopeOffset + match.index);
      const matchRange = new vscode.Range(matchPos, matchPos.translate(0, oldName.length));
      edit.replace(document.uri, matchRange, newName);
    }

    return edit;
  }

  private findEnclosingFunctionScope(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.Range | undefined {
    const curOffset = document.offsetAt(position);
    const text = document.getText();

    // Find function boundaries by tracking { }
    let openBrace = -1;
    let depth = 0;

    for (let i = curOffset; i >= 0; i--) {
      if (text[i] === "}") depth++;
      else if (text[i] === "{") {
        if (depth > 0) {
          depth--;
        } else {
          openBrace = i;
          break;
        }
      }
    }

    if (openBrace === -1) return undefined;

    // Find matching closing brace
    let closeBrace = -1;
    depth = 0;
    for (let i = openBrace; i < text.length; i++) {
      if (text[i] === "{") depth++;
      else if (text[i] === "}") {
        depth--;
        if (depth === 0) {
          closeBrace = i;
          break;
        }
      }
    }

    if (closeBrace === -1) return undefined;

    return new vscode.Range(document.positionAt(openBrace), document.positionAt(closeBrace + 1));
  }
}

/**
 * Interactive handler for "Extract to #define macro"
 */
export async function handleExtractMacro(
  document: vscode.TextDocument,
  range: vscode.Range,
  selectedText: string
) {
  // Suggest a default macro name (e.g. from literal text or MACRO_CONST)
  let defaultName = "NEW_MACRO";
  const sanitized = selectedText
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();

  if (sanitized.length > 0 && /^[A-Z_][A-Z0-9_]*$/.test(sanitized)) {
    defaultName = sanitized.startsWith("COLOR_") || sanitized.startsWith("MAX_") ? sanitized : `CONST_${sanitized}`;
  }

  const macroName = await vscode.window.showInputBox({
    prompt: "Enter name for new #define macro",
    value: defaultName,
    validateInput: (val) => {
      if (!val || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(val)) {
        return "Macro name must be a valid Pawn identifier (e.g. MAX_PLAYERS, COLOR_RED)";
      }
      return null;
    },
  });

  if (!macroName) return;

  const edit = new vscode.WorkspaceEdit();

  // Find optimal place to insert #define: after existing #defines or #includes
  let insertLine = 0;
  for (let i = 0; i < document.lineCount; i++) {
    const lineText = document.lineAt(i).text.trim();
    if (lineText.startsWith("#include") || lineText.startsWith("#define")) {
      insertLine = i + 1;
    }
  }

  // 1. Insert define directive
  const defineDirective = `#define ${macroName} ${selectedText}\n`;
  edit.insert(document.uri, new vscode.Position(insertLine, 0), defineDirective);

  // 2. Replace selected text with macroName
  edit.replace(document.uri, range, macroName);

  await vscode.workspace.applyEdit(edit);
  vscode.window.showInformationMessage(`Extracted macro: #define ${macroName} ${selectedText}`);
}

/**
 * Interactive handler for "Clean all unused includes"
 */
export async function handleCleanIncludes(document: vscode.TextDocument) {
  const lines = document.getText().split(/\r?\n/);
  const includeRegex = /^\s*#include\s+[<"]([^>"]+)[>"]/;
  const edit = new vscode.WorkspaceEdit();
  let removedCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(includeRegex);
    if (match) {
      const inc = match[1];
      const baseName = inc.replace(/\.[^/.]+$/, "").split("/").pop() || inc;
      // Core libraries that should never be removed automatically
      const coreLibs = ["a_samp", "open.mp", "YSI"];
      if (coreLibs.some((core) => inc.includes(core))) continue;

      // Check if used in remainder of file
      const otherLines = lines.filter((_, idx) => idx !== i).join("\n");
      const isUsed = new RegExp(`\\b${baseName}\\b`, "i").test(otherLines);

      if (!isUsed) {
        edit.delete(document.uri, document.lineAt(i).rangeIncludingLineBreak);
        removedCount++;
      }
    }
  }

  if (removedCount > 0) {
    await vscode.workspace.applyEdit(edit);
    vscode.window.showInformationMessage(`Cleaned ${removedCount} unused include directive(s).`);
  } else {
    vscode.window.showInformationMessage("All include directives are in use.");
  }
}

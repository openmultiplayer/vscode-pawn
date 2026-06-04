import * as vscode from "vscode";
import { parseDialogs } from "./parser";
import { getDialogStyleName } from "./types";

export class DialogCodeLensProvider implements vscode.CodeLensProvider {
  private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

  constructor() {
    // Refresh CodeLenses when document changes
    vscode.workspace.onDidChangeTextDocument(() => {
      this._onDidChangeCodeLenses.fire();
    });
  }

  public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
    const codeLenses: vscode.CodeLens[] = [];
    const dialogs = parseDialogs(document);

    for (const dialog of dialogs) {
      const codeLens = new vscode.CodeLens(dialog.range, {
        title: `$(eye) Preview Dialog (${getDialogStyleName(dialog.style)})`,
        command: "pawn-development.previewDialog",
        arguments: [dialog],
      });
      codeLenses.push(codeLens);
    }

    return codeLenses;
  }

  public resolveCodeLens(codeLens: vscode.CodeLens): vscode.CodeLens {
    return codeLens;
  }

  /**
   * Trigger a refresh of the CodeLenses
   */
  public refresh(): void {
    this._onDidChangeCodeLenses.fire();
  }
}

import * as vscode from "vscode";
import { parseMenuPreviews } from "./parser";

export class MenuCodeLensProvider implements vscode.CodeLensProvider {
  private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

  constructor() {
    vscode.workspace.onDidChangeTextDocument(() => {
      this._onDidChangeCodeLenses.fire();
    });
  }

  public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
    const codeLenses: vscode.CodeLens[] = [];
    const menus = parseMenuPreviews(document);

    for (const menu of menus) {
      const codeLens = new vscode.CodeLens(menu.range, {
        title: "$(eye) Preview Menu",
        command: "pawn-development.previewMenu",
        arguments: [menu],
      });
      codeLenses.push(codeLens);
    }

    return codeLenses;
  }

  public resolveCodeLens(codeLens: vscode.CodeLens): vscode.CodeLens {
    return codeLens;
  }

  public refresh(): void {
    this._onDidChangeCodeLenses.fire();
  }
}

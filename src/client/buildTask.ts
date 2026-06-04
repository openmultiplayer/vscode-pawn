import * as vscode from "vscode";
import * as fs from "fs";
import { task } from "./task";

const noWorkSpaceError = "you can use this command inside your workspace only";

const BuildTaskHandler = async function () {
  let workspacePath = undefined;
  if (vscode.workspace.workspaceFolders === undefined) return vscode.window.showInformationMessage(noWorkSpaceError);
  if (vscode.workspace.workspaceFolders.length === 0) return vscode.window.showInformationMessage(noWorkSpaceError);
  if (vscode.workspace.workspaceFolders.length === 1) {
    workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
  }

  if (vscode.workspace.workspaceFolders.length > 1) {
    const result = await vscode.window.showWorkspaceFolderPick();
    if (result === undefined) return;
    workspacePath = result.uri.fsPath;
  }

  if (workspacePath === undefined) return vscode.window.showInformationMessage(noWorkSpaceError);

  if (!fs.existsSync(workspacePath + "/.vscode")) {
    fs.mkdirSync(workspacePath + "/.vscode");
    vscode.window.showInformationMessage("Created .vscode");
  }

  if (!fs.existsSync(workspacePath + "/.vscode/tasks.json")) {
    fs.writeFileSync(workspacePath + "/.vscode/tasks.json", task);
    vscode.window.showInformationMessage("Successfully written tasks.json");
  } else {
    vscode.window.showInformationMessage("tasks.json already exists, aborting task");
  }

  vscode.workspace.openTextDocument(workspacePath + "/.vscode/tasks.json").then(
    (a: vscode.TextDocument) => {
      vscode.window.showTextDocument(a, 1, false);
    },
    (error: Error) => {
      console.error(error);
    },
  );
};

export default BuildTaskHandler;

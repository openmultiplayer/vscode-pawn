import * as vscode from "vscode";
import * as fs from "fs";
import { initSnippetCollector } from "./commonFunc";

const noWorkSpaceError = "You can only use this command in your workspace";

const writeonfile = `// Usage: Right click on a file or a folder in your workspace to add into .pawnignore
// Explanation: This way you'll tell extension not to parse these files for auto-complete and intellisense.  
// If you are having problems, please report issue at https://github.com/openmultiplayer/vscode-pawn/issues
`;

export const InitPawnIgnore = async function () {
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

  if (!fs.existsSync(workspacePath + "/.pawnignore")) {
    fs.writeFileSync(workspacePath + "/.pawnignore", writeonfile);
    vscode.window.showInformationMessage("Created file .pawnignore");
    vscode.workspace.openTextDocument(workspacePath + "/.pawnignore").then(
      (a: vscode.TextDocument) => {
        vscode.window.showTextDocument(a, 1, false);
      },
      (error: Error) => {
        console.error(error);
      }
    );
  } else {
    vscode.window.showInformationMessage(".pawnignore already exists, aborting task");
  }
};

export const addToPawnIgnore = async function (selectedFile: vscode.Uri) {
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

  const filePath = selectedFile.path.substr(workspacePath.length + 2, selectedFile.path.length);
  if (!filePath && filePath.length < 1) return;

  if (!fs.existsSync(workspacePath + "/.pawnignore")) {
    fs.writeFileSync(workspacePath + "/.pawnignore", writeonfile);
    vscode.window.showInformationMessage("Created file .pawnignore");

    vscode.workspace.openTextDocument(workspacePath + "/.pawnignore").then(
      (a: vscode.TextDocument) => {
        vscode.window.showTextDocument(a, 1, false);
      },
      (error: Error) => {
        console.error(error);
      }
    );
  }

  const data = fs.readFileSync(workspacePath + "/.pawnignore", { encoding: "utf-8" });
  if (data.indexOf(filePath) !== -1) return vscode.window.showInformationMessage(`${filePath} already exist in .pawnignore`);

  fs.appendFile(workspacePath + "/.pawnignore", `\n${filePath}`, function (err) {
    if (err) return vscode.window.showInformationMessage(`Unable to add ${filePath} to .pawnignore`);
    initSnippetCollector(true);
    return vscode.window.showInformationMessage(`Added ${filePath} to .pawnignore`);
  });
};

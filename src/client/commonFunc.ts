import * as vscode from "vscode";
import { client } from "./extension";

export const initSnippetCollector = async (reset = false) => {
  const filesPwn = await vscode.workspace.findFiles("**/*.pwn");
  for (const key in filesPwn) {
    const element = filesPwn[key];
    (await vscode.workspace.openTextDocument(element)).getText();
  }

  const filesPawn = await vscode.workspace.findFiles("**/*.pawn");
  for (const key in filesPawn) {
    const element = filesPawn[key];
    (await vscode.workspace.openTextDocument(element)).getText();
  }

  const filesInc = await vscode.workspace.findFiles("**/*.inc");
  for (const key in filesInc) {
    const element = filesInc[key];
    (await vscode.workspace.openTextDocument(element)).getText();
  }

  if (client !== undefined && reset) client.sendNotification("revalidateAllOpenedDocuments");
};

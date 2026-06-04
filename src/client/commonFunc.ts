import * as vscode from "vscode";
import { client } from "./extension";

export const initSnippetCollector = async (reset = false) => {
  try {
    const files = await vscode.workspace.findFiles("**/*.{pwn,pawn,inc}", "**/node_modules/**", 500);

    for (const file of files) {
      try {
        const doc = await vscode.workspace.openTextDocument(file);
        doc.getText();
      } catch {
        // Skip files that can't be opened (e.g., permission issues, network errors)
      }
    }

    if (client !== undefined && reset) {
      client.sendNotification("revalidateAllOpenedDocuments");
    }
  } catch (error) {
    console.error("Error initializing snippet collector:", error);
  }
};

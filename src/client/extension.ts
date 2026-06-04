import BuildTaskHandler from "./buildTask";
import PawnDocumentFormattingEditProvider from "./formatter";
import * as vscode from "vscode";
import { initSnippetCollector } from "./commonFunc";
import path = require("path");
import { LanguageClient, LanguageClientOptions, ServerOptions, State, TransportKind } from "vscode-languageclient/node";
import { addToPawnIgnore, InitPawnIgnore } from "./whitelistedpaths";
import PawnFoldingProvider from "./FoldingProvider";
import { DialogCodeLensProvider } from "./dialog/codeLensProvider";
import { DialogPreviewPanel } from "./dialog/previewPanel";
import { SAMPDialog } from "./dialog/types";
import { parseDialogs, findDialogResponseHandlers, findListItemHandler } from "./dialog/parser";
import { MenuCodeLensProvider } from "./menu/codeLensProvider";
import { MenuPreviewPanel } from "./menu/previewPanel";
import { PawnMenu } from "./menu/types";
import { parseMenuPreviews } from "./menu/parser";

// Prevent astyle process.abort hook from crashing the extension host
// when unhandled stuff occur from other extensions (e.g., Git)
process.on("unhandledRejection", (reason) => {
  console.error("Pawn extension caught unhandled rejection:", reason);
});

export let client: LanguageClient;

export async function activate(context: vscode.ExtensionContext) {
  // The server is implemented in node
  context.subscriptions.push(vscode.commands.registerCommand("pawn-development.initTask", BuildTaskHandler));
  context.subscriptions.push(vscode.commands.registerCommand("pawn-development.initScanDir", InitPawnIgnore));
  context.subscriptions.push(vscode.commands.registerCommand("pawn-development.pawnignore", addToPawnIgnore));
  context.subscriptions.push(
    vscode.commands.registerCommand("pawn-development.reloadDefs", () => {
      initSnippetCollector(true);
    }),
  );
  context.subscriptions.push(
    vscode.languages.registerFoldingRangeProvider({ scheme: "file", language: "pawn" }, new PawnFoldingProvider()),
  );

  // Register Dialog Preview CodeLens provider
  const dialogCodeLensProvider = new DialogCodeLensProvider();
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      [
        { scheme: "file", language: "pawn" },
        { scheme: "file", pattern: "**/*.pwn" },
        { scheme: "file", pattern: "**/*.inc" },
      ],
      dialogCodeLensProvider,
    ),
  );

  // Register Menu Preview CodeLens provider
  const menuCodeLensProvider = new MenuCodeLensProvider();
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      [
        { scheme: "file", language: "pawn" },
        { scheme: "file", pattern: "**/*.pwn" },
        { scheme: "file", pattern: "**/*.inc" },
      ],
      menuCodeLensProvider,
    ),
  );

  // Register Dialog Preview command
  context.subscriptions.push(
    vscode.commands.registerCommand("pawn-development.previewDialog", async (dialog?: SAMPDialog) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No active editor to preview dialogs.");
        return;
      }

      const allDialogs = parseDialogs(editor.document);

      if (!dialog) {
        if (allDialogs.length === 0) {
          vscode.window.showInformationMessage("No dialogs found in the current file.");
          return;
        }

        if (allDialogs.length === 1) {
          dialog = allDialogs[0];
        } else {
          const items = allDialogs.map((d, i) => ({
            label: `${i + 1}. ${d.caption || "[No title]"}`,
            description: `${d.style} • line ${d.range.start.line + 1}`,
            dialog: d,
          }));
          const picked = await vscode.window.showQuickPick(items, { placeHolder: "Select a dialog to preview" });
          if (!picked) return;
          dialog = picked.dialog;
        }
      }

      DialogPreviewPanel.createOrShow(context.extensionUri, dialog, allDialogs);
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("pawn-development.previewMenu", async (menu?: PawnMenu) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No active editor to preview menus.");
        return;
      }

      const allMenus = parseMenuPreviews(editor.document);

      if (!menu) {
        if (allMenus.length === 0) {
          vscode.window.showInformationMessage("No menus found in the current file.");
          return;
        }

        if (allMenus.length === 1) {
          menu = allMenus[0];
        } else {
          const items = allMenus.map((m, i) => ({
            label: `${i + 1}. ${m.menuName}`,
            description: `line ${m.range.start.line + 1}`,
            menu: m,
          }));
          const picked = await vscode.window.showQuickPick(items, { placeHolder: "Select a menu to preview" });
          if (!picked) return;
          menu = picked.menu;
        }
      }

      MenuPreviewPanel.createOrShow(menu, allMenus);
    }),
  );

  // Register Go to Dialog command
  context.subscriptions.push(
    vscode.commands.registerCommand("pawn-development.goToDialog", async (dialog: SAMPDialog) => {
      if (!dialog) return;

      const uri = vscode.Uri.parse(dialog.documentUri);
      const document = await vscode.workspace.openTextDocument(uri);
      const editor = await vscode.window.showTextDocument(document, vscode.ViewColumn.One);

      editor.selection = new vscode.Selection(dialog.range.start, dialog.range.end);
      editor.revealRange(dialog.range, vscode.TextEditorRevealType.InCenter);
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("pawn-development.goToMenu", async (menu: PawnMenu) => {
      if (!menu) return;

      const uri = vscode.Uri.parse(menu.documentUri);
      const document = await vscode.workspace.openTextDocument(uri);
      const editor = await vscode.window.showTextDocument(document, vscode.ViewColumn.One);

      editor.selection = new vscode.Selection(menu.range.start, menu.range.end);
      editor.revealRange(menu.range, vscode.TextEditorRevealType.InCenter);
    }),
  );

  // Register Go to Handler command
  context.subscriptions.push(
    vscode.commands.registerCommand("pawn-development.goToDialogHandler", async (dialog: SAMPDialog) => {
      if (!dialog) return;

      const uri = vscode.Uri.parse(dialog.documentUri);
      const document = await vscode.workspace.openTextDocument(uri);
      let handlers = findDialogResponseHandlers(document, dialog.dialogId);

      // If not found, search in all workspace files
      if (handlers.length === 0) {
        const files = await vscode.workspace.findFiles("**/*.{pwn,inc}", "**/node_modules/**");
        for (const file of files) {
          const doc = await vscode.workspace.openTextDocument(file);
          const found = findDialogResponseHandlers(doc, dialog.dialogId);
          handlers.push(...found);
        }
      }

      if (handlers.length === 0) {
        vscode.window.showInformationMessage(`No handler found for dialog ID: ${dialog.dialogId}`);
        return;
      }

      // If multiple handlers, let user pick
      if (handlers.length > 1) {
        const items = handlers.map((h, i) => ({
          label: `Handler ${i + 1}`,
          description: `Line ${h.range.start.line + 1}`,
          handler: h,
        }));

        const picked = await vscode.window.showQuickPick(items, {
          placeHolder: "Multiple handlers found. Select one:",
        });

        if (!picked) return;
        handlers = [picked.handler];
      }

      const handler = handlers[0];
      const handlerUri = vscode.Uri.parse(handler.documentUri);
      const handlerDoc = await vscode.workspace.openTextDocument(handlerUri);
      const editor = await vscode.window.showTextDocument(handlerDoc, vscode.ViewColumn.One);

      editor.selection = new vscode.Selection(handler.range.start, handler.range.end);
      editor.revealRange(handler.range, vscode.TextEditorRevealType.InCenter);
    }),
  );

  // Register Go to List Item Handler command
  context.subscriptions.push(
    vscode.commands.registerCommand("pawn-development.goToListItemHandler", async (dialog: SAMPDialog, listitem: number) => {
      if (!dialog) return;

      const uri = vscode.Uri.parse(dialog.documentUri);
      const document = await vscode.workspace.openTextDocument(uri);
      const handler = findListItemHandler(document, dialog.dialogId, listitem);

      if (!handler) {
        vscode.window.showInformationMessage(`No list item handler found for dialog ${dialog.dialogId} (item ${listitem}).`);
        return;
      }

      const handlerUri = vscode.Uri.parse(handler.documentUri);
      const handlerDoc = await vscode.workspace.openTextDocument(handlerUri);
      const editor = await vscode.window.showTextDocument(handlerDoc, vscode.ViewColumn.One);

      editor.selection = new vscode.Selection(handler.range.start, handler.range.end);
      editor.revealRange(handler.range, vscode.TextEditorRevealType.InCenter);
    }),
  );

  vscode.languages.registerDocumentFormattingEditProvider("pawn", PawnDocumentFormattingEditProvider);
  vscode.languages.registerDocumentRangeFormattingEditProvider("pawn", PawnDocumentFormattingEditProvider);

  vscode.workspace.onDidChangeWorkspaceFolders(() => {
    initSnippetCollector(true);
  });

  vscode.workspace.onDidRenameFiles(() => {
    initSnippetCollector(true);
  });

  vscode.workspace.onDidSaveTextDocument((e) => {
    if (path.basename(e.fileName) === ".pawnignore") initSnippetCollector(true);
  });

  const serverModule = context.asAbsolutePath(path.join("out", "server", "server.js"));
  const debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector: [{ scheme: "file", language: "pawn" }],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: vscode.workspace.createFileSystemWatcher("**/.pwn"),
    },
  };

  // Create the language client and start the client.
  client = new LanguageClient("Pawn Client", "Pawn Server", serverOptions, clientOptions);

  // Start the client. This will also launch the server
  client.start();
  client.onDidChangeState((e) => {
    if (e.newState === State.Running) {
      initSnippetCollector();
    }
  });
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

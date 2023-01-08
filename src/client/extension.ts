import BuildTaskHandler from "./buildTask";
import PawnDocumentFormattingEditProvider from "./formatter";
import * as vscode from "vscode";
import { initSnippetCollector } from "./commonFunc";
import path = require("path");
import { LanguageClient, LanguageClientOptions, ServerOptions, State, TransportKind } from "vscode-languageclient/node";
import { sequentialNumberGenerate } from "./Sequance Generator";
import { addToPawnIgnore, InitPawnIgnore } from "./whitelistedpaths";
import PawnFoldingProvider from "./FoldingProvider";

export let client: LanguageClient;

export async function activate(context: vscode.ExtensionContext) {
  // The server is implemented in node
  context.subscriptions.push(vscode.commands.registerCommand("pawn-development.seq-num", sequentialNumberGenerate));
  context.subscriptions.push(vscode.commands.registerCommand("pawn-development.initTask", BuildTaskHandler));
  context.subscriptions.push(vscode.commands.registerCommand("pawn-development.initScanDir", InitPawnIgnore));
  context.subscriptions.push(vscode.commands.registerCommand("pawn-development.pawnignore", addToPawnIgnore));
  context.subscriptions.push(
    vscode.commands.registerCommand("pawn-development.reloadDefs", () => {
      initSnippetCollector(true);
    })
  );
  context.subscriptions.push(
    vscode.languages.registerFoldingRangeProvider({ scheme: "file", language: "pawn" }, new PawnFoldingProvider())
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

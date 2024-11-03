import BuildTaskHandler from "./buildTask";
import PawnDocumentFormattingEditProvider from "./formatter";
import * as vscode from "vscode";
import { initSnippetCollector } from "./commonFunc";
import path = require("path");
import { LanguageClient, LanguageClientOptions, ServerOptions, State, TransportKind } from "vscode-languageclient/node";
import { addToPawnIgnore, InitPawnIgnore } from "./whitelistedpaths";
import PawnFoldingProvider from "./FoldingProvider";

export let client: LanguageClient;

export async function activate(context: vscode.ExtensionContext) {
  // The server is implemented in node
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

  // Register a DocumentColorProvider for color picking
  const colorProvider: vscode.DocumentColorProvider = {
    provideDocumentColors(document) {
      const colorRanges: vscode.ColorInformation[] = [];

      const colorRegex = /(?:0x[0-9A-Fa-f]{8}|\{[0-9A-Fa-f]{6}\}|[0-9A-Fa-f]{6})/g;
      
      const text = document.getText();
      let match;
      
      while ((match = colorRegex.exec(text)) !== null) {
        const colorCode = match[0];
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + colorCode.length);
        const range = new vscode.Range(startPos, endPos);
        const color = parseColor(colorCode);
        
        if (color) {
          colorRanges.push(new vscode.ColorInformation(range, color));
        }
      }
      return colorRanges;
    },
    
    provideColorPresentations(color, context) {
      // Determine format based on the original text
      const originalText = context.document.getText(context.range);
      
      if (originalText.startsWith("{")) {
        // Format as {RRGGBB}
        const hex = colorToHexWithoutAlpha(color);
        return [new vscode.ColorPresentation(`{${hex}}`)];
      } else if (originalText.startsWith("0x")) {
        // Format as 0xRRGGBBAA
        const hex = colorToHexWithAlpha(color);
        return [new vscode.ColorPresentation(hex)];
      } else {
        // Default format RRGGBB
        const hex = colorToHexWithoutAlpha(color);
        return [new vscode.ColorPresentation(hex)];
      }
    }
  };

  context.subscriptions.push(vscode.languages.registerColorProvider({ language: "pawn", scheme: "file" }, colorProvider));

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

  // Add event listener for document changes to refresh color presentations
  vscode.workspace.onDidChangeTextDocument(event => {
    if (event.document.languageId === "pawn") {
      vscode.commands.executeCommand('editor.action.reload');
    }
  });
}

function parseColor(colorCode: string): vscode.Color | null {
  if (colorCode.startsWith("0x") && colorCode.length === 10) {
    // Handle 0xRRGGBBAA format
    const red = parseInt(colorCode.slice(2, 4), 16) / 255;
    const green = parseInt(colorCode.slice(4, 6), 16) / 255;
    const blue = parseInt(colorCode.slice(6, 8), 16) / 255;
    const alpha = parseInt(colorCode.slice(8, 10), 16) / 255;
    return new vscode.Color(red, green, blue, alpha);
  } else if (colorCode.startsWith("{") && colorCode.endsWith("}")) {
    // Handle {RRGGBB} format
    const hex = colorCode.slice(1, -1);
    const red = parseInt(hex.slice(0, 2), 16) / 255;
    const green = parseInt(hex.slice(2, 4), 16) / 255;
    const blue = parseInt(hex.slice(4, 6), 16) / 255;
    return new vscode.Color(red, green, blue, 1.0);
  } else if (colorCode.length === 6) {
    // Handle RRGGBB format
    const red = parseInt(colorCode.slice(0, 2), 16) / 255;
    const green = parseInt(colorCode.slice(2, 4), 16) / 255;
    const blue = parseInt(colorCode.slice(4, 6), 16) / 255;
    return new vscode.Color(red, green, blue, 1.0);
  }
  return null;
}

function colorToHexWithAlpha(color: vscode.Color): string {
  const hex = (component: number) => Math.round(component * 255).toString(16).padStart(2, '0').toUpperCase();
  return `0x${hex(color.red)}${hex(color.green)}${hex(color.blue)}${hex(color.alpha)}`;
}

function colorToHexWithoutAlpha(color: vscode.Color): string {
  const hex = (component: number) => Math.round(component * 255).toString(16).padStart(2, '0').toUpperCase();
  return `${hex(color.red)}${hex(color.green)}${hex(color.blue)}`;
}
export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

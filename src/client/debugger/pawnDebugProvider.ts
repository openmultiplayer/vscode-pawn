import * as vscode from "vscode";
import { PawnDebugSession } from "./pawnDebugSession";

export class PawnDebugConfigurationProvider implements vscode.DebugConfigurationProvider {
  public provideDebugConfigurations(
    _folder: vscode.WorkspaceFolder | undefined,
    _token?: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.DebugConfiguration[]> {
    return [
      {
        name: "Pawn: Launch open.mp Server with Debugger",
        type: "pawn",
        request: "launch",
        serverPath: "${workspaceFolder}/omp-server.exe",
        amxPath: "${fileDirname}/${fileBasenameNoExtension}.amx",
        pawnDebugPort: 4242,
        debuggerHost: "127.0.0.1",
        stopOnEntry: true,
      },
      {
        name: "Pawn: Attach to open.mp Debugger",
        type: "pawn",
        request: "attach",
        pawnDebugPort: 4242,
        debuggerHost: "127.0.0.1",
      },
    ];
  }

  public resolveDebugConfiguration(
    folder: vscode.WorkspaceFolder | undefined,
    config: vscode.DebugConfiguration,
    _token?: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.DebugConfiguration> {
    // If no launch.json exists, generate default config
    if (!config.type && !config.request && !config.name) {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document.languageId === "pawn") {
        config.type = "pawn";
        config.name = "Pawn: Launch open.mp Server";
        config.request = "launch";
        config.serverPath = "${workspaceFolder}/omp-server.exe";
        config.pawnDebugPort = 4242;
        config.stopOnEntry = true;
      }
    }

    if (!config.pawnDebugPort) {
      config.pawnDebugPort = 4242;
    }
    if (!config.debuggerHost) {
      config.debuggerHost = "127.0.0.1";
    }

    return config;
  }
}

export class PawnDebugAdapterDescriptorFactory implements vscode.DebugAdapterDescriptorFactory {
  public createDebugAdapterDescriptor(
    _session: vscode.DebugSession,
    _executable: vscode.DebugAdapterExecutable | undefined
  ): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
    return new vscode.DebugAdapterInlineImplementation(new PawnDebugSession());
  }
}

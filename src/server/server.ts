import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  CompletionItem,
  TextDocumentPositionParams,
  TextDocumentSyncKind,
  Hover,
  DefinitionParams,
  SignatureHelpParams,
  SignatureHelp,
  CompletionParams,
  WorkspaceSymbolParams,
} from "vscode-languageserver/node";

import { TextDocument } from "vscode-languageserver-textdocument";
import { parseSnippets, doCompletion, doCompletionResolve, doGoToDef, doHover, doSignHelp, resetAutocompletes, doWorkspaceSymbols } from "./parser";
import { globalIncludeIndexer } from "./includeIndexer";
import * as url from "url";

export const connection = createConnection(ProposedFeatures.all);
export const documents = new TextDocuments(TextDocument);
documents.listen(connection);
connection.listen();

connection.onInitialize((params) => {
  if (params.workspaceFolders) {
    const folders: string[] = [];
    for (const wf of params.workspaceFolders) {
      try {
        folders.push(url.fileURLToPath(wf.uri));
      } catch (e) {}
    }
    globalIncludeIndexer.setWorkspaceFolders(folders);
  }

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Full,
      // Tell the client that the server supports code completion
      completionProvider: {
        resolveProvider: true,
      },
      definitionProvider: true,
      hoverProvider: true,
      signatureHelpProvider: {
        triggerCharacters: ["(", ","],
      },
      workspaceSymbolProvider: true,
      workspace: {
        workspaceFolders: {
          supported: true,
        },
      },
    },
  };
});

// connection.onInitialized(() => {});

connection.onNotification("revalidateAllOpenedDocuments", () => {
  resetAutocompletes();
  documents.all().forEach((doc) => parseSnippets(doc));
});

connection.onDidChangeConfiguration(() => {
  documents.all().forEach((doc) => parseSnippets(doc));
});

// documents.onDidClose(() => {});

documents.onDidChangeContent((change) => {
  parseSnippets(change.document, false);
});

documents.onDidSave((change) => {
  parseSnippets(change.document);
});

// connection.onDidChangeWatchedFiles((_change) => {});

connection.onDefinition((textDocumentIdentifier: DefinitionParams) => {
  const doc = documents.get(textDocumentIdentifier.textDocument.uri);
  if (doc === undefined) return;
  return doGoToDef(doc, textDocumentIdentifier.position);
});

connection.onHover((params: TextDocumentPositionParams): Hover | undefined => {
  const doc = documents.get(params.textDocument.uri);
  if (doc === undefined) return;
  return doHover(doc, params.position);
});

connection.onSignatureHelp((params: SignatureHelpParams): SignatureHelp | undefined => {
  const doc = documents.get(params.textDocument.uri);
  if (doc === undefined) return;
  return doSignHelp(doc, params.position);
});

connection.onCompletion(async (params: CompletionParams) => {
  const completionItems = await doCompletion(params);
  if (completionItems === undefined) return undefined;
  return { isIncomplete: false, items: completionItems };
});

connection.onCompletionResolve(async (item: CompletionItem): Promise<CompletionItem> => {
  return await doCompletionResolve(item);
});

connection.onWorkspaceSymbol((params: WorkspaceSymbolParams) => {
  return doWorkspaceSymbols(params.query);
});

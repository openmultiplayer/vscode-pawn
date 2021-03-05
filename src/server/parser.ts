import { CompletionItem, CompletionItemKind, Definition, Location, MarkedString, Hover, SignatureHelp, Position, ParameterInformation, CompletionParams, MarkupContent, MarkupKind } from "vscode-languageserver";
import { findFunctionIdentifier, positionToIndex, findIdentifierAtCursor } from "./common";
import { TextDocument } from "vscode-languageserver-textdocument";
import { openedWorkspaceList } from "./server";
import * as fs from 'fs';
import * as url from 'url';
import * as path from 'path';

interface PawnFunction {
    textDocument: TextDocument;
    completion: CompletionItem;
    definition: Definition;
    params?: ParameterInformation[];
}
let pawnFuncCollection: Map<string, PawnFunction> = new Map();

export const resetAutocompletes = () => {
    pawnFuncCollection.clear();
};

export const parseDefine = (textDocument: TextDocument) => {
    const regexDefine = /^(\s*)#define\s+([^()]*?)\s+(.*?)$/gm;
    const content = textDocument.getText();
    const splitContent = content.split('\n');
    splitContent.forEach((cont: string, index: number) => {
        var m;
        do {
            m = regexDefine.exec(cont);
            if (m) {
                const func = m[2];
                const arg = m[3];
                const newSnip: CompletionItem = {
                    label: func,
                    kind: CompletionItemKind.Text,
                    insertText: func,
                    documentation: `${func} ${arg}`
                };
                const newDef: Definition = Location.create(textDocument.uri, {
                    start: { line: index, character: m.input.indexOf(func) },
                    end: { line: index, character: m.input.indexOf(func) + func.length }

                });
                const pwnFun: PawnFunction = {
                    textDocument: textDocument,
                    completion: newSnip,
                    definition: newDef
                };
                const findSnip = pawnFuncCollection.get(func);
                if (findSnip === undefined) pawnFuncCollection.set(func, pwnFun);
            }
        } while (m);
    });
};

export const parseCustomSnip = (textDocument: TextDocument) => {
    const regexDefine = /^(\s*)#defineSnip\s(.*?)\s(.*)$/gm;
    const content = textDocument.getText();
    const splitContent = content.split('\n');
    splitContent.forEach((cont: string, index: number) => {
        var m;
        do {
            m = regexDefine.exec(cont);
            if (m) {
                const func = m[2];
                const args = m[3];
                const newSnip: CompletionItem = {
                    label: func,
                    kind: CompletionItemKind.Text,
                    insertText: args,
                    documentation: `${func} ${args}`
                };
                const newDef: Definition = Location.create(textDocument.uri, {
                    start: { line: index, character: m.input.indexOf(func) },
                    end: { line: index, character: m.input.indexOf(func) + func.length }

                });
                const pwnFun: PawnFunction = {
                    textDocument: textDocument,
                    completion: newSnip,
                    definition: newDef
                };
                const findSnip = pawnFuncCollection.get(func);
                if (findSnip === undefined) pawnFuncCollection.set(func, pwnFun);
            }
        } while (m);
    });
};

export const parsefuncs = (textDocument: TextDocument) => {
    const regex = /^(\s*)(public|native|stock)\s(\S*?)\((.*?)\)/gm;
    const content = textDocument.getText();
    const splitContent = content.split('\n');
    splitContent.forEach((cont: string, index: number) => {
        var m;
        do {
            m = regex.exec(cont);
            if (m) {
                let func = m[3];
                let args = m[4];
                let doc: string = '';
                let endDoc = -1;
                if (splitContent[index - 1] !== undefined) endDoc = splitContent[index - 1].indexOf('*/');
                if (endDoc !== -1) {
                    let startDoc = -1;
                    let inNum = index;
                    while (inNum >= 0) {
                        inNum--;
                        if (splitContent[inNum] === undefined) continue;
                        startDoc = splitContent[inNum].indexOf('/*');
                        if (startDoc !== -1) {
                            if (inNum === index) {
                                doc = splitContent[index];
                            } else if (inNum < index) {
                                while (inNum < index) {
                                    doc += splitContent[inNum] + '\n\n';
                                    inNum++;

                                }
                            }
                            break;
                        }
                    }
                }
                doc = doc.replace('/*', '').replace('*/', '').trim();
                const newSnip: CompletionItem = {
                    label: func + '(' + args + ')',
                    kind: CompletionItemKind.Function,
                    insertText: func + '(' + args + ')',
                    documentation: doc,
                };
                const newDef: Definition = Location.create(textDocument.uri, {
                    start: { line: index, character: m.input.indexOf(func) },
                    end: { line: index, character: m.input.indexOf(func) + func.length }

                });
                let params: ParameterInformation[] = [];
                if (args.trim().length > 0) {
                    params = args.split(',').map((value) => ({ label: value.trim() }));
                } else {
                    params = [];
                }
                const pwnFun: PawnFunction = {
                    textDocument: textDocument,
                    definition: newDef,
                    completion: newSnip,
                    params
                };
                const indexPos = func.indexOf(':');
                if (indexPos !== -1) {
                    const resOut = /:(.*)/gm.exec(func);
                    if (resOut) func = resOut[1];
                }
                const findSnip = pawnFuncCollection.get(func);
                if (findSnip === undefined) pawnFuncCollection.set(func, pwnFun);
            }
        } while (m);
    });
};

export const parsefuncsWithoutPrefix = (textDocument: TextDocument) => {
    const regex = /^(\s*)(\S*?)\((.*?)\)/gm;
    const content = textDocument.getText();
    const splitContent = content.split('\n');
    splitContent.forEach((cont: string, index: number) => {
        var m;
        do {
            m = regex.exec(cont);
            if (m) {
                let func = m[2];
                let args = m[3];
                let doc: string = '';
                let endDoc = -1;
                if (splitContent[index - 1] !== undefined) endDoc = splitContent[index - 1].indexOf('*/');
                if (endDoc !== -1) {
                    let startDoc = -1;
                    let inNum = index;
                    while (inNum >= 0) {
                        inNum--;
                        if (splitContent[inNum] === undefined) continue;
                        startDoc = splitContent[inNum].indexOf('/*');
                        if (startDoc !== -1) {
                            if (inNum === index) {
                                doc = splitContent[index];
                            } else if (inNum < index) {
                                while (inNum < index) {
                                    doc += splitContent[inNum] + '\n\n';
                                    inNum++;

                                }
                            }
                            break;
                        }
                    }
                }
                doc = doc.replace('/*', '').replace('*/', '').trim();
                const newSnip: CompletionItem = {
                    label: func + '(' + args + ')',
                    kind: CompletionItemKind.Function,
                    insertText: func + '(' + args + ')',
                    documentation: doc,
                };
                const newDef: Definition = Location.create(textDocument.uri, {
                    start: { line: index, character: m.input.indexOf(func) },
                    end: { line: index, character: m.input.indexOf(func) + func.length }

                });
                let params: ParameterInformation[] = [];
                if (args.trim().length > 0) {
                    params = args.split(',').map((value) => ({ label: value.trim() }));
                } else {
                    params = [];
                }
                const pwnFun: PawnFunction = {
                    textDocument: textDocument,
                    definition: newDef,
                    completion: newSnip,
                    params
                };
                const indexPos = func.indexOf(':');
                if (indexPos !== -1) {
                    const resOut = /:(.*)/gm.exec(func);
                    if (resOut) func = resOut[1];
                }
                const findSnip = pawnFuncCollection.get(func);
                if (findSnip === undefined) pawnFuncCollection.set(func, pwnFun);
            }
        } while (m);
    });
};

export const parsefuncsDefines = (textDocument: TextDocument) => {
    const regex = /^(\s*)#define\s+(\S*?)\((.*?)\)/gm;
    const content = textDocument.getText();
    const splitContent = content.split('\n');
    splitContent.forEach((cont: string, index: number) => {
        var m;
        do {
            m = regex.exec(cont);
            if (m) {
                let func = m[2];
                let args = m[3];
                let doc: string = '';
                let endDoc = -1;
                if (splitContent[index - 1] !== undefined) endDoc = splitContent[index - 1].indexOf('*/');
                if (endDoc !== -1) {
                    let startDoc = -1;
                    let inNum = index;
                    while (inNum >= 0) {
                        inNum--;
                        if (splitContent[inNum] === undefined) continue;
                        startDoc = splitContent[inNum].indexOf('/*');
                        if (startDoc !== -1) {
                            if (inNum === index) {
                                doc = splitContent[index];
                            } else if (inNum < index) {
                                while (inNum < index) {
                                    doc += splitContent[inNum] + '\n\n';
                                    inNum++;

                                }
                            }
                            break;
                        }
                    }
                }
                doc = doc.replace('/*', '').replace('*/', '').trim();
                const newSnip: CompletionItem = {
                    label: func + '(' + args + ')',
                    kind: CompletionItemKind.Function,
                    insertText: func + '(' + args + ')',
                    documentation: doc,
                };
                const newDef: Definition = Location.create(textDocument.uri, {
                    start: { line: index, character: m.input.indexOf(args) },
                    end: { line: index, character: m.input.indexOf(args) + args.length }

                });
                let params: ParameterInformation[] = [];
                if (args.trim().length > 0) {
                    params = args.split(',').map((value) => ({ label: value.trim() }));
                } else {
                    params = [];
                }
                const pwnFun: PawnFunction = {
                    textDocument: textDocument,
                    definition: newDef,
                    completion: newSnip,
                    params
                };
                const indexPos = func.indexOf(':');
                if (indexPos !== -1) {
                    const resOut = /:(.*)/gm.exec(func);
                    if (resOut) func = resOut[1];
                }
                const findSnip = pawnFuncCollection.get(func);
                if (findSnip === undefined) pawnFuncCollection.set(func, pwnFun);
            }
        } while (m);
    });
};

let pawnWords: Map<string, CompletionItem[]> = new Map();

export const parseWords = (textDocument: TextDocument) => {
    const regex = /[A-Za-z_]+/gm;
    const content = textDocument.getText();
    const splitContent = content.split('\n');
    const words: string[] = [];
    const wordCompletion: CompletionItem[] = [];
    splitContent.forEach((cont: string, index: number) => {
        var m;
        do {
            m = regex.exec(cont);
            if (m) {
                if (words.indexOf(m[0]) === -1) words.push(m[0]);
            }
        } while (m);
    });
    for (const key in words) {
        if (words.hasOwnProperty(key)) {
            const element = words[key];
            const newSnip: CompletionItem = {
                label: element,
                kind: CompletionItemKind.Text,
                insertText: element
            };
            wordCompletion.push(newSnip);
        }
    }

    const findSnip = pawnWords.get(textDocument.uri);
    if (findSnip === undefined) pawnWords.set(textDocument.uri, wordCompletion);
};

const getTextDocumentWorkspacePath = (textDocument: TextDocument) => {
    for (const workspace of openedWorkspaceList) {
        if (RegExp(workspace.uri).test(textDocument.uri)) return workspace;
    }
    return undefined;
};

const isParseAllowed = (textDocument: TextDocument) => {
    const workspace = getTextDocumentWorkspacePath(textDocument);
    if (workspace !== undefined) {
        const whiteListedPathFile = path.join(url.fileURLToPath(workspace.uri), "/.pawnignore");
        if (fs.existsSync(whiteListedPathFile)) {
            const data = fs.readFileSync(whiteListedPathFile, { encoding: 'utf-8' });
            const allLines = data.split("\n").filter(line => line.length > 0);
            if (allLines.length > 0) {
                for (const line of allLines) {
                    if (!RegExp(/^\/\/ .*/).test(line)) {
                        const filePath = url.fileURLToPath(textDocument.uri);
                        const workspaceWhitlistedPath = path.join(url.fileURLToPath(workspace.uri), line);
                        if (RegExp(url.pathToFileURL(workspaceWhitlistedPath).toString()).test(url.pathToFileURL(filePath).toString())) {
                            return false;
                        }
                    }
                }
            }
        }
    }
    return true;
};

export const parseSnippets = async (textDocument: TextDocument) => {
    pawnFuncCollection.forEach((value: PawnFunction, key: string) => { if (value.textDocument.uri === textDocument.uri) pawnFuncCollection.delete(key); });
    const findSnip = pawnWords.get(textDocument.uri);
    if (findSnip !== undefined) { pawnWords.delete(textDocument.uri); }
    if (!isParseAllowed(textDocument)) return;
    parseDefine(textDocument);
    parseCustomSnip(textDocument);
    parsefuncs(textDocument);
    parsefuncsWithoutPrefix(textDocument);
    parsefuncsDefines(textDocument);
    parseWords(textDocument);
};

export const doCompletion = async (params: CompletionParams) => {
    const comItems: CompletionItem[] = [];
    pawnFuncCollection.forEach(res => comItems.push(res.completion));
    const findSnip = pawnWords.get(params.textDocument.uri);
    if (findSnip !== undefined) {
        findSnip.forEach(res => comItems.push(res));
    }
    return comItems;
};

export const doCompletionResolve = async (item: CompletionItem) => {
    item.insertText = item.insertText?.replaceAll('\\n', '\n');
    item.insertText = item.insertText?.replaceAll('\\t', '\t');
    return item;
};

export const doHover = (document: TextDocument, position: Position): Hover | undefined => {
    const cursorIndex = positionToIndex(document.getText(), position);
    const result = findIdentifierAtCursor(document.getText(), cursorIndex);
    const snip = pawnFuncCollection.get(result.identifier);
    if (snip === undefined) return undefined;
    let markdown: MarkupContent = {
        kind: MarkupKind.Markdown,
        value: [
            '```pawn',
            (snip.completion.label !== undefined && snip.completion.label),
            '```',
            '---',
            (snip.completion.documentation !== undefined && snip.completion.documentation.toString())
        ].join('\n')
    };
    return {
        contents: markdown
    };
};

export const doSignHelp = (document: TextDocument, position: Position): SignatureHelp | undefined => {
    const cursorIndex = positionToIndex(document.getText(), position);
    const result = findFunctionIdentifier(document.getText(), cursorIndex);
    if (result.identifier === '') return undefined;
    const snip = pawnFuncCollection.get(result.identifier);
    if (snip === undefined) return undefined;
    return {
        activeParameter: 0,
        activeSignature: 0,
        signatures: [{
            label: snip.completion.label,
            parameters: snip.params,
            documentation: snip.completion.documentation,
            activeParameter: result.parameterIndex
        }]
    };
};

export const doGoToDef = (document: TextDocument, position: Position) => {
    const cursorIndex = positionToIndex(document.getText(), position);
    const result = findIdentifierAtCursor(document.getText(), cursorIndex);
    const snip = pawnFuncCollection.get(result.identifier);
    if (snip === undefined) return;
    return snip.definition;
};
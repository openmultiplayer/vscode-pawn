import {
  CompletionItem,
  CompletionItemKind,
  Definition,
  Location,
  Hover,
  SignatureHelp,
  Position,
  ParameterInformation,
  CompletionParams,
  MarkupContent,
  MarkupKind,
} from "vscode-languageserver";
import { findFunctionIdentifier, positionToIndex, findIdentifierAtCursor, isPawnExt, parseDocs } from "./common";
import { TextDocument } from "vscode-languageserver-textdocument";
import { connection } from "./server";
import * as fs from "fs";
import * as url from "url";
import * as path from "path";

interface PawnFunction {
  type: "macrodefine" | "customsnip" | "function" | "macrofunction" | "native" | "forward";
  textDocument: TextDocument;
  completion: CompletionItem;
  definition: Definition;
  params?: ParameterInformation[];
}
const pawnFuncCollection: Map<string, PawnFunction> = new Map();
const pawnWords: Map<string, CompletionItem[]> = new Map();

const commentRegex = RegExp(/\/\*/gm);
const commentEndRegex = RegExp(/\*\//gm);

export const resetAutocompletes = () => {
  pawnFuncCollection.clear();
};

export const parseDefine = (textDocument: TextDocument) => {
  const regexDefine = /^(\s*)#define\s+([^\s()]{1,})\s+([^\s]{1,})$/gm;
  const content = textDocument.getText();
  const splitContent = content.split("\n");
  let excempt = 0;
  splitContent.forEach((cont: string, index: number) => {
    if (commentRegex.test(cont)) {
      excempt++;
      // This is for single line block of comment, for example: 
      // /* Some comment text here */
      if (commentEndRegex.test(cont)) {
        excempt--;
      }
    } else if (commentEndRegex.test(cont)) {
      excempt--;
    } else if (excempt === 0) {
      let m;
      do {
        m = regexDefine.exec(cont);
        if (m) {
          const func = m[2];
          const newSnip: CompletionItem = {
            label: func,
            kind: CompletionItemKind.Text,
            insertText: func,
            documentation: `### Define Usage:\n${func}`,
          };
          const newDef: Definition = Location.create(textDocument.uri, {
            start: { line: index, character: m.input.indexOf(func) },
            end: {
              line: index,
              character: m.input.indexOf(func) + func.length,
            },
          });
          const pwnFun: PawnFunction = {
            textDocument: textDocument,
            completion: newSnip,
            definition: newDef,
            type: "macrodefine",
          };
          const findSnip = pawnFuncCollection.get(func);
          if (findSnip === undefined) pawnFuncCollection.set(func, pwnFun);
        }
      } while (m);
    }
  });
};

export const parseFuncsDefines = (textDocument: TextDocument) => {
  const regex = /^(\s*)#define\s+([\S]{1,})\((.*?)\)/gm;
  const content = textDocument.getText();
  const splitContent = content.split("\n");
  let excempt = 0;
  splitContent.forEach((cont: string, index: number) => {
    if (commentRegex.test(cont)) {
      excempt++;
      // This is for single line block of comment, for example: 
      // /* Some comment text here */
      if (commentEndRegex.test(cont)) {
        excempt--;
      }
    } else if (commentEndRegex.test(cont)) {
      excempt--;
    } else if (excempt === 0) {
      let m;
      do {
        m = regex.exec(cont);
        if (m) {
          const func = m[2];
          const args = m[3];
          const newSnip: CompletionItem = {
            label: func + "(" + args + ")",
            kind: CompletionItemKind.Function,
            insertText: func + "(" + args + ")",
            documentation: `### Define Function Usage:\n${func}(${args})`,
          };
          const newDef: Definition = Location.create(textDocument.uri, {
            start: { line: index, character: m.input.indexOf(args) },
            end: {
              line: index,
              character: m.input.indexOf(args) + args.length,
            },
          });
          let params: ParameterInformation[] = [];
          if (args.trim().length > 0) {
            params = args.split(",").map((value) => ({ label: value.trim() }));
          } else {
            params = [];
          }
          const pwnFun: PawnFunction = {
            textDocument: textDocument,
            definition: newDef,
            completion: newSnip,
            params,
            type: "macrofunction",
          };
          // const indexPos = func.indexOf(':');
          // if (indexPos !== -1) {
          // const resOut = /:(.*)/gm.exec(func);
          // if (resOut) func = resOut[1];
          // }
          const findSnip = pawnFuncCollection.get(func);
          if (findSnip === undefined) {
            pawnFuncCollection.set(func, pwnFun);
          } else {
            if (findSnip.type === "macrodefine") pawnFuncCollection.set(func, pwnFun);
          }
        }
      } while (m);
    }
  });
};

export const parseCustomSnip = (textDocument: TextDocument) => {
  const regexDefine = /^\/\/#snippet\s([^\s]{1,})\s([^\s].{1,})$/gm;
  const regexFunction = /^\/\/#function\s([\S]{1,})\((.*?)\)/gm;
  const content = textDocument.getText();
  const splitContent = content.split("\n");

  let excempt = 0;
  splitContent.forEach((cont: string, index: number) => {
    if (commentRegex.test(cont)) {
      excempt++;
      // This is for single line block of comment, for example: 
      // /* Some comment text here */
      if (commentEndRegex.test(cont)) {
        excempt--;
      }
    } else if (commentEndRegex.test(cont)) {
      excempt--;
    } else if (excempt === 0) {
      let fisrtReg;
      do {
        fisrtReg = regexDefine.exec(cont);
        if (fisrtReg) {
          const func = fisrtReg[1];
          const args = fisrtReg[2];
          const newSnip: CompletionItem = {
            label: func,
            kind: CompletionItemKind.Function,
            insertText: args,
            documentation: `### Generic Snippet Usage:\n${func}`,
          };
          const newDef: Definition = Location.create(textDocument.uri, {
            start: { line: index, character: fisrtReg.input.indexOf(func) },
            end: {
              line: index,
              character: fisrtReg.input.indexOf(func) + func.length,
            },
          });
          const pwnFun: PawnFunction = {
            textDocument: textDocument,
            completion: newSnip,
            definition: newDef,
            type: "customsnip",
          };
          pawnFuncCollection.set(func, pwnFun);
        }
      } while (fisrtReg);
      let m;
      do {
        m = regexFunction.exec(cont);
        if (m) {
          const func = m[1];
          const args = m[2];
          const newSnip: CompletionItem = {
            label: func + "(" + args + ")",
            kind: CompletionItemKind.Function,
            insertText: func + "(" + args + ")",
            documentation: `### Snippet Function Usage:\n${func}(${args})`,
          };
          const newDef: Definition = Location.create(textDocument.uri, {
            start: { line: index, character: m.input.indexOf(func) },
            end: {
              line: index,
              character: m.input.indexOf(func) + func.length,
            },
          });
          let params: ParameterInformation[] = [];
          if (args.trim().length > 0) {
            params = args.split(",").map((value) => ({ label: value.trim() }));
          } else {
            params = [];
          }
          const pwnFun: PawnFunction = {
            textDocument: textDocument,
            definition: newDef,
            completion: newSnip,
            params,
            type: "customsnip",
          };
          // const indexPos = func.indexOf(':');
          // if (indexPos !== -1) {
          // const resOut = /:(.*)/gm.exec(func);
          // if (resOut) func = resOut[1];
          // }
          pawnFuncCollection.set(func, pwnFun);
        }
      } while (m);
    }
  });
};

export const parseFuncs = (textDocument: TextDocument) => {
  const regex = /^(?!__)(\s*)(stock|function|func|timer|remotefunc|foreign)\s+((?!.*__)[\S]{1,})\((.*?)\)/gm;
  const content = textDocument.getText();
  const splitContent = content.split("\n");
  let excempt = 0;
  splitContent.forEach((cont: string, index: number) => {
    if (commentRegex.test(cont)) {
      excempt++;
      // This is for single line block of comment, for example: 
      // /* Some comment text here */
      if (commentEndRegex.test(cont)) {
        excempt--;
      }
    } else if (commentEndRegex.test(cont)) {
      excempt--;
    } else if (excempt === 0) {
      let m;
      do {
        m = regex.exec(cont);
        if (m) {
          const func = m[3];
          const args = m[4];
          let doc = "";
          let endDoc = -1;
          if (splitContent[index - 1] !== undefined) endDoc = splitContent[index - 1].indexOf("*/");
          if (endDoc !== -1) {
            let startDoc = -1;
            let inNum = index;
            while (inNum >= 0) {
              inNum--;
              if (splitContent[inNum] === undefined) continue;
              startDoc = splitContent[inNum].indexOf("/*");
              if (startDoc !== -1) {
                if (inNum === index) {
                  doc = splitContent[index];
                } else if (inNum < index) {
                  while (inNum < index) {
                    doc += splitContent[inNum] + "\n\n";
                    inNum++;
                  }
                }
                break;
              }
            }
          }
          doc = doc.replace(/(\/\*|\*+\s+|\*\/|(\*|\*\*)\/)/gm, "").trim();
          const parseDoc = parseDocs(doc);
          const noTagFunc = func.replace(/^[^:]*:/gm, "");
          const newSnip: CompletionItem = {
            label: func + "(" + args + ")",
            kind: CompletionItemKind.Function,
            insertText: noTagFunc + "(" + args + ")",
            documentation: parseDoc,
          };
          const newDef: Definition = Location.create(textDocument.uri, {
            start: { line: index, character: m.input.indexOf(noTagFunc) },
            end: {
              line: index,
              character: m.input.indexOf(noTagFunc) + noTagFunc.length,
            },
          });
          let params: ParameterInformation[] = [];
          if (args.trim().length > 0) {
            params = args.split(",").map((value) => ({ label: value.trim() }));
          } else {
            params = [];
          }
          const pwnFun: PawnFunction = {
            textDocument: textDocument,
            definition: newDef,
            completion: newSnip,
            params,
            type: "function",
          };

          const findSnip = pawnFuncCollection.get(noTagFunc);
          if (findSnip === undefined) {
            pawnFuncCollection.set(noTagFunc, pwnFun);
          } else {
            if (
              findSnip.type === "macrofunction" ||
              findSnip.type === "macrodefine" ||
              findSnip.type === "customsnip" ||
              findSnip.type === "forward"
            )
              pawnFuncCollection.set(noTagFunc, pwnFun);
          }
        }
      } while (m);
    }
  });
};

export const parseForward = (textDocument: TextDocument) => {
  const regex = /^(\s*)(forward)\s+((?!.*__)[\S]{1,})\((.*?)\)/gm;
  const content = textDocument.getText();
  const splitContent = content.split("\n");
  let excempt = 0;
  splitContent.forEach((cont: string, index: number) => {
    if (commentRegex.test(cont)) {
      excempt++;
      // This is for single line block of comment, for example: 
      // /* Some comment text here */
      if (commentEndRegex.test(cont)) {
        excempt--;
      }
    } else if (commentEndRegex.test(cont)) {
      excempt--;
    } else if (excempt === 0) {
      let m;
      do {
        m = regex.exec(cont);
        if (m) {
          const func = m[3];
          const args = m[4];
          let doc = "";
          let endDoc = -1;
          if (splitContent[index - 1] !== undefined) endDoc = splitContent[index - 1].indexOf("*/");
          if (endDoc !== -1) {
            let startDoc = -1;
            let inNum = index;
            while (inNum >= 0) {
              inNum--;
              if (splitContent[inNum] === undefined) continue;
              startDoc = splitContent[inNum].indexOf("/*");
              if (startDoc !== -1) {
                if (inNum === index) {
                  doc = splitContent[index];
                } else if (inNum < index) {
                  while (inNum < index) {
                    doc += splitContent[inNum] + "\n\n";
                    inNum++;
                  }
                }
                break;
              }
            }
          }
          doc = doc.replace(/(\/\*|\*+\s+|\*\/|(\*|\*\*)\/)/gm, "").trim();
          const parseDoc = parseDocs(doc);
          const noTagFunc = func.replace(/^[^:]*:/gm, "");
          const newSnip: CompletionItem = {
            label: func + "(" + args + ")",
            kind: CompletionItemKind.Function,
            insertText: func + "(" + args + ")",
            documentation: parseDoc,
          };
          const newDef: Definition = Location.create(textDocument.uri, {
            start: { line: index, character: m.input.indexOf(noTagFunc) },
            end: {
              line: index,
              character: m.input.indexOf(noTagFunc) + noTagFunc.length,
            },
          });
          let params: ParameterInformation[] = [];
          if (args.trim().length > 0) {
            params = args.split(",").map((value) => ({ label: value.trim() }));
          } else {
            params = [];
          }
          const pwnFun: PawnFunction = {
            textDocument: textDocument,
            definition: newDef,
            completion: newSnip,
            params,
            type: "forward",
          };

          const findSnip = pawnFuncCollection.get(noTagFunc);
          if (findSnip === undefined) {
            pawnFuncCollection.set(noTagFunc, pwnFun);
          } else {
            if (findSnip.type === "macrofunction" || findSnip.type === "macrodefine" || findSnip.type === "customsnip")
              pawnFuncCollection.set(noTagFunc, pwnFun);
          }
        }
      } while (m);
    }
  });
};

export const parseFuncsNonPrefix = (textDocument: TextDocument) => {
  const regex = /^((?!.*__)[\S]{1,})\((.*?)\)/gm;
  const content = textDocument.getText();
  const splitContent = content.split("\n");
  let excempt = 0;
  splitContent.forEach((cont: string, index: number) => {
    if (commentRegex.test(cont)) {
      excempt++;
      // This is for single line block of comment, for example: 
      // /* Some comment text here */
      if (commentEndRegex.test(cont)) {
        excempt--;
      }
    } else if (commentEndRegex.test(cont)) {
      excempt--;
    } else if (excempt === 0) {
      let m;
      do {
        m = regex.exec(cont);
        if (m) {
          const func = m[1];
          const args = m[2];
          let doc = "";
          let endDoc = -1;
          if (splitContent[index - 1] !== undefined) endDoc = splitContent[index - 1].indexOf("*/");
          if (endDoc !== -1) {
            let startDoc = -1;
            let inNum = index;
            while (inNum >= 0) {
              inNum--;
              if (splitContent[inNum] === undefined) continue;
              startDoc = splitContent[inNum].indexOf("/*");
              if (startDoc !== -1) {
                if (inNum === index) {
                  doc = splitContent[index];
                } else if (inNum < index) {
                  while (inNum < index) {
                    doc += splitContent[inNum] + "\n\n";
                    inNum++;
                  }
                }
                break;
              }
            }
          }
          doc = doc.replace(/(\/\*|\*+\s+|\*\/|(\*|\*\*)\/)/gm, "").trim();
          const parseDoc = parseDocs(doc);
          const noTagFunc = func.replace(/^[^:]*:/gm, "");
          const newSnip: CompletionItem = {
            label: func + "(" + args + ")",
            kind: CompletionItemKind.Function,
            insertText: noTagFunc,
            documentation: parseDoc,
          };
          const newDef: Definition = Location.create(textDocument.uri, {
            start: { line: index, character: m.input.indexOf(noTagFunc) },
            end: {
              line: index,
              character: m.input.indexOf(noTagFunc) + noTagFunc.length,
            },
          });
          let params: ParameterInformation[] = [];
          if (args.trim().length > 0) {
            params = args.split(",").map((value) => ({ label: value.trim() }));
          } else {
            params = [];
          }
          const pwnFun: PawnFunction = {
            textDocument: textDocument,
            definition: newDef,
            completion: newSnip,
            params,
            type: "function",
          };
          // const indexPos = func.indexOf(':');
          // if (indexPos !== -1) {
          // const resOut = /:(.*)/gm.exec(func);
          // if (resOut) func = resOut[1];
          // }
          const findSnip = pawnFuncCollection.get(noTagFunc);
          if (findSnip === undefined) {
            pawnFuncCollection.set(noTagFunc, pwnFun);
          } else {
            if (findSnip.type === "macrofunction" || findSnip.type === "macrodefine" || findSnip.type === "customsnip")
              pawnFuncCollection.set(noTagFunc, pwnFun);
          }
        }
      } while (m);
    }
  });
};

export const parseNatives = (textDocument: TextDocument) => {
  const regex = /^(\s*)(native)\s((?!.*__)[\S]{1,})\((.*?)\)/gm;
  const content = textDocument.getText();
  const splitContent = content.split("\n");
  let excempt = 0;
  splitContent.forEach((cont: string, index: number) => {
    if (commentRegex.test(cont)) {
      excempt++;
      // This is for single line block of comment, for example: 
      // /* Some comment text here */
      if (commentEndRegex.test(cont)) {
        excempt--;
      }
    } else if (commentEndRegex.test(cont)) {
      excempt--;
    } else if (excempt === 0) {
      let m;
      do {
        m = regex.exec(cont);
        if (m) {
          const func = m[3];
          const args = m[4];
          let doc = "";
          let endDoc = -1;
          if (splitContent[index - 1] !== undefined) endDoc = splitContent[index - 1].indexOf("*/");
          if (endDoc !== -1) {
            let startDoc = -1;
            let inNum = index;
            while (inNum >= 0) {
              inNum--;
              if (splitContent[inNum] === undefined) continue;
              startDoc = splitContent[inNum].indexOf("/*");
              if (startDoc !== -1) {
                if (inNum === index) {
                  doc = splitContent[index];
                } else if (inNum < index) {
                  while (inNum < index) {
                    doc += splitContent[inNum] + "\n\n";
                    inNum++;
                  }
                }
                break;
              }
            }
          }
          doc = doc.replace(/(\/\*|\*+\s+|\*\/|(\*|\*\*)\/)/gm, "").trim();
          const parseDoc = parseDocs(doc);
          const noTagFunc = func.replace(/^[^:]*:/gm, "");
          const newSnip: CompletionItem = {
            label: func + "(" + args + ")",
            kind: CompletionItemKind.Function,
            insertText: noTagFunc,
            documentation: parseDoc,
          };
          const newDef: Definition = Location.create(textDocument.uri, {
            start: { line: index, character: m.input.indexOf(noTagFunc) },
            end: {
              line: index,
              character: m.input.indexOf(noTagFunc) + noTagFunc.length,
            },
          });
          let params: ParameterInformation[] = [];
          if (args.trim().length > 0) {
            params = args.split(",").map((value) => ({ label: value.trim() }));
          } else {
            params = [];
          }
          const pwnFun: PawnFunction = {
            textDocument: textDocument,
            definition: newDef,
            completion: newSnip,
            params,
            type: "native",
          };
          // const indexPos = func.indexOf(':');
          // if (indexPos !== -1) {
          // const resOut = /:(.*)/gm.exec(func);
          // if (resOut) func = resOut[1];
          // }
          const findSnip = pawnFuncCollection.get(noTagFunc);
          if (findSnip === undefined) {
            pawnFuncCollection.set(noTagFunc, pwnFun);
          } else {
            if (findSnip.type !== "customsnip") pawnFuncCollection.set(noTagFunc, pwnFun);
          }
        }
      } while (m);
    }
  });
};

export const parseWords = (textDocument: TextDocument) => {
  const regex = /[A-Za-z_:0-9]+/gm;
  const content = textDocument.getText();
  const splitContent = content.split("\n");
  const words: string[] = [];
  const wordCompletion: CompletionItem[] = [];
  let excempt = 0;
  splitContent.forEach((cont: string) => {
    if (commentRegex.test(cont)) {
      excempt++;
      // This is for single line block of comment, for example: 
      // /* Some comment text here */
      if (commentEndRegex.test(cont)) {
        excempt--;
      }
    } else if (commentEndRegex.test(cont)) {
      excempt--;
    } else if (excempt === 0 && !RegExp(/^\/\//gm).test(cont.trim())) {
      let m;
      do {
        m = regex.exec(cont);
        if (m) {
          if (words.indexOf(m[0]) === -1) words.push(m[0]);
        }
      } while (m);
    }
  });
  for (const key in words) {
    const element = words[key];
    const newSnip: CompletionItem = {
      label: element,
      kind: CompletionItemKind.Text,
      insertText: element,
    };
    wordCompletion.push(newSnip);
  }
  pawnWords.set(textDocument.uri, wordCompletion);
};

const getTextDocumentWorkspacePath = async (textDocument: TextDocument) => {
  const workspaceFolders = await connection.workspace.getWorkspaceFolders();
  if (workspaceFolders === null) return undefined;
  for (const workspace of workspaceFolders) {
    if (RegExp(workspace.uri).test(textDocument.uri)) return workspace;
  }
  return undefined;
};

const isParseAllowed = async (textDocument: TextDocument) => {
  const workspace = await getTextDocumentWorkspacePath(textDocument);
  if (workspace !== undefined) {
    const whiteListedPathFile = path.join(url.fileURLToPath(workspace.uri), "/.pawnignore");
    if (fs.existsSync(whiteListedPathFile)) {
      const data = fs.readFileSync(whiteListedPathFile, { encoding: "utf-8" });
      const allLines = data.split("\n").filter((line) => line.length > 0);
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

export const parseSnippets = async (textDocument: TextDocument, reset = true) => {
  const ext = path.extname(textDocument.uri);
  if (!isPawnExt(ext)) return false;
  if (reset) {
    pawnFuncCollection.forEach((value: PawnFunction, key: string) => {
      if (value.textDocument.uri === textDocument.uri) pawnFuncCollection.delete(key);
    });
    pawnWords.delete(textDocument.uri);
  }
  if (!(await isParseAllowed(textDocument))) return;

  const allowDefine = (await connection.workspace.getConfiguration({
    section: "pawn.language.allowDefine",
  })) as true | false | null;
  const allowDefineFunction = (await connection.workspace.getConfiguration({
    section: "pawn.language.allowDefineFunction",
  })) as true | false | null;
  const allowFunction = (await connection.workspace.getConfiguration({
    section: "pawn.language.allowFunction",
  })) as true | false | null;
  const allowNatives = (await connection.workspace.getConfiguration({
    section: "pawn.language.allowNatives",
  })) as true | false | null;
  const allowWords = (await connection.workspace.getConfiguration({
    section: "pawn.language.allowWords",
  })) as true | false | null;
  const allowCustomSnip = (await connection.workspace.getConfiguration({
    section: "pawn.language.allowCustomSnip",
  })) as true | false | null;

  if (allowNatives) parseNatives(textDocument);
  if (allowFunction) {
    parseForward(textDocument);
    parseFuncs(textDocument);
  }
  if (allowFunction) parseFuncsNonPrefix(textDocument);
  if (allowCustomSnip) parseCustomSnip(textDocument);
  if (allowDefineFunction) parseFuncsDefines(textDocument);
  if (allowDefine) parseDefine(textDocument);
  if (allowWords) parseWords(textDocument);
};

export const doCompletion = async (params: CompletionParams) => {
  const ext = path.extname(params.textDocument.uri);
  if (!isPawnExt(ext)) return undefined;
  const comItems: CompletionItem[] = [];
  pawnFuncCollection.forEach((res) => comItems.push(res.completion));
  const findSnip = pawnWords.get(params.textDocument.uri);
  if (findSnip !== undefined) findSnip.forEach((res) => comItems.push(res));
  return comItems;
};

export const doCompletionResolve = async (item: CompletionItem) => {
  item.insertText = item.insertText?.replaceAll("\\n", "\n");
  item.insertText = item.insertText?.replaceAll("\\t", "\t");
  return item;
};

export const doHover = (document: TextDocument, position: Position): Hover | undefined => {
  const ext = path.extname(document.uri);
  if (!isPawnExt(ext)) return undefined;
  const cursorIndex = positionToIndex(document.getText(), position);
  const result = findIdentifierAtCursor(document.getText(), cursorIndex);
  if (result.identifier.length === 0) return undefined;
  const snip = pawnFuncCollection.get(result.identifier);
  if (snip === undefined) return undefined;
  const markdown: MarkupContent = {
    kind: MarkupKind.Markdown,
    value: [
      "```pawn",
      snip.completion.label !== undefined && snip.completion.label,
      "```",
      "---",
      snip.completion.documentation !== undefined && snip.completion.documentation.toString(),
    ].join("\n"),
  };
  return {
    contents: markdown,
  };
};

export const doSignHelp = (document: TextDocument, position: Position): SignatureHelp | undefined => {
  const ext = path.extname(document.uri);
  if (!isPawnExt(ext)) return undefined;
  const cursorIndex = positionToIndex(document.getText(), position);
  const result = findFunctionIdentifier(document.getText(), cursorIndex);
  if (result.identifier === "") return undefined;
  const snip = pawnFuncCollection.get(result.identifier);
  if (snip === undefined) return undefined;
  return {
    activeParameter: 0,
    activeSignature: 0,
    signatures: [
      {
        label: snip.completion.label,
        parameters: snip.params,
        documentation: snip.completion.documentation,
        activeParameter: result.parameterIndex,
      },
    ],
  };
};

export const doGoToDef = (document: TextDocument, position: Position) => {
  const ext = path.extname(document.uri);
  if (!isPawnExt(ext)) return undefined;
  const cursorIndex = positionToIndex(document.getText(), position);
  const result = findIdentifierAtCursor(document.getText(), cursorIndex);
  if (result.identifier.length === 0) return;
  const snip = pawnFuncCollection.get(result.identifier);
  if (snip === undefined) return;
  return snip.definition;
};

import * as fs from "fs";
import * as path from "path";
import * as url from "url";
import { Location, Position, Range, SymbolInformation, SymbolKind } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

export interface IndexedSymbol {
  name: string;
  kind: SymbolKind;
  location: Location;
  containerName?: string;
}

export class IncludeIndexer {
  private symbols: Map<string, IndexedSymbol[]> = new Map();
  private symbolsLower: Map<string, IndexedSymbol[]> = new Map();
  private indexedFiles: Set<string> = new Set();
  private workspaceFolders: string[] = [];
  private extraIncludePaths: string[] = [];

  public setWorkspaceFolders(folders: string[]) {
    this.workspaceFolders = folders;
  }

  public setExtraIncludePaths(paths: string[]) {
    this.extraIncludePaths = paths;
  }

  public clear() {
    this.symbols.clear();
    this.symbolsLower.clear();
    this.indexedFiles.clear();
  }

  /**
   * Search for include file across standard Pawn/open.mp directories
   */
  public resolveIncludePath(includeName: string, currentFileDir?: string): string | undefined {
    let normalized = includeName.trim();
    if (!normalized.endsWith(".inc") && !normalized.endsWith(".pwn") && !normalized.endsWith(".p")) {
      normalized += ".inc";
    }

    const candidateDirs: string[] = [];
    if (currentFileDir) candidateDirs.push(currentFileDir);

    for (const ws of this.workspaceFolders) {
      candidateDirs.push(
        ws,
        path.join(ws, "include"),
        path.join(ws, "pawno", "include"),
        path.join(ws, "qawno", "include"),
        path.join(ws, "components"),
        path.join(ws, "gamemodes"),
        path.join(ws, "filterscripts")
      );
    }

    for (const extra of this.extraIncludePaths) {
      candidateDirs.push(extra);
    }

    for (const dir of candidateDirs) {
      const fullPath = path.resolve(dir, normalized);
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }

    return undefined;
  }

  /**
   * Parse and index a TextDocument
   */
  public indexDocument(document: TextDocument) {
    try {
      const filePath = url.fileURLToPath(document.uri);
      this.indexFile(filePath, document.getText());
    } catch (e) {
      // Ignore invalid URL schemes
    }
  }

  /**
   * Parse and index a file on disk or from buffer
   */
  public indexFile(filePath: string, fileContent?: string) {
    if (!fs.existsSync(filePath) && !fileContent) return;
    const resolvedPath = path.resolve(filePath);
    const fileUri = url.pathToFileURL(resolvedPath).toString();

    // Remove existing symbols for this file to handle re-indexing
    this.removeFileSymbols(fileUri);

    try {
      const content = fileContent !== undefined ? fileContent : fs.readFileSync(resolvedPath, "utf-8");
      this.indexedFiles.add(resolvedPath);

      const lines = content.split(/\r?\n/);
      let inComment = false;

      // Regex patterns
      const funcPattern = /(?:stock|public|forward|native)\s+(?:[A-Za-z0-9_]+:\s*)?([A-Za-z0-9_@]+)\s*\((.*?)\)/;
      const hookPattern = /hook\s+(?:public\s+|stock\s+)?([A-Za-z0-9_@]+)\s*\((.*?)\)/;
      const cmdPattern = /(?:YCMD|CMD|COMMAND|flags)\s*:\s*([A-Za-z0-9_@]+)\s*\((.*?)\)/;
      const timerPattern = /(?:task|ptask|timer)\s+([A-Za-z0-9_@]+)\s*\[/;
      const definePattern = /#define\s+([A-Za-z0-9_@]+)(?:\((.*?)\))?/;
      const includePattern = /#include\s+[<"]([^>"]+)[>"]/;
      const enumPattern = /enum\s+(?:([A-Za-z0-9_]+)\s*)?\{([^}]*)\}/;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Track multi-line comments
        if (line.includes("/*")) inComment = true;
        if (line.includes("*/")) {
          inComment = false;
          continue;
        }
        if (inComment || line.trim().startsWith("//")) continue;

        // Check #include and index referenced files recursively
        const incMatch = line.match(includePattern);
        if (incMatch) {
          const incTarget = this.resolveIncludePath(incMatch[1], path.dirname(resolvedPath));
          if (incTarget && !this.indexedFiles.has(incTarget)) {
            this.indexFile(incTarget);
          }
        }

        // 1. Standard functions / stocks / publics / forwards / natives
        const funcMatch = line.match(funcPattern);
        if (funcMatch) {
          const name = funcMatch[1];
          const startCol = line.indexOf(name);
          const loc = Location.create(fileUri, Range.create(i, startCol, i, startCol + name.length));
          this.addSymbol({
            name,
            kind: SymbolKind.Function,
            location: loc,
            containerName: path.basename(resolvedPath),
          });
        }

        // 2. YSI hooks
        const hookMatch = line.match(hookPattern);
        if (hookMatch) {
          const name = hookMatch[1];
          const startCol = line.indexOf(name);
          const loc = Location.create(fileUri, Range.create(i, startCol, i, startCol + name.length));
          this.addSymbol({
            name,
            kind: SymbolKind.Method,
            location: loc,
            containerName: `hook ${name}`,
          });
          // Also alias as hook:name
          this.addSymbol({
            name: `hook_${name}`,
            kind: SymbolKind.Method,
            location: loc,
            containerName: path.basename(resolvedPath),
          });
        }

        // 3. Command definitions (CMD:xxx, YCMD:xxx)
        const cmdMatch = line.match(cmdPattern);
        if (cmdMatch) {
          const name = cmdMatch[1];
          const startCol = line.indexOf(name);
          const loc = Location.create(fileUri, Range.create(i, startCol, i, startCol + name.length));
          this.addSymbol({
            name,
            kind: SymbolKind.Function,
            location: loc,
            containerName: `CMD:${name}`,
          });
          this.addSymbol({
            name: `cmd_${name}`,
            kind: SymbolKind.Function,
            location: loc,
            containerName: path.basename(resolvedPath),
          });
        }

        // 4. Tasks and Timers (task xxx[...], timer xxx[...])
        const timerMatch = line.match(timerPattern);
        if (timerMatch) {
          const name = timerMatch[1];
          const startCol = line.indexOf(name);
          const loc = Location.create(fileUri, Range.create(i, startCol, i, startCol + name.length));
          this.addSymbol({
            name,
            kind: SymbolKind.Event,
            location: loc,
            containerName: path.basename(resolvedPath),
          });
        }

        // 5. Preprocessor macros and constants
        const defMatch = line.match(definePattern);
        if (defMatch) {
          const name = defMatch[1];
          const startCol = line.indexOf(name);
          const loc = Location.create(fileUri, Range.create(i, startCol, i, startCol + name.length));
          this.addSymbol({
            name,
            kind: defMatch[2] ? SymbolKind.Function : SymbolKind.Constant,
            location: loc,
            containerName: path.basename(resolvedPath),
          });
        }
      }

      // 6. Multi-line Enums
      let enumMatch: RegExpExecArray | null;
      const globalEnumRegex = /enum\s+(?:([A-Za-z0-9_]+)\s*)?\{([^}]*)\}/g;
      while ((enumMatch = globalEnumRegex.exec(content)) !== null) {
        const enumName = enumMatch[1] || "AnonymousEnum";
        const enumStartIndex = enumMatch.index;
        const enumStartPos = this.indexToPosition(content, enumStartIndex);
        const enumLoc = Location.create(fileUri, Range.create(enumStartPos, enumStartPos));

        this.addSymbol({
          name: enumName,
          kind: SymbolKind.Enum,
          location: enumLoc,
          containerName: path.basename(resolvedPath),
        });

        // Index individual enum items
        const members = enumMatch[2].split(",");
        for (const rawMember of members) {
          const memberClean = rawMember.trim().split("=")[0].trim();
          if (memberClean.length > 0 && /^[A-Za-z0-9_]+$/.test(memberClean)) {
            const memberIdx = content.indexOf(memberClean, enumStartIndex);
            const memberPos = this.indexToPosition(content, memberIdx);
            this.addSymbol({
              name: memberClean,
              kind: SymbolKind.EnumMember,
              location: Location.create(fileUri, Range.create(memberPos, memberPos)),
              containerName: enumName,
            });
          }
        }
      }
    } catch (e) {
      // Ignore read errors for inaccessible files
    }
  }

  private addSymbol(sym: IndexedSymbol) {
    const list = this.symbols.get(sym.name) || [];
    list.push(sym);
    this.symbols.set(sym.name, list);

    const lower = sym.name.toLowerCase();
    const lowerList = this.symbolsLower.get(lower) || [];
    lowerList.push(sym);
    this.symbolsLower.set(lower, lowerList);
  }

  private removeFileSymbols(fileUri: string) {
    for (const [key, list] of this.symbols.entries()) {
      const filtered = list.filter((s) => s.location.uri !== fileUri);
      if (filtered.length === 0) {
        this.symbols.delete(key);
      } else {
        this.symbols.set(key, filtered);
      }
    }
    for (const [key, list] of this.symbolsLower.entries()) {
      const filtered = list.filter((s) => s.location.uri !== fileUri);
      if (filtered.length === 0) {
        this.symbolsLower.delete(key);
      } else {
        this.symbolsLower.set(key, filtered);
      }
    }
  }

  /**
   * Find definition for a given identifier
   */
  public findDefinition(identifier: string): Location | Location[] | undefined {
    // 1. Direct match
    const exact = this.symbols.get(identifier);
    if (exact && exact.length > 0) {
      return exact.length === 1 ? exact[0].location : exact.map((e) => e.location);
    }

    // 2. Case-insensitive match
    const lower = this.symbolsLower.get(identifier.toLowerCase());
    if (lower && lower.length > 0) {
      return lower.length === 1 ? lower[0].location : lower.map((e) => e.location);
    }

    // 3. Command prefix matching: /mycmd -> CMD:mycmd or cmd_mycmd
    if (identifier.startsWith("cmd_")) {
      const raw = identifier.substring(4);
      const sub = this.symbols.get(raw);
      if (sub && sub.length > 0) return sub[0].location;
    }

    // 4. Hook matching: OnPlayerConnect -> hook OnPlayerConnect
    const hookList = this.symbols.get(`hook_${identifier}`);
    if (hookList && hookList.length > 0) {
      return hookList[0].location;
    }

    return undefined;
  }

  /**
   * Provide workspace symbols matching search query
   */
  public searchWorkspaceSymbols(query: string): SymbolInformation[] {
    const results: SymbolInformation[] = [];
    const qLower = query.toLowerCase();

    for (const [name, syms] of this.symbols.entries()) {
      if (query.length === 0 || name.toLowerCase().includes(qLower)) {
        for (const sym of syms) {
          results.push({
            name: sym.name,
            kind: sym.kind,
            location: sym.location,
            containerName: sym.containerName,
          });
          if (results.length >= 100) return results; // Cap results for performance
        }
      }
    }

    return results;
  }

  private indexToPosition(text: string, index: number): Position {
    let line = 0;
    let character = 0;
    for (let i = 0; i < index && i < text.length; i++) {
      if (text[i] === "\n") {
        line++;
        character = 0;
      } else {
        character++;
      }
    }
    return { line, character };
  }
}

export const globalIncludeIndexer = new IncludeIndexer();

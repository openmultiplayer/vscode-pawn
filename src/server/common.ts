import { Position } from "vscode-languageserver";

export const isPawnExt = (ext: string) => {
  return ext === ".pwn" || ext === ".inc" || ext === ".pawn";
};

export const isAlpha = (character: string) => {
  return /[A-Za-z_@:]/.test(character);
};

export const isAlphaNum = (character: string) => {
  return /[\w@:]/.test(character);
};

export const isDigit = (character: string) => {
  return /\d/.test(character);
};

export const isWhitespace = (character: string) => {
  return /\s/.test(character);
};

export const reverse = (text: string) => {
  return [...text].reverse().join("");
};

export const fuzzy = (text: string, search: string) => {
  search = search.toLowerCase();
  text = text.toLowerCase();

  for (let i = 0, j = -1; i < search.length; i++) {
    const l = search[i];
    if (l === " ") continue;

    j = text.indexOf(l, j + 1);
    if (j === -1) return false;
  }
  return true;
};

export interface FindFunctionIdentifierResult {
  identifier: string;
  parameterIndex: number;
}

export const findFunctionIdentifier = (content: string, cursorIndex: number): FindFunctionIdentifierResult => {
  let index = cursorIndex - 1;
  let parenthesisDepth = 0;
  let identifier = "";
  let parameterIndex = 0;
  let inString = false;

  while (index >= 0) {
    // We surely know that we shouldn't search further if we encounter a semicolon
    if (content[index] === ";") {
      return { identifier: "", parameterIndex: 0 };
    }
    if (inString && content[index] === '"' && parenthesisDepth > 0 && content[index - 1] !== "\\") {
      inString = false;
      --parenthesisDepth;
      --index;
      continue;
    }
    if (!inString && content[index] === '"' && parenthesisDepth === 0) {
      inString = true;
      ++parenthesisDepth;
      --index;
      continue;
    }
    if (!inString && content[index] === "," && parenthesisDepth === 0) {
      ++parameterIndex;
    }
    if (content[index] === ")") {
      // Ignore the next '(', it's a nested call
      ++parenthesisDepth;
      --index;
      continue;
    }
    if (content[index] === "(") {
      if (parenthesisDepth > 0) {
        --parenthesisDepth;
        --index;
        continue;
      }

      // Identifier preceding this '(' is the function we are looking for
      // Skip all whitespaces first
      while (isWhitespace(content[--index])) {
        // just run this
      }

      // Copy the identifier
      while (index >= 0 && isAlphaNum(content[index])) {
        identifier += content[index];
        --index;
      }
      // Remove all digits from the end, an identifier can't start with a digit
      let identIndex = identifier.length;
      while (--identIndex >= 0 && isDigit(identifier[identIndex])) {
        // just run this
      }
      if (identIndex !== identifier.length - 1) {
        identifier = identifier.substring(0, identIndex + 1);
      }
      // Finally reverse it and return it
      return {
        identifier: reverse(identifier),
        parameterIndex: parameterIndex,
      };
    }

    --index;
  }

  return { identifier: "", parameterIndex: 0 };
};

export const positionToIndex = (content: string, position: Position) => {
  let line = 0;
  let index = 0;
  while (line !== position.line) {
    if (content[index] === "\n") {
      ++line;
    }
    ++index;
  }
  return index + position.character;
};

export const findIdentifierAtCursor = (content: string, cursorIndex: number): { identifier: string; isCallable: boolean } => {
  const result = {
    identifier: "",
    isCallable: false,
  };

  if (!isAlphaNum(content[cursorIndex])) {
    return result;
  }
  // Identifier must begin with alpha
  if (cursorIndex === 0 && isDigit(content[cursorIndex])) {
    return result;
  }
  if (cursorIndex > 0 && isDigit(content[cursorIndex]) && isWhitespace(content[cursorIndex - 1])) {
    return result;
  }

  let index = cursorIndex;
  // Copy from the left side of cursor
  while (index >= 0) {
    if (isAlphaNum(content[index])) {
      result.identifier += content[index];
      --index;
      continue;
    } else {
      // Reached the end of the identifier
      // Remove all digits from the end, an identifier can't start with a digit
      let identIndex = result.identifier.length;
      while (--identIndex >= 0 && isDigit(result.identifier[identIndex])) {
        // just run this
      }
      if (identIndex !== result.identifier.length - 1) {
        result.identifier = result.identifier.substring(0, identIndex + 1);
      }

      // Reverse the left part
      result.identifier = reverse(result.identifier);
      break;
    }
  }
  // Copy from the right side of cursor
  if (cursorIndex !== content.length - 1) {
    index = cursorIndex + 1;
    while (index < content.length) {
      if (isAlphaNum(content[index])) {
        result.identifier += content[index];
        ++index;
        continue;
      } else {
        // Reached the end of the identifier
        // Try to figure out if it's a callable
        while (index < content.length && isWhitespace(content[index])) {
          ++index;
        }
        if (content[index] === "(") {
          result.isCallable = true;
        }
        break;
      }
    }
  }
  return result;
};

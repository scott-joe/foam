import {
  EndOfLine,
  Range,
  TextDocument,
  window,
  Position,
  TextEditor
} from "vscode";

interface Point {
  line: number;
  column: number;
  offset?: number;
}

export const docConfig = { tab: "  ", eol: "\r\n" };

export const mdDocSelector = [
  { language: "markdown", scheme: "file" },
  { language: "markdown", scheme: "untitled" }
];

export function loadDocConfig() {
  // Load workspace config
  let activeEditor = window.activeTextEditor;
  if (!activeEditor) {
    console.log("Failed to load config, no active editor");
    return;
  }

  docConfig.eol = activeEditor.document.eol === EndOfLine.CRLF ? "\r\n" : "\n";

  let tabSize = Number(activeEditor.options.tabSize);
  let insertSpaces = activeEditor.options.insertSpaces;
  if (insertSpaces) {
    docConfig.tab = " ".repeat(tabSize);
  } else {
    docConfig.tab = "\t";
  }
}

export function isMdEditor(editor: TextEditor) {
  return editor && editor.document && editor.document.languageId === "markdown";
}

export function detectGeneratedCode(
  fullText: string,
  header: string,
  footer: string
): { range: Range | null; lines: string[] } {
  const lines = fullText.split(docConfig.eol);

  const headerLine = lines.findIndex(line => line === header);
  const footerLine = lines.findIndex(line => line === footer);

  if (headerLine < 0 || headerLine >= footerLine) {
    return {
      range: null,
      lines: []
    };
  }

  return {
    range: new Range(
      new Position(headerLine, 0),
      new Position(footerLine, lines[footerLine].length + 1)
    ),
    lines: lines.slice(headerLine + 1, footerLine + 1)
  };
}

export function hasEmptyTrailing(doc: TextDocument): boolean {
  return doc.lineAt(doc.lineCount - 1).isEmptyOrWhitespace;
}

export function getText(range: Range): string {
  return window.activeTextEditor.document.getText(range);
}

export function dropExtension(path: string): string {
  const parts = path.split(".");
  parts.pop();
  return parts.join(".");
}

/**
 *
 * @param point ast position (1-indexed)
 * @returns VSCode position  (0-indexed)
 */
export const astPositionToVsCodePosition = (point: Point): Position => {
  return new Position(point.line - 1, point.column - 1);
};

/**
 * Used for the "Copy to Clipboard Without Brackets" command
 *
 */
export function removeBrackets(s: string): string {
  // take in the string, split on space
  const stringSplitBySpace = s.split(" ");

  // loop through words
  const modifiedWords = stringSplitBySpace.map(currentWord => {
    if (currentWord.includes("[[")) {
      let word = currentWord.replace(/(\[\[)/g, "");
      word = word.replace(/(\]\])/g, "");
      word = word.replace(/(.mdx|.md|.markdown)/g, "");
      word = word.replace(/[-]/g, " ");

      // now capitalize every word
      const modifiedWord = word
        .split(" ")
        .map(word => word[0].toUpperCase() + word.substring(1))
        .join(" ");

      return modifiedWord;
    }

    return currentWord;
  });

  return modifiedWords.join(" ");
}


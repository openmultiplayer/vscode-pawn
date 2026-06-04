import * as vscode from "vscode";
import { SAMPDialog, DialogStyle, ColorSegment } from "./types";
import { parseColorCodes, parseListItems, parseHeaders, parseDialogs } from "./parser";

export class DialogPreviewPanel {
  public static currentPanel: DialogPreviewPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  private _currentDialog: SAMPDialog | undefined;
  private _allDialogs: SAMPDialog[] = [];
  private _currentIndex = 0;

  public static createOrShow(extensionUri: vscode.Uri, dialog: SAMPDialog, allDialogs: SAMPDialog[] = []) {
    const column = vscode.ViewColumn.Beside;

    if (DialogPreviewPanel.currentPanel) {
      DialogPreviewPanel.currentPanel._panel.reveal(column);
      DialogPreviewPanel.currentPanel._allDialogs = allDialogs;
      DialogPreviewPanel.currentPanel._updateCurrentIndex(dialog);
      DialogPreviewPanel.currentPanel._update(dialog);
      return;
    }

    const panel = vscode.window.createWebviewPanel("sampDialogPreview", "open.mp Dialog Preview", column, {
      enableScripts: true,
    });

    DialogPreviewPanel.currentPanel = new DialogPreviewPanel(panel, extensionUri, dialog, allDialogs);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, dialog: SAMPDialog, allDialogs: SAMPDialog[] = []) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._allDialogs = allDialogs;
    this._updateCurrentIndex(dialog);

    this._update(dialog);

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    vscode.workspace.onDidChangeTextDocument(
      (event) => {
        if (!this._currentDialog) return;
        if (event.document.uri.toString() !== this._currentDialog.documentUri) return;
        this._refreshFromDocument(event.document);
      },
      null,
      this._disposables,
    );

    // Handle messages from webview
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "goToHandler":
            vscode.commands.executeCommand("pawn-development.goToDialogHandler", this._currentDialog);
            break;
          case "goToDialog":
            vscode.commands.executeCommand("pawn-development.goToDialog", this._currentDialog);
            break;
          case "previousDialog":
            this._navigateDialog(-1);
            break;
          case "nextDialog":
            this._navigateDialog(1);
            break;
          case "selectListItem":
            vscode.commands.executeCommand("pawn-development.goToListItemHandler", this._currentDialog, message.listitem);
            break;
        }
      },
      null,
      this._disposables,
    );
  }

  private _updateCurrentIndex(dialog: SAMPDialog) {
    this._currentIndex = this._allDialogs.findIndex(
      (d) => d.range.start.line === dialog.range.start.line && d.documentUri === dialog.documentUri,
    );
    if (this._currentIndex === -1) this._currentIndex = 0;
  }

  private _navigateDialog(direction: number) {
    if (this._allDialogs.length === 0) return;

    this._currentIndex = (this._currentIndex + direction + this._allDialogs.length) % this._allDialogs.length;
    const newDialog = this._allDialogs[this._currentIndex];
    this._update(newDialog);

    // Also navigate to the dialog in the editor
    vscode.commands.executeCommand("pawn-development.goToDialog", newDialog);
  }

  public dispose() {
    DialogPreviewPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private _update(dialog: SAMPDialog) {
    this._currentDialog = dialog;
    this._panel.webview.html = this._getHtmlForWebview(dialog);
  }

  private _refreshFromDocument(document: vscode.TextDocument) {
    const dialogs = parseDialogs(document);
    this._allDialogs = dialogs;
    const currentLine = this._currentDialog?.range.start.line ?? 0;

    const sameLine = dialogs.find((d) => d.range.start.line <= currentLine && d.range.end.line >= currentLine);
    const byId = dialogs.find((d) => d.dialogId === this._currentDialog?.dialogId);
    const nextDialog = sameLine || byId || dialogs[0];

    if (nextDialog) {
      this._updateCurrentIndex(nextDialog);
      this._update(nextDialog);
    }
  }

  private _getHtmlForWebview(dialog: SAMPDialog): string {
    const styleContent = this._getStyles();
    const dialogContent = this._renderDialog(dialog);
    const dialogCount = this._allDialogs.length;
    const currentNum = this._currentIndex + 1;
    const showId = dialog.dialogId && !dialog.dialogId.startsWith("[");

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SA-MP Dialog Preview</title>
    <style>${styleContent}</style>
</head>
<body>
    <div class="toolbar">
        <div class="toolbar-left">
            <div class="toolbar-title">open.mp Dialog Preview</div>
            <div class="toolbar-nav">
                <button class="toolbar-btn" onclick="previousDialog()" title="Previous Dialog">Prev</button>
                <span class="toolbar-info">${currentNum} / ${dialogCount}</span>
                <button class="toolbar-btn" onclick="nextDialog()" title="Next Dialog">Next</button>
            </div>
        </div>
        <div class="toolbar-center">
            ${showId ? `<span class="toolbar-id">${this._escapeHtml(dialog.dialogId)}</span>` : ""}
        </div>
        <div class="toolbar-right">
            <button class="toolbar-btn" onclick="goToDialog()" title="Jump to dialog callsite">Go to Dialog</button>
            <button class="toolbar-btn" onclick="goToHandler()" title="Jump to dialog handler">Go to Handler</button>
        </div>
    </div>
    <div class="preview-container">
        <div class="zoom-controls" role="group" aria-label="Zoom controls">
            <button class="toolbar-btn" onclick="zoomOut()" title="Zoom out">-</button>
            <span class="toolbar-info" id="zoom-level">100%</span>
            <button class="toolbar-btn" onclick="zoomIn()" title="Zoom in">+</button>
            <button class="toolbar-btn" onclick="zoomReset()" title="Reset zoom">Reset</button>
        </div>
        <div class="dialog-wrapper">
            ${dialogContent}
        </div>
    </div>
    <script>
        const vscode = acquireVsCodeApi();
        let zoomLevel = 1;

        function setZoom(level) {
            zoomLevel = Math.min(1.6, Math.max(0.6, level));
            const wrapper = document.querySelector('.dialog-wrapper');
            if (wrapper) {
                wrapper.style.transform = 'scale(' + zoomLevel.toFixed(2) + ')';
            }
            const label = document.getElementById('zoom-level');
            if (label) {
                label.textContent = Math.round(zoomLevel * 100) + '%';
            }
        }

        function previousDialog() {
            vscode.postMessage({ command: 'previousDialog' });
        }

        function nextDialog() {
            vscode.postMessage({ command: 'nextDialog' });
        }

        function zoomIn() {
            setZoom(zoomLevel + 0.1);
        }

        function zoomOut() {
            setZoom(zoomLevel - 0.1);
        }

        function zoomReset() {
            setZoom(1);
        }

        function goToDialog() {
            vscode.postMessage({ command: 'goToDialog' });
        }

        function goToHandler() {
            vscode.postMessage({ command: 'goToHandler' });
        }

        function selectListItem(index) {
            // Update visual selection
            document.querySelectorAll('.dialog-list-item, .dialog-tablist-row').forEach((el, i) => {
                el.classList.toggle('selected', i === index);
            });
            // Navigate to handler
            vscode.postMessage({ command: 'selectListItem', listitem: index });
        }

        setZoom(1);
    </script>
</body>
</html>`;
  }

  private _renderDialog(dialog: SAMPDialog): string {
    const caption = this._renderColorText(parseColorCodes(dialog.caption));
    const button1 = this._renderColorText(parseColorCodes(dialog.button1));
    const button2 = dialog.button2 ? this._renderColorText(parseColorCodes(dialog.button2)) : "";

    let content = "";

    switch (dialog.style) {
      case DialogStyle.MSGBOX:
        content = this._renderMsgBox(dialog);
        break;
      case DialogStyle.INPUT:
        content = this._renderInput(dialog);
        break;
      case DialogStyle.LIST:
        content = this._renderList(dialog);
        break;
      case DialogStyle.PASSWORD:
        content = this._renderPassword(dialog);
        break;
      case DialogStyle.TABLIST:
        content = this._renderTabList(dialog);
        break;
      case DialogStyle.TABLIST_HEADERS:
        content = this._renderTabListHeaders(dialog);
        break;
    }

    const buttons = `
            <div class="dialog-buttons">
                <button class="dialog-button primary">${button1}</button>
                ${button2 ? `<button class="dialog-button secondary">${button2}</button>` : ""}
            </div>
        `;

    return `
            <div class="dialog">
                <div class="dialog-caption">${caption}</div>
                <div class="dialog-content">
                    ${content}
                </div>
                ${buttons}
            </div>
        `;
  }

  private _renderMsgBox(dialog: SAMPDialog): string {
    const info = this._renderMultilineText(dialog.info);
    return `<div class="dialog-info-text">${info}</div>`;
  }

  private _renderInput(dialog: SAMPDialog): string {
    const info = this._renderMultilineText(dialog.info);
    return `
            <div class="dialog-info-text">${info}</div>
            <input type="text" class="dialog-input" placeholder="Enter text..." />
        `;
  }

  private _renderPassword(dialog: SAMPDialog): string {
    const info = this._renderMultilineText(dialog.info);
    return `
            <div class="dialog-info-text">${info}</div>
            <input type="password" class="dialog-input" placeholder="Enter password..." value="********" />
        `;
  }

  private _renderList(dialog: SAMPDialog): string {
    const items = parseListItems(dialog.info, DialogStyle.LIST);
    let html = '<div class="dialog-list">';

    items.forEach((item, index) => {
      const itemText = item.columns[0] ? this._renderColorSegments(item.columns[0]) : "";
      html += `<div class="dialog-list-item${index === 0 ? " selected" : ""}" onclick="selectListItem(${index})" title="Click to go to case ${index}: handler">${itemText}</div>`;
    });

    html += "</div>";
    return html;
  }

  private _renderTabList(dialog: SAMPDialog): string {
    const items = parseListItems(dialog.info, DialogStyle.TABLIST);
    let html = '<div class="dialog-tablist">';

    items.forEach((item, index) => {
      html += `<div class="dialog-tablist-row${index === 0 ? " selected" : ""}" onclick="selectListItem(${index})" title="Click to go to case ${index}: handler">`;
      item.columns.forEach((col) => {
        html += `<div class="dialog-tablist-cell">${this._renderColorSegments(col)}</div>`;
      });
      html += "</div>";
    });

    html += "</div>";
    return html;
  }

  private _renderTabListHeaders(dialog: SAMPDialog): string {
    const headers = parseHeaders(dialog.info);
    const lines = dialog.info.split("\n");
    const itemsInfo = lines.slice(1).join("\n");
    const items = parseListItems(itemsInfo, DialogStyle.TABLIST_HEADERS);

    let html = '<div class="dialog-tablist">';

    // Render headers
    if (headers.length > 0) {
      html += '<div class="dialog-tablist-header">';
      headers.forEach((header) => {
        html += `<div class="dialog-tablist-cell header">${this._renderColorSegments(header)}</div>`;
      });
      html += "</div>";
    }

    // Render items
    items.forEach((item, index) => {
      html += `<div class="dialog-tablist-row${index === 0 ? " selected" : ""}" onclick="selectListItem(${index})" title="Click to go to case ${index}: handler">`;
      item.columns.forEach((col) => {
        html += `<div class="dialog-tablist-cell">${this._renderColorSegments(col)}</div>`;
      });
      html += "</div>";
    });

    html += "</div>";
    return html;
  }

  private _renderMultilineText(text: string): string {
    const lines = text.split("\n");
    return lines
      .map((line) => {
        const segments = parseColorCodes(line);
        const rendered = this._renderColorSegments(segments);
        // Handle tabs
        return rendered.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
      })
      .join("<br>");
  }

  private _renderColorText(segments: ColorSegment[]): string {
    return this._renderColorSegments(segments);
  }

  private _renderColorSegments(segments: ColorSegment[]): string {
    return segments
      .map((segment) => {
        const escapedText = this._escapeHtml(segment.text);
        if (segment.color) {
          return `<span style="color: ${segment.color}">${escapedText}</span>`;
        }
        return escapedText;
      })
      .join("");
  }

  private _escapeHtml(text: string): string {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  private _getStyleName(style: DialogStyle): string {
    switch (style) {
      case DialogStyle.MSGBOX:
        return "MSGBOX";
      case DialogStyle.INPUT:
        return "INPUT";
      case DialogStyle.LIST:
        return "LIST";
      case DialogStyle.PASSWORD:
        return "PASSWORD";
      case DialogStyle.TABLIST:
        return "TABLIST";
      case DialogStyle.TABLIST_HEADERS:
        return "TABLIST_HEADERS";
      default:
        return "Unknown";
    }
  }

  private _getStyles(): string {
    return `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            :root {
                --chrome-bg: #1a202c;
                --chrome-edge: #2d3748;
                --chrome-accent: #9083d2;
                --chrome-muted: #a0aec0;
                --chrome-text: #e2e8f0;
                --btn-bg: #2c323d;
                --btn-bg-hover: #3a4250;
                --btn-border: #424b5a;
                --page-bg: #1a202c;
            }

            @media (prefers-color-scheme: light) {
                :root {
                    --chrome-bg: #f7fafc;
                    --chrome-edge: #e2e8f0;
                    --chrome-accent: #6b5fb3;
                    --chrome-muted: #718096;
                    --chrome-text: #1a202c;
                    --btn-bg: #edf2f7;
                    --btn-bg-hover: #e2e8f0;
                    --btn-border: #cbd5e0;
                    --page-bg: #f7fafc;
                }
            }

            body {
                font-family: "Trebuchet MS", "Verdana", "Geneva", sans-serif;
                background: var(--page-bg);
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                color: var(--chrome-text);
            }

            .toolbar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: var(--chrome-bg);
                border-bottom: 1px solid var(--chrome-edge);
                padding: 6px 10px;
                position: sticky;
                top: 0;
                z-index: 100;
                box-shadow: 0 8px 14px rgba(0, 0, 0, 0.25);
            }

            .toolbar-left,
            .toolbar-center,
            .toolbar-right {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .toolbar-left {
                gap: 10px;
            }

            .toolbar-title {
                font-size: 13px;
                font-weight: 700;
                letter-spacing: 0.6px;
                text-transform: uppercase;
                color: var(--chrome-text);
            }

            .toolbar-nav {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 4px 6px;
                border: 1px solid var(--chrome-edge);
                border-radius: 999px;
                background: rgba(255, 255, 255, 0.03);
            }

            .toolbar-btn {
                background: var(--btn-bg);
                border: 1px solid var(--btn-border);
                color: var(--chrome-text);
                padding: 3px 9px;
                cursor: pointer;
                font-size: 10px;
                border-radius: 999px;
                letter-spacing: 0.2px;
            }

            .toolbar-btn:hover {
                background: var(--btn-bg-hover);
                color: #ffffff;
            }

            .toolbar-info {
                color: var(--chrome-muted);
                font-size: 11px;
                min-width: 46px;
                text-align: center;
            }

            .toolbar-id {
                color: var(--chrome-accent);
                font-size: 12px;
                font-family: "Consolas", "Courier New", monospace;
                padding: 2px 8px;
                border-radius: 6px;
                background: rgba(144, 131, 210, 0.1);
                border: 1px solid rgba(144, 131, 210, 0.25);
            }

            .toolbar-style {
                color: var(--chrome-muted);
                font-size: 10px;
                background: rgba(255, 255, 255, 0.05);
                padding: 3px 8px;
                border-radius: 999px;
                text-transform: uppercase;
                letter-spacing: 0.4px;
            }

            .preview-container {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
                position: relative;
            }

            .dialog-wrapper {
                display: flex;
                justify-content: center;
                transform-origin: center center;
                transition: transform 120ms ease-out;
            }

            .zoom-controls {
                position: absolute;
                right: 16px;
                bottom: 16px;
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 6px 8px;
                border-radius: 999px;
                background: rgba(0, 0, 0, 0.35);
                border: 1px solid var(--chrome-edge);
                backdrop-filter: blur(6px);
            }

            .dialog {
                background: rgba(0, 0, 0, 0.85);
                border: 1px solid #4a5568;
                min-width: 300px;
                max-width: 500px;
            }

            .dialog-caption {
                background: transparent;
                color: #ffffff;
                padding: 8px 10px;
                font-size: 13px;
                font-weight: normal;
                border-bottom: 1px solid #4a5568;
            }

            .dialog-content {
                padding: 0;
                color: #ffffff;
                font-size: 13px;
                line-height: 1.4;
            }

            .dialog-info-text {
                padding: 10px;
                white-space: pre-wrap;
            }

            .dialog-input {
                width: calc(100% - 20px);
                margin: 10px;
                padding: 4px 6px;
                background: #0a0a0a;
                border: 1px solid #4a5568;
                color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 13px;
                outline: none;
            }

            .dialog-list {
                background: #0a0a0a;
                border: 1px solid #4a5568;
                margin: 8px;
                max-height: calc(19 * 19px);
                overflow-y: auto;
            }

            .dialog-list-item {
                padding: 1px 6px;
                cursor: pointer;
                color: #ffffff;
                height: 19px;
                line-height: 17px;
            }

            .dialog-list-item:hover {
                background: #3d1a1a;
            }

            .dialog-list-item.selected {
                background: #6b1c1c;
                color: #ffffff;
            }

            .dialog-tablist {
                background: #0a0a0a;
                border: 1px solid #4a5568;
                margin: 8px;
                max-height: calc(19 * 19px);
                overflow-y: auto;
            }

            .dialog-tablist-header {
                display: flex;
                background: #2a2a2a;
                border-bottom: 1px solid #4a5568;
                font-weight: bold;
                color: #ffffff;
            }

            .dialog-tablist-row {
                display: flex;
                cursor: pointer;
                color: #ffffff;
                height: 19px;
                line-height: 17px;
            }

            .dialog-tablist-row:hover {
                background: #3d1a1a;
            }

            .dialog-tablist-row.selected {
                background: #6b1c1c;
                color: #ffffff;
            }

            .dialog-tablist-cell {
                flex: 1;
                padding: 1px 6px;
                min-width: 80px;
            }

            .dialog-tablist-cell.header {
                color: #ffffff;
                padding: 1px 6px;
            }

            .dialog-buttons {
                display: flex;
                justify-content: center;
                gap: 8px;
                padding: 10px;
                border-top: 1px solid #4a5568;
            }

            .dialog-button {
                padding: 2px 16px;
                font-family: Arial, sans-serif;
                font-size: 12px;
                cursor: pointer;
                background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 50%, #2a2a2a 51%, #1a1a1a 100%);
                border: 1px solid #6a6a6a;
                border-bottom-color: #1a1a1a;
                border-right-color: #1a1a1a;
                color: #d0d0d0;
            }

            .dialog-button:hover {
                background: linear-gradient(180deg, #6a6a6a 0%, #4a4a4a 50%, #3a3a3a 51%, #2a2a2a 100%);
            }

            .dialog-button:active {
                background: linear-gradient(180deg, #2a2a2a 0%, #3a3a3a 50%, #4a4a4a 51%, #5a5a5a 100%);
            }

            .dialog-button.primary {
                background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 50%, #2a2a2a 51%, #1a1a1a 100%);
                border: 1px solid #6a6a6a;
                border-bottom-color: #1a1a1a;
                border-right-color: #1a1a1a;
                color: #d0d0d0;
            }

            .dialog-button.secondary {
                background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 50%, #2a2a2a 51%, #1a1a1a 100%);
                border: 1px solid #6a6a6a;
                border-bottom-color: #1a1a1a;
                border-right-color: #1a1a1a;
                color: #d0d0d0;
            }

            /* Scrollbar styling - SA-MP style */
            ::-webkit-scrollbar {
                width: 16px;
                background: #1a1a1a;
            }

            ::-webkit-scrollbar-track {
                background: #1a1a1a;
                border-left: 1px solid #4a5568;
            }

            ::-webkit-scrollbar-thumb {
                background: linear-gradient(90deg, #4a4a4a 0%, #3a3a3a 50%, #2a2a2a 100%);
                border: 1px solid #5a5a5a;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(90deg, #5a5a5a 0%, #4a4a4a 50%, #3a3a3a 100%);
            }

            ::-webkit-scrollbar-button:vertical:start:decrement,
            ::-webkit-scrollbar-button:vertical:end:increment {
                height: 16px;
                background: linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 100%);
                border: 1px solid #5a5a5a;
            }
        `;
  }
}

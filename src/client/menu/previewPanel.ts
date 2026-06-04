import * as vscode from "vscode";
import { PawnMenu } from "./types";
import { ColorSegment } from "../dialog/types";

export class MenuPreviewPanel {
  public static currentPanel: MenuPreviewPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];
  private _currentMenu: PawnMenu | undefined;
  private _allMenus: PawnMenu[] = [];
  private _currentIndex = 0;

  public static createOrShow(menu: PawnMenu, allMenus: PawnMenu[] = []) {
    const column = vscode.ViewColumn.Beside;

    if (MenuPreviewPanel.currentPanel) {
      MenuPreviewPanel.currentPanel._panel.reveal(column);
      MenuPreviewPanel.currentPanel._allMenus = allMenus;
      MenuPreviewPanel.currentPanel._updateCurrentIndex(menu);
      MenuPreviewPanel.currentPanel._update(menu);
      return;
    }

    const panel = vscode.window.createWebviewPanel("pawnMenuPreview", "open.mp Menu Preview", column, {
      enableScripts: true,
    });

    MenuPreviewPanel.currentPanel = new MenuPreviewPanel(panel, menu, allMenus);
  }

  private constructor(panel: vscode.WebviewPanel, menu: PawnMenu, allMenus: PawnMenu[] = []) {
    this._panel = panel;
    this._allMenus = allMenus;
    this._updateCurrentIndex(menu);
    this._update(menu);

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "goToMenu":
            vscode.commands.executeCommand("pawn-development.goToMenu", this._currentMenu);
            break;
          case "previousMenu":
            this._navigateMenu(-1);
            break;
          case "nextMenu":
            this._navigateMenu(1);
            break;
        }
      },
      null,
      this._disposables,
    );
  }

  private _updateCurrentIndex(menu: PawnMenu) {
    this._currentIndex = this._allMenus.findIndex(
      (m) => m.range.start.line === menu.range.start.line && m.documentUri === menu.documentUri,
    );
    if (this._currentIndex === -1) this._currentIndex = 0;
  }

  private _navigateMenu(direction: number) {
    if (this._allMenus.length === 0) return;

    this._currentIndex = (this._currentIndex + direction + this._allMenus.length) % this._allMenus.length;
    const newMenu = this._allMenus[this._currentIndex];
    this._update(newMenu);
  }

  public dispose() {
    MenuPreviewPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private _update(menu: PawnMenu) {
    this._currentMenu = menu;
    this._panel.webview.html = this._getHtmlForWebview(menu);
  }

  private _getHtmlForWebview(menu: PawnMenu): string {
    const styleContent = this._getStyles();
    const menuContent = this._renderMenu(menu);
    const menuCount = this._allMenus.length;
    const currentNum = this._currentIndex + 1;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>open.mp Menu Preview</title>
    <style>${styleContent}</style>
</head>
<body>
    <div class="toolbar">
        <div class="toolbar-left">
            <div class="toolbar-title">open.mp Menu Preview</div>
            <div class="toolbar-nav">
                <button class="toolbar-btn" onclick="previousMenu()" title="Previous Menu">Prev</button>
                <span class="toolbar-info">${currentNum} / ${menuCount}</span>
                <button class="toolbar-btn" onclick="nextMenu()" title="Next Menu">Next</button>
            </div>
        </div>
        <div class="toolbar-right">
            <button class="toolbar-btn" onclick="goToMenu()">Go to Menu</button>
        </div>
    </div>
    <div class="preview-container">
        <div class="zoom-controls" role="group" aria-label="Zoom controls">
            <button class="toolbar-btn" onclick="zoomOut()" title="Zoom out">-</button>
            <span class="toolbar-info" id="zoom-level">100%</span>
            <button class="toolbar-btn" onclick="zoomIn()" title="Zoom in">+</button>
            <button class="toolbar-btn" onclick="zoomReset()" title="Reset zoom">Reset</button>
        </div>
        <div class="menu-wrapper">
            ${menuContent}
        </div>
    </div>
    <script>
        const vscode = acquireVsCodeApi();
        let zoomLevel = 1;

        function setZoom(level) {
            zoomLevel = Math.min(1.6, Math.max(0.6, level));
            const wrapper = document.querySelector('.menu-wrapper');
            if (wrapper) {
                wrapper.style.transform = 'scale(' + zoomLevel.toFixed(2) + ')';
            }
            const label = document.getElementById('zoom-level');
            if (label) {
                label.textContent = Math.round(zoomLevel * 100) + '%';
            }
        }

        function previousMenu() {
            vscode.postMessage({ command: 'previousMenu' });
        }

        function nextMenu() {
            vscode.postMessage({ command: 'nextMenu' });
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

        function goToMenu() {
            vscode.postMessage({ command: 'goToMenu' });
        }

        setZoom(1);
    </script>
</body>
</html>`;
  }

  private _renderMenu(menu: PawnMenu): string {
    const title = this._renderColorText(menu.title);
    const columns = Math.max(1, menu.columns);
    const rowCount = Math.max(...menu.items.map((col) => col.length), 0);
    const rows: string[] = [];

    for (let row = 0; row < rowCount; row++) {
      const cells: string[] = [];
      for (let col = 0; col < columns; col++) {
        const value = menu.items[col]?.[row];
        const cellContent = value ? this._renderColorText(value) : "&nbsp;";
        cells.push(`<div class="menu-cell">${cellContent}</div>`);
      }
      const rowClass = row === 0 ? "menu-row selected" : "menu-row";
      rows.push(`<div class="${rowClass}">${cells.join("")}</div>`);
    }

    return `
        <div class="menu">
            <div class="menu-title">${title}</div>
            <div class="menu-body">
                ${rows.join("")}
            </div>
        </div>
    `;
  }

  private _renderColorText(segments: ColorSegment[]): string {
    return segments
      .map((segment) => {
        if (segment.color) {
          return `<span style="color: ${segment.color}">${this._escapeHtml(segment.text)}</span>`;
        }
        return this._escapeHtml(segment.text);
      })
      .join("");
  }

  private _escapeHtml(text: string): string {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  private _getStyles(): string {
    return `
            :root {
                --chrome-bg: #1a202c;
                --chrome-edge: #2d3748;
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
                    --chrome-muted: #718096;
                    --chrome-text: #1a202c;
                    --btn-bg: #edf2f7;
                    --btn-bg-hover: #e2e8f0;
                    --btn-border: #cbd5e0;
                    --page-bg: #f7fafc;
                }
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: "Trebuchet MS", "Verdana", "Geneva", sans-serif;
                background: var(--page-bg);
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

            .preview-container {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
                position: relative;
            }

            .menu-wrapper {
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

            .menu {
                background: rgba(0, 0, 0, 0.85);
                border: 1px solid #4a5568;
                min-width: 320px;
                max-width: 520px;
                font-family: "Consolas", "Courier New", monospace;
                position: relative;
                padding-top: 10px;
            }

            .menu-title {
                position: absolute;
                top: -10px;
                left: 12px;
                padding: 0 6px;
                font-size: 18px;
                line-height: 20px;
                letter-spacing: 0.4px;
                color: #e4e2e5;
                background: rgba(0, 0, 0, 0.85);
            }

            .menu-body {
                padding: 10px 0 6px;
            }

            .menu-row {
                display: flex;
                border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            }

            .menu-row:last-child {
                border-bottom: none;
            }

            .menu-cell {
                flex: 1;
                padding: 4px 10px;
                border-right: 1px solid rgba(255, 255, 255, 0.06);
                font-size: 12px;
                color: #464d57;
            }

            .menu-cell:last-child {
                border-right: none;
            }

            .menu-row.selected .menu-cell,
            .menu-row:hover .menu-cell {
                color: #9bb2db;
            }
        `;
  }
}

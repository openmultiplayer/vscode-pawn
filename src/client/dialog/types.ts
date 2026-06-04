import * as vscode from "vscode";

/**
 * SA-MP Dialog Styles
 */
export enum DialogStyle {
  MSGBOX = 0,
  INPUT = 1,
  LIST = 2,
  PASSWORD = 3,
  TABLIST = 4,
  TABLIST_HEADERS = 5,
}

/**
 * Represents a parsed SA-MP dialog
 */
export interface SAMPDialog {
  /** The dialog ID (second parameter) */
  dialogId: string;
  /** The dialog style (0-5) */
  style: DialogStyle;
  /** Dialog window caption/title */
  caption: string;
  /** Main dialog content/info text */
  info: string;
  /** Left button text (response = 1) */
  button1: string;
  /** Right button text (response = 0), empty = hidden */
  button2: string;
  /** Position in the source document */
  range: vscode.Range;
  /** Document URI */
  documentUri: string;
  /** Raw ShowPlayerDialog call text */
  rawText: string;
}

/**
 * Represents a dialog response handler location
 */
export interface DialogResponseHandler {
  /** The dialog ID being handled */
  dialogId: string;
  /** Position in the source document */
  range: vscode.Range;
  /** Document URI */
  documentUri: string;
}

/**
 * Represents a parsed color segment in dialog text
 */
export interface ColorSegment {
  text: string;
  color: string | null; // null means default color
}

/**
 * Represents a list item in LIST/TABLIST dialogs
 */
export interface DialogListItem {
  columns: ColorSegment[][];
  rawText: string;
}

/**
 * Get the name of a dialog style
 */
export function getDialogStyleName(style: DialogStyle): string {
  switch (style) {
    case DialogStyle.MSGBOX:
      return "DIALOG_STYLE_MSGBOX";
    case DialogStyle.INPUT:
      return "DIALOG_STYLE_INPUT";
    case DialogStyle.LIST:
      return "DIALOG_STYLE_LIST";
    case DialogStyle.PASSWORD:
      return "DIALOG_STYLE_PASSWORD";
    case DialogStyle.TABLIST:
      return "DIALOG_STYLE_TABLIST";
    case DialogStyle.TABLIST_HEADERS:
      return "DIALOG_STYLE_TABLIST_HEADERS";
    default:
      return "Unknown";
  }
}

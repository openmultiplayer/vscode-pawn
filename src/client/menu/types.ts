import * as vscode from "vscode";
import { ColorSegment } from "../dialog/types";

export interface PawnMenu {
  menuName: string;
  title: ColorSegment[];
  columns: number;
  items: ColorSegment[][][];
  range: vscode.Range;
  documentUri: string;
  rawText: string;
}

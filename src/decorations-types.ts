import * as vscode from "vscode";

export const correctDecorationType = vscode.window.createTextEditorDecorationType({
	cursor: "help",
	borderWidth: "1px",
	borderStyle: "dashed",
	overviewRulerColor: "blue",
	overviewRulerLane: vscode.OverviewRulerLane.Right,
	light: { // light themes
		borderColor: "darkblue"
	},
	dark: { // dark themes
		borderColor: "lightblue"
	}
});

import config from "./config";
import * as vscode from "vscode";
import { Tex2Svg } from "./tex2svg";

export function activate(context: vscode.ExtensionContext) {

	const tex2Svg = new Tex2Svg(config.cacheSize);
	let timeout: NodeJS.Timer | undefined = undefined;
	let activeEditor = vscode.window.activeTextEditor;

	async function updateDecorations() {
		if (!activeEditor) {
			return;
		}

		const matchRegEx = new RegExp(config.matchReg, config.matchRegFlags);

		const text = activeEditor.document.getText();
		const wrongUsage: vscode.DecorationOptions[] = [];
		const correctUsage: vscode.DecorationOptions[] = [];
		let match;
		while ((match = matchRegEx.exec(text))) {
			const group1 = match[1];
			const groupMath = match.groups?.math;
			const latex = groupMath ?? group1;

			const start = match.index;
			const end = match.index + match[0].length;
			const startPos = activeEditor.document.positionAt(start);
			const endPos = activeEditor.document.positionAt(end);
			const range = new vscode.Range(startPos, endPos);

			console.log(`Match: ${match[0]}, match index: ${match.index}, match length: ${match[0].length}, processed: ${latex}`);

			const hoverUri = await tex2Svg.render(latex);
			const decoration = { range: range, hoverMessage: hoverUri.text };

			if (hoverUri.error) {
				wrongUsage.push(decoration);
			} else {
				correctUsage.push(decoration);
			}
		}
		activeEditor.setDecorations(config.wrongDecorationType, wrongUsage);
		activeEditor.setDecorations(config.correctDecorationType, correctUsage);
	}

	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		timeout = setTimeout(updateDecorations, config.updateInterval);
	}

	if (activeEditor) {
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

}


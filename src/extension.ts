import assert from "assert";
import config from "./config";
import { Tex2Svg } from "./tex2svg";
import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {
	const tex2Svg = new Tex2Svg(config.cacheSize);
	let timeout: NodeJS.Timeout | undefined = undefined;
	let activeEditor = vscode.window.activeTextEditor;

	async function updateDecorations() {

		let activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			return;
		}

		// "d" flag is required to know indices of match groups
		const matchRegEx = new RegExp(config.matchReg, config.matchRegFlags + "d");

		const text = activeEditor.document.getText();
		const wrongUsage: vscode.DecorationOptions[] = [];
		const correctUsage: vscode.DecorationOptions[] = [];
		let match;
		while ((match = matchRegEx.exec(text))) {
			const group1 = match[1];
			const groupMath = match.groups?.math;
			
			const useNamedGroup = groupMath !== undefined;
			const latex = useNamedGroup ? groupMath : group1;

			const indices = match.indices;
			// "d" flag was passed, indices will be present
			assert(indices !== undefined)

			const [start, end] = useNamedGroup ? indices.groups!.math : indices[1];
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
		activeEditor.setDecorations(config.correctDecorationType, correctUsage);
	}

	// The command has been defined in the package.json file // Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('mathover.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from mathover2!');
	});

	context.subscriptions.push(disposable);

	// This function "debounces" input events. The decorations will only be updated
	// if no changes happened for `updateInterval` milliseconds.
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

// This method is called when your extension is deactivated
export function deactivate() {}

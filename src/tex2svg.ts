import config from "./config";
import * as vscode from "vscode";
import DataURIParser from "datauri/parser";
import { LRUCache } from "./cache";

import { mathjax } from "mathjax-full/js/mathjax";
import { TeX } from "mathjax-full/js/input/tex"
import { SVG } from 'mathjax-full/js/output/svg';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor'
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html'



type renderResult = {
	text: string;
	error: boolean;
};

export class Tex2Svg {

	private cache: LRUCache;
	private parser: DataURIParser;

	private svgTextColor: string;
	private svgBackgroundColor: string;

	constructor(cacheLimit = 1024, color = "white") {
		this.svgTextColor = config.svgTextColor || color;
		this.svgBackgroundColor = config.svgBackgroundColor || "auto";
		this.cache = new LRUCache(cacheLimit);
		this.parser = new DataURIParser();
	}

	public async render(tex: string): Promise<renderResult> {
		const found = this.cache.get(tex);
		if (found) {
			return { text: found, error: false };
		}
		let node;

		const adaptor = liteAdaptor();
		RegisterHTMLHandler(adaptor);
		try {
			node = mathjax.document('', {InputJax: new TeX(), OutputJax: new SVG()}).convert(tex, {format: config.format, display: false, svg: true})
		} catch (err) {
			// vscode.window.showWarningMessage(err);
			return { text: err as string, error: true }; // return the string
		}

		let svg = adaptor.innerHTML(node);
		if (this.svgTextColor !== "auto") {
			svg = svg.replace(/"currentColor"/g, `"${this.svgTextColor}"`);
		}
		if (this.svgBackgroundColor !== "auto") {
			svg = svg.replace("style=\"", `style="background-color:${this.svgBackgroundColor};`);
		}
		const dataUri = this.parser.format(".svg", svg).content || "";
		if (dataUri.length === 0) {
			// throw Error(`cannot parse svg: ${svg}`);
			vscode.window.showWarningMessage(`cannot parse svg: ${svg}`);
		}
		const uri = `![](${dataUri})`; // as markdown image
		this.cache.set(tex, uri);
		return { text: uri, error: false };
	}

}


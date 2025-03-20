import { workspace, TextEditorDecorationType } from "vscode";
import { correctDecorationType } from "./decorations-types";

class MathOverConfig {
	private getConfig<T>(key: string): T {
	  const value = workspace.getConfiguration().get<T>(key);
	  if (value === undefined) {
		throw new Error(`Configuration value for "${key}" is undefined.`);
	  }
	  return value;
	}
  
	get format(): string {
	  return this.getConfig<string>("mathover.format");
	}
  
	get matchReg(): string {
	  return this.getConfig<string>("mathover.matchRegex");
	}
  
	get matchRegFlags(): string {
	  return this.getConfig<string>("mathover.matchRegexFlags");
	}
  
	get cacheSize(): number {
	  return this.getConfig<number>("mathover.cacheSize");
	}
  
	get updateInterval(): number {
	  return this.getConfig<number>("mathover.updateInterval");
	}
  
	get svgTextColor(): string {
	  return this.getConfig<string>("mathover.svgTextColor");
	}
  
	get svgBackgroundColor(): string {
	  return this.getConfig<string>("mathover.svgBackgroundColor");
	}
  
	// Note: Implement logic to ensure TextEditorDecorationType objects are correctly created
	get correctDecorationType(): TextEditorDecorationType {
	  return correctDecorationType; // Placeholder for actual implementation
	}
}

const mathOverConfig = new MathOverConfig();
export default mathOverConfig;

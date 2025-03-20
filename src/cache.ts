export class LRUCache {

	private capacity: number;
	private cache: Map<string, string>;

	constructor(capacity = 4096) {
		this.capacity = capacity;
		this.cache = new Map();
	}

	get(key: string): (string | undefined) {
		const item = this.cache.get(key);
		if (item) {
			this.cache.delete(key);
			this.cache.set(key, item);
		} else {
			return undefined;
		}
		return item;
	}

	set(key: string, value: string) {
		if (this.cache.has(key)) {
			this.cache.delete(key);
		}
		else if (this.cache.size === this.capacity) {
			const first = this.first();
			if (first !== undefined) {
				this.cache.delete(first);
			}
		}
		this.cache.set(key, value);
	}

	first(): string | undefined {
		return this.cache.keys().next().value;
	}
}

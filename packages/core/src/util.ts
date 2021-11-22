export function hash(value: string, bits = 16): number {
	let hash = 0;
	if (value.length == 0) return hash;
	for (let i = 0; i < value.length; i++) {
		const char = value.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}

	hash = hash >>> 0;
	hash = hash % (Math.pow(2, bits) - 1);

	return hash;
}

export default {
	hash,
};

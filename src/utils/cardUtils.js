
export function getKeyValues(key, value, dataSet) {
	if (dataSet === undefined) {
		return ;
	}
	const uniqueMap = new Map();
	for (const card of dataSet) {
		const code = card[`${key}`];
		const name = card[`${value}`];
		const pair = `${code}|${name}`
		if (!uniqueMap.has(pair)) {
			uniqueMap.set(pair, {
				[key]: code,
				[value]: name
			});
		}
	}
	return Array.from(uniqueMap.values());
}

export const initialState = {
	ownedPacks: [],
	filters: {
		aspects: [],
		types: [],
		packs: [],
		hero: [],
		sets: [],
	},
	deck: {
		hero: '',
		cards: [],
	}
}
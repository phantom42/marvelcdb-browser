import { initialState } from "./cardUtils";

export 	function getCardCounts(deck){
	const counts = deck.reduce((acc, card) => {
		acc[card.code] = (acc[card.code] || 0) + 1;
		return acc;
	}, {})
	return counts;
}

export function getCollectionCounts(cards){
	const collectionCounts = {};
	for (const card of cards) {
		const n = card.quantity || 1;
		const c = card.name || 'missing name';
		const existing = collectionCounts[c] || 0;
		collectionCounts[c] = existing + n;
	}
	return collectionCounts;
}
export function sortDeck(unsorted){
	const sorted = [...unsorted].sort((a,b) => {
		const aHero = a.card_set_type_name_code === 'hero';
		const bHero = b.card_set_type_name_code === 'hero';

		if (aHero !== bHero) return aHero ? -1 : 1;

		if (aHero) return compareNumber(a.position, b.position);

		return (
			compareString(a.faction_code, b.faction_code) ||
			compareString(a.card_type_code, b.card_type_code) ||
			compareNumber(a.cost, b.cost)
		)
	})
	return sorted;
}

const compareString = (a, b) =>
	(a ?? '').localeCompare(b ?? '');

const compareNumber = (a, b) =>
	(a ?? 0) - (b ?? 0);

export async function convertMCDBDeck(heroCode, deckData, allCards, ownedPacks){
	const convertedDeck = { ...initialState.deck };
	const newDeck = [];
	const heroCard = allCards.filter((card) => {
		return card.code === deckData.hero_code;
	})
	newDeck.push(heroCard[0]);
	const alterEgo = heroCard[0].linked_card;
	newDeck.push(alterEgo);

	const cardIds = Object.entries(deckData.slots).flatMap(([id, count]) =>
		Array(count).fill(id)
	);

	const slotCards = cardIds.map(id => {
		const card = allCards.find(c => c.code === id);
		if (!card) return null;

		const isOwned = ownedPacks.length === 0 || ownedPacks.includes(card.pack_code);
		if (isOwned) return card;

		const substitute = allCards.find(c =>
			ownedPacks.includes(c.pack_code) &&
			c.name === card.name &&
			c.faction_code === card.faction_code &&
			c.type_code === card.type_code &&
			c.cost === card.cost
		);
		return substitute ?? card;
	}).filter(Boolean);

	newDeck.push(...slotCards);
	convertedDeck.hero = heroCode;
	convertedDeck.cards = newDeck;
	return convertedDeck;
}
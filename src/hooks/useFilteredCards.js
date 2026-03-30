import { useMemo } from "react";
export function useFilteredCards(allCards, filters){
	return  useMemo(() => {
		const filtered = allCards.filter(card => {
			const packMatch = 
				filters.packs.length === 0 || 
				filters.packs.includes(card.pack_code);
			const aspectMatch = 
				filters.aspects.length === 0 ||
				filters.aspects.includes(card.faction_code);
			const typeMatch =
				filters.types.length === 0 ||
				filters.types.includes(card.type_code);
			
			return packMatch && aspectMatch && typeMatch;
			
		})
		
		return filtered.sort((a,b) => {
			if (a.type_code !== b.type_code) {
				return a.type_code.localeCompare(b.type_code);
			}
			const costA = Number.isInteger(a.cost) ? a.cost: Infinity;
			const costB = Number.isInteger(b.cost) ? b.cost: Infinity;

			if ( costA !== costB) {
				return costA - costB;
			}

			return a.name.localeCompare(b.name);
		})
	}, [allCards, filters])
}
import { useMemo } from "react";
export function useDeckStats(cards){
	return useMemo(() => {
			const stats = {
				byAspect: {},
				byCost: {},
				byType: {},
			};
	
			for (const card of cards) {
				// Skip hero set cards from stats
				//if (card.card_set_type_name_code === 'hero') continue;
	
				const aspect = card.faction_code ?? 'unknown';
				const cost = Number.isInteger(card.cost) ? card.cost : 0;
				const type = card.type_code ?? 'unknown';
				if (type === 'alter_ego') continue;
	
				stats.byAspect[aspect] = (stats.byAspect[aspect] ?? 0) + 1;
				stats.byCost[cost] = (stats.byCost[cost] ?? 0) + 1;
				stats.byType[type] = (stats.byType[type] ?? 0) + 1;
			}
			//console.log('stats',stats);
			return stats;
		}, [cards]);
}
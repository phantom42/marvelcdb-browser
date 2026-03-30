import { useMemo } from "react";
import { getKeyValues } from "../utils/cardUtils";
export function useCardsData(allCards, deckHeroCode) {

	
	const allPacks = useMemo(() => getKeyValues('pack_code', 'pack_name', allCards), [allCards]);
		const allTypes = useMemo(() => getKeyValues('type_code', 'type_name', allCards), [allCards]);
		const allAspects = useMemo(() => getKeyValues('faction_code', 'faction_name', allCards), [allCards]);
		const allSets = useMemo(() => getKeyValues('card_set_code', 'card_set_name', allCards), [allCards]);
		//const cardCounts = useMemo(() => getCardCounts(state.deck.cards),[state.deck.cards]);
	
		const rawHeroCards = useMemo(() => {
				const filteredHeroes = allCards.filter((card,index)=> {
					return (card.card_set_type_name_code === 'hero' &&  card.hidden === false && card.linked_to_code);
				})
				return filteredHeroes;
			},[allCards])
		
			const allHeroes = useMemo(() => getKeyValues('card_set_code', 'card_set_name', rawHeroCards), [rawHeroCards])
				.sort((a,b)=>{return a.card_set_name.localeCompare(b.card_set_name)});
			const deckHero = useMemo(() => {
				if (deckHeroCode === '') return '';
				const whichHero = allHeroes.filter(hero => {
					return hero.card_set_code === deckHeroCode;
				})
				if (whichHero.length) {
					return whichHero[0].card_set_name ;
				} else {
					return '';
				}
			},[deckHeroCode, allHeroes]);

	return {
		allPacks,
		allAspects,
		allSets,
		allTypes,
		//cardCounts,
		allHeroes,
		deckHero
	}
}
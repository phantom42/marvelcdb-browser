import { ACTIONS } from "../reducers/cardsReducer";
import { HERO_DECK_IDS } from "../data/heroDeckIds";
import { loadCards, fetchDeck } from "../services/cardsApi";
import { convertMCDBDeck } from "../utils/deckUtils";
export function useDeckActions(state, dispatch, allCards) {
	function addCardToDeck(card) {
			const conflict =card.is_unique !== undefined && card.is_unique === true && state.deck.cards.some(
				deckCard => deckCard.code === card.code
			);
			if (conflict){
				toast.warning('Card is unique and already in your deck');
				return null;
			}
			const maxLimit = card.deck_limit || 3;
			const existing = state.deck.cards.filter((deckCard) => {
				return deckCard.name === card.name;
			})
			if (existing.length >= maxLimit){
				toast.warning('max limit reached');
				return null;
			}
			if (state.deck.cards.length >= 50 || (state.deck.hero === '' && state.deck.cards.length >= 35)){
				toast.warning('max deck size limit reached');
				return null;
			}
			dispatch({type: ACTIONS.ADD_CARD_TO_DECK, payload: card});
		}
	function resetDeck(){
			localStorage.removeItem(import.meta.env.VITE_DECK);
			dispatch({
				type: ACTIONS.RESET_DECK,
				payload: []
			})
		}
	function loadStoredDeck() {
			const built = localStorage.getItem(import.meta.env.VITE_DECK);
			if (!built) return null;
			const deck = JSON.parse(built);
			dispatch({
				type: ACTIONS.LOAD_DECK,
				payload: deck
			})
		}
	
	function loadOwnedPacks(){
			const owned = localStorage.getItem(import.meta.env.VITE_OWNED_CARDS_KEY);
			if (!owned) return null;
			const loaded = JSON.parse(owned);
			dispatch({
				type: ACTIONS.LOAD_OWNED_PACKS,
				payload: loaded
			});
		}
	function setHero(hero){
			dispatch({
				type: ACTIONS.SET_HERO,
				payload: hero
			})
	
		}
	function convertHeroCode(cardId) {
			const heroCard = allCards.filter((card) => {
				return card.code === cardId;
			})
			//console.log(heroCard);
			//console.log(heroCard.length);
			let found_hero = '';
			if (heroCard.length) {
				const card = heroCard[0];
				found_hero = card.card_set_code;
			}
			//console.log(found_hero);
			return found_hero;
		}
		async function useUniversalPrebuiltDeck(hero_code){
			const deckId = HERO_DECK_IDS[hero_code].universal;
			if (!deckId) return false;
			const fetchedDeck = await fetchDeck(deckId);
			const fetchedHero = await convertHeroCode(fetchedDeck.hero_code);
			const convertedDeck = await convertMCDBDeck(fetchedHero, fetchedDeck, allCards, state.ownedPacks);
			//console.log(convertedDeck);
			dispatch({
				type: ACTIONS.USE_UNIVERSAL_DECK,
				payload: convertedDeck
			})
		}
	return { addCardToDeck, resetDeck, loadStoredDeck, loadOwnedPacks, setHero, convertHeroCode, useUniversalPrebuiltDeck };
}
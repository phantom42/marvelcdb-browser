import { sortDeck } from "../utils/deckUtils";
import { initialState } from "../utils/cardUtils";
export const ACTIONS = {
	TOGGLE_FILTER: 'toggle-filter',
	RESET_FILTERS: 'reset-filters',
	STORE_OWNED_PACKS: 'store-owned-packs',
	LOAD_OWNED_PACKS: 'load-owned-packs',
	ADD_CARD_TO_DECK: 'add-card-to-deck',
	REMOVE_CARD_FROM_DECK: 'remove-card-from-deck',
	REMOVE_CARD_FROM_DECK_BY_ID: 'remove-card-from-deck-by-id',
	REMOVE_CARD_FROM_DECK_BY_CODE: 'remove-card-from-deck-by-code',
	LOAD_DECK: 'load-deck',
	RESET_DECK: 'reset-deck',
	SET_HERO: 'set-hero',
	USE_UNIVERSAL_DECK: 'use-universal-deck',
	FIND_ALT: 'find-alt'

	
};

export function cardsReducer(state, action) {
	switch(action.type) {
		case (ACTIONS.TOGGLE_FILTER): {
			const {category, value} = action.payload;
			const current = state.filters[category];

			const updated = current.includes(value) 
				? current.filter(v => v !== value)
				: [...current, value];

			return {
				...state,
				filters: {
					...state.filters,
					[category]: updated
				}
			}
		}
		case (ACTIONS.RESET_FILTERS): {
			return {
				...state, 
				filters: initialState.filters
			}
		}
		case (ACTIONS.STORE_OWNED_PACKS): {
			return {
				...state,
				ownedPacks: action.payload,
				filters: {
					...state.filters,
					packs: action.payload
				}
			}
		}
		case (ACTIONS.LOAD_OWNED_PACKS): {
			return {
				...state,
				ownedPacks: action.payload,
				filters: {
					...state.filters,
					packs: action.payload
				}
			}
		}
		case (ACTIONS.ADD_CARD_TO_DECK): {
			const fixedCard = {...action.payload, deck_card_id: `${action.payload.code}-${crypto.randomUUID()}`}
			return {
				...state,
				deck: {
					...state.deck,
					cards: [...state.deck.cards, 
						fixedCard
					]
				}
			}
		}
		case (ACTIONS.REMOVE_CARD_FROM_DECK_BY_ID):{
			let removed = false;
			const filtered = state.deck.cards.filter((card) => {
				return card.deck_card_id !== action.payload.deck_card_id
			});
			return {
				...state,
				deck: {...state.deck,
					cards: filtered
				}
			};
		}
		case (ACTIONS.REMOVE_CARD_FROM_DECK_BY_CODE): {
			let removed = false;
			const filtered = [];
			state.deck.cards.map((card) => {
				if (!removed && card.code == action.payload.code) {
					removed = true;
				} else {
					filtered.push(card);
				}
			})
			return {
				...state,
				deck: {...state.deck,
					cards: filtered
				}
			}
		}

		case (ACTIONS.LOAD_DECK):{
			return {
				...state,
				deck: action.payload
			}
		}
		case (ACTIONS.RESET_DECK): {
			return {
				...state,
				deck: initialState.deck
			}
		}
		case (ACTIONS.SET_HERO): {
			const hero_code = action.payload.hero;
			const non_hero_cards = state.deck.cards.filter((card) => 
				!card.card_set_type_name_code 
					|| card.card_set_type_name_code !== 'hero'
				)
			const hero_cards = action.payload.allCards.filter((card) => 
				card.card_set_type_name_code 
					&& card.card_set_type_name_code === 'hero' 
					&& card.card_set_code === hero_code
				)
			const full_hero_cards = [];
			hero_cards.forEach( card => {
				const quantity = card.quantity ?? 1;
				for (let i = 0; i < quantity; i++) {
					full_hero_cards.push({...card});
				}
			})
			const fullDeck = [...non_hero_cards, ...full_hero_cards];
			const decKWithIds = [];
			fullDeck.forEach((card) => {
				const id = card.deck_card_id || `${card.code}-${crypto.randomUUID()}`
				decKWithIds.push({...card, deck_card_id: id})
			})

			const sortedDeck = sortDeck(decKWithIds);
			return {
				...state,
				deck: {
					...state.deck,
					cards: sortedDeck,
					hero: action.payload.hero
				}
			}
		}
		case (ACTIONS.USE_UNIVERSAL_DECK): {
			const sortedDeck = sortDeck(action.payload.cards);
			return {
				...state,
				deck: {
					hero: action.payload.hero,
					cards: sortedDeck
				}
			}
		}
		case (ACTIONS.FIND_ALT): {
			return {
				...state,
				filters: {
					...state.filters,
					aspects: [action.payload.faction_code],
					types: [action.payload.type_code]
				}
			}
		}

		default: return state;
	}
}

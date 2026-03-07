
import { useReducer, useMemo, useContext, createContext, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

const CardsContext = createContext(null);

const ACTIONS = {
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

	
};

const initialState = {
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

function cardsReducer(state, action) {
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

		default: return state;
	}
}

export function CardsProvider({children}) {
	const [state, dispatch] = useReducer(cardsReducer, initialState, (init)=> {
		const storedDeck = localStorage.getItem(import.meta.env.VITE_DECK);
		const storedPacks = localStorage.getItem(import.meta.env.VITE_OWNED_CARDS_KEY);
		const storedFilters = localStorage.getItem(import.meta.env.VITE_PERSISTENT_FILTERS);
		return {
			...init,
			ownedPacks: storedPacks ? JSON.parse(storedPacks) : [],
			deck: storedDeck ? JSON.parse(storedDeck) : initialState.deck,
			filters: storedFilters ? JSON.parse(storedFilters) : initialState.filters
		}
	});
	const [allCards, setAllCards] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	let deckCounter = useRef(0);

	const allPacks = useMemo(() => getKeyValues('pack_code', 'pack_name', allCards), [allCards]);
	const allTypes = useMemo(() => getKeyValues('type_code', 'type_name', allCards), [allCards]);
	const allAspects = useMemo(() => getKeyValues('faction_code', 'faction_name', allCards), [allCards]);
	const allSets = useMemo(() => getKeyValues('card_set_code', 'card_set_name', allCards), [allCards]);
	const cardCounts = useMemo(() => getCardCounts(state.deck.cards),[state.deck.cards]);
	
	
	const rawHeroCards = useMemo(() => {
		const filteredHeroes = allCards.filter((card,index)=> {
			return (card.card_set_type_name_code === 'hero' && card.position ===1 && card.hidden === false && card.linked_to_code);
		})
		return filteredHeroes;
	},[allCards])

	const allHeroes = useMemo(() => getKeyValues('card_set_code', 'card_set_name', rawHeroCards), [rawHeroCards]).sort((a,b)=>{return a.card_set_name.localeCompare(b.card_set_name)});
	const deckHero = useMemo(() => {
		if (state.deck.hero === '') return '';
		const whichHero = allHeroes.filter(hero => {
			return hero.card_set_code === state.deck.hero;
		})
		if (whichHero.length) {
			return whichHero[0].card_set_name ;
		} else {
			return '';
		}
	},[state.deck.hero, allHeroes]);


	useEffect(() => {
		async function loadCards() {
			const cachedData = getCachedCards();
			if (cachedData) {
				setAllCards(cachedData);
				return ;
			}
			try {
				const apiEndpoint = import.meta.env.VITE_API_ENDPOINT ;
				const url = apiEndpoint + 'cards/';
				const res = await fetch(url);
				const data = await res.json();
				setAllCards(data);
				localStorage.setItem(
					import.meta.env.VITE_CACHE_KEY,
					JSON.stringify({data, timestamp: Date.now()

					})
				);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		loadCards();
	},[]) //only runs once

	useEffect(() => {
		if (state.deck.cards.length > deckCounter.current) {
			toast.success('Card added');
		} else if (state.deck.cards.length < deckCounter.current ) {
			if (deckCounter.current - state.deck.cards.length > 1){
				toast.warning('Cards removed');
			} else {
				toast.warning('Card removed');
			}
		}
		deckCounter.current = state.deck.cards.length;

		
	}, [state.deck.cards])

	useEffect(() => {
		localStorage.setItem(import.meta.env.VITE_DECK, JSON.stringify(state.deck))
	}, [state.deck])
	
	const filteredCards = useMemo(() => {
		const filtered = allCards.filter(card => {
			const packMatch = 
				state.filters.packs.length === 0 || 
				state.filters.packs.includes(card.pack_code);
			const aspectMatch = 
				state.filters.aspects.length === 0 ||
				state.filters.aspects.includes(card.faction_code);
			const typeMatch =
				state.filters.types.length === 0 ||
				state.filters.types.includes(card.type_code);
			
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
	}, [allCards, state.filters])

	const collectionCounts = useMemo(() => getCollectionCounts(state.deck.cards), [filteredCards]);

	const deckStats = useMemo(() => {
		const stats = {
			byAspect: {},
			byCost: {},
			byType: {},
		};

		for (const card of state.deck.cards) {
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
		console.log('stats',stats);
		return stats;
	}, [state.deck.cards]);

	function getCardCounts(deck){
		const counts = deck.reduce((acc, card) => {
			acc[card.code] = (acc[card.code] || 0) + 1;
			return acc;
		}, {})
		return counts;
	}

	function getCollectionCounts(deck){
		const collectionCounts = {};
		for (const card of filteredCards) {
			const n = card.quantity || 1;
			const c = card.name || 'missing name';
			const existing = collectionCounts[c] || 0;
			collectionCounts[c] = existing + n;
		}
		return collectionCounts;
	}

	function getCachedCards() {
		const cached = localStorage.getItem(import.meta.env.VITE_CACHE_KEY);
		if (!cached) return null;
		const parsed = JSON.parse(cached);
		const isExpired = Date.now() - parsed.timestamp > import.meta.env.VITE_CACHE_LIFETIME;

		return isExpired ? null : parsed.data;
	}

	function getKeyValues(key, value, dataSet) {
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
	useEffect(() => {
		localStorage.setItem(import.meta.env.VITE_PERSISTENT_FILTERS, JSON.stringify(state.filters));
	}, [state.filters])

	function getCard(code) {
		return allCards.filter((card) => card.code === code);
	}
	function setOwnedPacks() {
		localStorage.setItem(import.meta.env.VITE_OWNED_CARDS_KEY, JSON.stringify(state.filters.packs));
		dispatch({
			type: ACTIONS.STORE_OWNED_PACKS,
			payload: state.filters.packs
		})
		toast.success('Owned Content Saved');
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
	function loadStoredDeck() {
		const built = localStorage.getItem(import.meta.env.VITE_DECK);
		if (!built) return null;
		const deck = JSON.parse(built);
		dispatch({
			type: ACTIONS.LOAD_DECK,
			payload: deck
		})
	}
	function resetDeck(){
		localStorage.removeItem(import.meta.env.VITE_DECK);
		dispatch({
			type: ACTIONS.RESET_DECK,
			payload: []
		})
	}
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

	function displaySuccess(msg) {
		dispatch({
			TYPE: ACTIONS.DISPLAY_SUCCESS,
			payload: msg
		})
	}
	function throwError(msg){
		dispatch( {
			type: ACTIONS.DISPLAY_ERROR,
			payload: msg
		})

	}
	function setHero(hero){
		dispatch({
			type: ACTIONS.SET_HERO,
			payload: hero
		})

	}

	

	const exports = {
		actions: ACTIONS,
		allCards,
		allAspects,
		allTypes,
		allPacks,
		allSets,
		allHeroes,
		deckHero,
		cardCounts,
		deckStats,
		filters: state.filters,
		dispatch,
		filteredCards,
		getCard,
		setOwnedPacks, 
		loadOwnedPacks,
		loadStoredDeck,
		resetDeck,
		addCardToDeck,
		deck: state.deck,
		collectionCounts,
		ownedPacks: state.ownedPacks
	}

	return (
		<CardsContext.Provider value={exports}>{children}</CardsContext.Provider>
	)
}

export function useCards() {
	const context = useContext(CardsContext);
	if (!context) {
		throw new Error('useCards must be within a CardsProvider');
	}
	return context ;
}
const compareString = (a, b) =>
  (a ?? '').localeCompare(b ?? '');

const compareNumber = (a, b) =>
  (a ?? 0) - (b ?? 0);
function sortDeck(unsorted){
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
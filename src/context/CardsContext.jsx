
import { toast } from "react-toastify";
import { useReducer, useMemo, useContext, createContext, useEffect, useState, useRef } from "react";
import { cardsReducer, ACTIONS } from "../reducers/cardsReducer";
import {  initialState } from "../utils/cardUtils";
import { loadCards } from "../services/cardsApi";
import { getCardCounts, getCollectionCounts } from "../utils/deckUtils";
import { useCardsData } from "../hooks/useCardsData";
import { useDeckActions } from "../hooks/useDeckActions";
import { useDeckStats } from "../hooks/useDeckStats";
import { useFilteredCards } from "../hooks/useFilteredCards";

const CardsContext = createContext(null);



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
	
	const cardCounts = useMemo(() => getCardCounts(state.deck.cards),[state.deck.cards]);
	const { 
		allPacks,
		allTypes,
		allAspects,
		allSets,
		allHeroes,
		deckHero,
	} = useCardsData(allCards, state.deck.hero);

	const {
		addCardToDeck,
		resetDeck,
		loadStoredDeck,
		loadOwnedPacks,
		setHero,
		convertHeroCode,
		useUniversalPrebuiltDeck
	} = useDeckActions(state, dispatch, allCards);
	const filteredCards = useFilteredCards(allCards, state.filters);
	const collectionCounts = useMemo(() => getCollectionCounts(filteredCards), [filteredCards]);

	const deckStats = useDeckStats(state.deck.cards);

	useEffect(() => {
		async function callApi() {
			const cardData = await loadCards();
			setAllCards(cardData);
		}
		callApi();
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

	
	
	useEffect(() => {
		localStorage.setItem(import.meta.env.VITE_PERSISTENT_FILTERS, JSON.stringify(state.filters));
	}, [state.filters])

	function getCard(code) {
		return allCards.filter((card) => card.code === code);
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
	function setOwnedPacks() {
		localStorage.setItem(import.meta.env.VITE_OWNED_CARDS_KEY, JSON.stringify(state.filters.packs));
		dispatch({
			type: ACTIONS.STORE_OWNED_PACKS,
			payload: state.filters.packs
		})
		toast.success('Owned Content Saved');
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
		useUniversalPrebuiltDeck,
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

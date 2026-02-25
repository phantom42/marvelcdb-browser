import {createContext, useContext, useState, useEffect} from 'react';

const CardsContext = createContext(null);

export function CardsProvider({children}) {
	const [allCards, setAllCards] = useState([]);

	// load all cards
	useEffect(() => {
		async function loadCards() {
			try {
				const apiEndpoint = import.meta.env.VITE_API_ENDPOINT ;
				const url = apiEndpoint + 'cards/';
				const res = await fetch(url);
				const data = await res.json();
				setAllCards(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		loadCards();
	},[]) //only runs once


}

export function useCards() {
	const context = useContext(CardsContext);
	if (!context) {
		throw new Error('useCards must be used within CardsProvider');
	}
	return context;
}
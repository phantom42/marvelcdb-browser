import {createContext, useContext, useState, useEffect, useMemo} from 'react';

const CardsContext = createContext(null);

export function CardsProvider({children}) {
	const [allCards, setAllCards] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// load all cards
	useEffect(() => {
		async function loadCards() {
			try {
				const apiEndpoint = import.meta.env.VITE_API_ENDPOINT ;
				const url = apiEndpoint + 'cards/';
				const res = await fetch(url);
				const data = await res.json();
				//console.log(data);
				setAllCards(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		loadCards();
	},[]) //only runs once
	
	const allPacks = useMemo(() => getKeyValues('pack_code', 'pack_name'), [allCards]);
	const allTypes = useMemo(() => getKeyValues('type_code', 'type_name'), [allCards]);
	const allAspects = useMemo(() => getKeyValues('faction_code', 'faction_name'), [allCards]);

	
	function getKeyValues(key, value) {
		if (allCards === undefined) {
			return ;
		}
		const uniqueMap = new Map();
		for (const card of allCards) {
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

	return (
		<CardsContext.Provider 
			value={{allCards, allPacks, allAspects, allTypes}}>
				{children}
		</CardsContext.Provider>
	)
}

export function useCards() {
	const context = useContext(CardsContext);
	if (!context) {
		throw new Error('useCards must be used within CardsProvider');
	}
	return context;
}
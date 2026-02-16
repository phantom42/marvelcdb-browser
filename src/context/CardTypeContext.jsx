import { createContext, useContext, useState, useEffect } from "react";

const CardTypeContext = createContext(null);

export function CardTypeProvider({children}) {
	const [selectedCardTypes, setSelectedCardTypes] = useState(() => {
		const local = localStorage.getItem('mccb-selectedCardTypes');
		return local 
			? JSON.parse(local)
			: []
	});

	function toggleCardType(code) {
		setSelectedCardTypes(prev => 
			prev.includes(code)
			? prev.filter( a => a !== code)
			: [...prev, code]
		)
	}

	function selectAll(cardTypes) {
		setSelectedCardTypes(cardTypes);
	}

	function clearAll() {
		setSelectedCardTypes([]);
	}
	useEffect(()=> {
		localStorage.setItem('mccb-selectedCardTypes', JSON.stringify(selectedCardTypes));
	},[selectedCardTypes])

	return(
		<CardTypeContext.Provider
		value={{ selectedCardTypes, toggleCardType, selectAll, clearAll }}
		>
			{children}
		</CardTypeContext.Provider>
	)
}

export function useCardTypes() {
	const context = useContext(CardTypeContext);
	if (!context) {
		throw new Error('cardTypes must be used within CardTypeProvider')
	}
	return context;
}
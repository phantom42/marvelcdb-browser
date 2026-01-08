import { createContext, useContext, useState } from "react";

const CardTypeContext = createContext(null);

export function CardTypeProvider({children}) {
	const [selectedCardTypes, setSelectedCardTypes] = useState([]);

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
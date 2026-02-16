import {createContext, useContext, useState, useEffect} from 'react';

const PackContext = createContext(null);

export function PackProvider({ children }){
	const [selectedPacks, setSelectedPacks] = useState(()=>{
		const local = localStorage.getItem('mccb-selectedPacks');
		return local
			? JSON.parse(local)
			: []
	});

	function togglePack(code) {
		setSelectedPacks(prev => 
			prev.includes(code)
			? prev.filter( a => a !== code)
			: [...prev, code]
		)
	}

	function selectAll(packs) {
		setSelectedPacks(packs);
	}

	function clearAll(){
		setSelectedPacks([]);
	}

	useEffect(() => {
		localStorage.setItem('mccb-selectedPacks', JSON.stringify(selectedPacks))
	},[selectedPacks]);
	return (
		<PackContext.Provider
			value={{ selectedPacks, togglePack, selectAll, clearAll }}>
				{children}
		</PackContext.Provider>
	)
}

export function usePacks() {
	const context = useContext(PackContext);
	if (!context) {
		throw new Error('usepacks must be used within a packprovider');
	}
	return context ;
}
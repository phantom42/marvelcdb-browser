import { createContext, useContext, useState, useEffect } from "react";

const AspectContext = createContext(null);

export function AspectProvider({ children }) {
	const [selectedAspects, setSelectedAspects] = useState(() => {
		const local = localStorage.getItem('mccb-selectedAspects');
		return local
			? JSON.parse(local)
			: []
	});

	function toggleAspect(code) {
		setSelectedAspects(prev => 
			prev.includes(code)
			? prev.filter( a => a !== code)
			: [...prev, code]

			/*
			function (a) {
				return a !== code;
			}
			*/
		)
	}

	function selectAll(aspects) {
		setSelectedAspects(aspects);
	}

	function clearAll(){
		setSelectedAspects([]);
	}

	useEffect(() => {
		localStorage.setItem('mccb-selectedAspects', JSON.stringify(selectedAspects));
	}, [selectedAspects])
	return (
		<AspectContext.Provider
			value={{ selectedAspects, toggleAspect, selectAll, clearAll}}
			>
			{children}
		</AspectContext.Provider>
	)
}

export function useAspects() {
  const context = useContext(AspectContext);
  if (!context) {
    throw new Error("useAspects must be used within an AspectProvider");
  }
  return context;
}
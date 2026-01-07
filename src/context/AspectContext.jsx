import { createContext, useContext, useState } from "react";

const AspectContext = createContext(null);

export function AspectProvider({ children }) {
	const [selectedAspects, setSelectedAspects] = useState([]);

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
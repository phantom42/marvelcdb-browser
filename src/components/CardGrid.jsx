import { useAspects } from "../context/AspectContext";
import { useCardTypes } from "../context/CardTypeContext";
import { usePacks } from "../context/PackContext";
import { useState, useEffect, useMemo, useRef } from "react";
import Card from "./Card";

const PAGE_SIZE = Number(import.meta.env.VITE_NUMBER_IMAGES_TO_LOAD);

export default function CardGrid(){
	const [allCards, setAllCards] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

	const { selectedAspects } = useAspects();
	const { selectedCardTypes} = useCardTypes();
	const { selectedPacks } = usePacks();
	const observerRef = useRef(null) ; // mutable dom object in memory - updates do NOT trigger rerender

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

	// reset visibleCount when aspects change
	useEffect(() => {
		setVisibleCount(PAGE_SIZE);
	}, [selectedAspects]);
	
	// filter cards based on selected aspects/factions
	// useMemo for caching the filtering
	
	const matches =(selected, value) => {
		const doesMatch = selected.length === 0 || selected.includes(value)
		console.log(doesMatch)
		return doesMatch;
	}
	const filteredCards = useMemo(() => {
		if (selectedAspects.length === 0 && selectedCardTypes.length === 0 && selectedPacks.length === 0) return [];
		
		return [...allCards]
			.filter(card => matches(selectedCardTypes,card.type_code))
			.filter(card => matches(selectedAspects, card.faction_code))
			.filter(card => matches(selectedPacks, card.pack_code))
			.filter((card, index, self) => 
				index === self.findIndex(c => c.name === card.name)
			)
			.sort((a,b) => {
				if (a.type_code !== b.type_code) {
					return a.type_code.localeCompare(b.type_code);
				}

				const costA = Number.isInteger(a.cost) ? a.cost : Infinity;
				const costB = Number.isInteger(b.cost) ? b.cost : Infinity;

				if ( costA !== costB) {
					return costA - costB
				}

				return a.name.localeCompare(b.name);
			});
	}, [allCards,selectedAspects,selectedCardTypes,selectedPacks]);
	
	// limit number of cards displayed 
	const visibleCards = filteredCards.slice(0, visibleCount);

	// infinite scroll observer
	useEffect(() => {
		if (!observerRef.current) return ; // no observer
		if (visibleCount >= filteredCards.length) return ; // everything already shown

		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) {
					setVisibleCount( v => v + PAGE_SIZE);
				}
			},
			{ rootMargin: "200px"} // distance from bottom to preload
		);

		observer.observe(observerRef.current);

		return () => observer.disconnect();
	}, [visibleCount, filteredCards.length]);

	// draw it all
	if (loading) return <p>Loading</p>;
	if (error) {
		console.log(error);
		return <p>error</p>;
	} 
	return (
		<div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
				{visibleCards.map(card => (
					<Card card={card} key={card.code} allCards={allCards}/>
				))}
			</div>
			{/* Sentinel for infinite scroll*/}
			<div ref={observerRef} style={{ height: 1}} />
		</div>
	)
}


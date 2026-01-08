import { useAspects } from "../context/AspectContext";
import { useCardTypes } from "../context/CardTypeContext";
import { useState, useEffect, useMemo, useRef } from "react";
import Card from "./Card";

const PAGE_SIZE = Number(import.meta.env.VITE_NUMBER_IMAGES_TO_LOAD);

export default function CardResults(){
	const [allCards, setAllCards] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

	const { selectedAspects } = useAspects();
	const { selectedCardTypes} = useCardTypes();
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
	const filteredCards = useMemo(() => {
		if (selectedAspects.length === 0) return [];
		return [...allCards]
		.filter(card => selectedCardTypes.includes(card.type_name)) 
			.filter(card => selectedAspects.includes(card.faction_code))
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
				/*
				if (a.faction_code !== b.faction_code) {
					return a.faction_code.localeCompare(b.faction_code);
				}*/

			});
	}, [allCards,selectedAspects,selectedCardTypes]);
	
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
			<h3>Filtered Cards</h3>
			<div className="card-grid">
				{visibleCards.map(card => (
					<Card card={card} key={card.code}/>
				))}
			</div>
			{/* Sentinel for infinite scroll*/}
			<div ref={observerRef} style={{ height: 1}} />
		</div>
	)
}


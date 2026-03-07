import { useCards } from "../context/CardsContext";
import { useState, useEffect, useMemo, useRef } from "react";
import Card from "./Card";
const PAGE_SIZE = Number(import.meta.env.VITE_NUMBER_IMAGES_TO_LOAD);
export default function FilteredCards() {
	const { filteredCards, allCards, dispatch, actions, addCardToDeck, cardCounts, deck, collectionCounts } = useCards();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
	const observerRef = useRef(null); // mutable dom object in memory - updates do NOT trigger rerender


	// limit number of cards displayed 
	const visibleCards = filteredCards.slice(0, visibleCount);

	// infinite scroll observer
	useEffect(() => {
		setVisibleCount(PAGE_SIZE);
	}, [filteredCards]);

	useEffect(() => {
		if (!observerRef.current) return; // no observer
		if (visibleCount >= filteredCards.length) return; // everything already shown

		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) {
					setVisibleCount(v => v + PAGE_SIZE);
				}
			},
			{ rootMargin: "200px" } // distance from bottom to preload
		);

		observer.observe(observerRef.current);

		return () => observer.disconnect();
	}, [visibleCount, filteredCards.length]);

	// draw it all


	function disableAdd(card) {
		const inDeck = cardCounts[card.code] ?? 0;
		const deckLimit = card.deck_limit ?? 3;
		const inCollection = collectionCounts[card.name] ?? 0;
		if (inDeck >= deckLimit ||
			card.card_set_type_name_code === 'hero' ||
			deck.cards.length >= 50 ||
			(inDeck > 0 && inDeck >= inCollection)
		) return true;
		return false;

	}

	function disableRemove(card) {
		const inDeck = cardCounts[card.code] ?? 0;

		if (
			inDeck < 1
		) return true;
		return false;

	}

	return (
		<div className="grid grid-cols-4 gap-5">

			{
				visibleCards &&
				visibleCards.map((card) => (


					<div key={card.code}>
						<Card card={card} className="" allCards={allCards} />
						<div className="grid grid-cols-3 items-center bg-gray-500">
							<button className="rounded-none!" disabled={disableRemove(card)} onClick={() => dispatch({ type: actions.REMOVE_CARD_FROM_DECK_BY_CODE, payload: card })}>remove</button>
							<span className="bold">{cardCounts[card.code]}</span>
							{
								<button className="rounded-none!" disabled={disableAdd(card)} onClick={() => addCardToDeck(card)}>add</button>
							}
						</div>
					</div>
				))
			}
			{/* Sentinel for infinite scroll*/}
			<div ref={observerRef} style={{ height: 1 }} />
		</div>
	)
}
import { useCards } from "../context/CardsContext";
import { useState, useEffect, useMemo, useRef } from "react";
import Card from "./Card";
const PAGE_SIZE = Number(import.meta.env.VITE_NUMBER_IMAGES_TO_LOAD);
export default function FilteredCards() {
	const { filteredCards, allCards, dispatch, actions, addCardToDeck, cardCounts, deck, collectionCounts, ownedPacks } = useCards();
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
	const observerRef = useRef(null); // mutable dom object in memory - updates do NOT trigger rerender


	// deduplicate: collect all unique root codes from filteredCards (originals and reprints),
	// then pick the owned version of each, falling back to the original print
	const dedupedCards = useMemo(() => {
		const rootCodes = [...new Set(
			filteredCards.map(card => card.duplicate_of_code ?? card.code)
		)];

		return rootCodes.map(rootCode => {
			const versions = allCards.filter(c =>
				c.code === rootCode || c.duplicate_of_code === rootCode
			);
			if (ownedPacks.length === 0) {
				return versions.find(c => c.code === rootCode) ?? versions[0];
			}
			const ownedVersion = versions.find(c => ownedPacks.includes(c.pack_code));
			return ownedVersion ?? versions.find(c => c.code === rootCode) ?? versions[0];
		}).filter(Boolean);
	}, [filteredCards, allCards, ownedPacks]);

	// limit number of cards displayed
	const visibleCards = dedupedCards.slice(0, visibleCount);

	// infinite scroll observer
	useEffect(() => {
		setVisibleCount(PAGE_SIZE);
	}, [filteredCards]);

	useEffect(() => {
		if (!observerRef.current) return; // no observer
		if (visibleCount >= dedupedCards.length) return; // everything already shown

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
	}, [visibleCount, dedupedCards.length]);

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
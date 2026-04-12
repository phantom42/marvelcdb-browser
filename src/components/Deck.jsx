import { useCards } from "../context/CardsContext";
import Card from "./Card";
export default function Deck({clickHandler, findAltHandler}) {
	const {dispatch, actions} = useCards();
	const {deck, allCards, ownedPacks} = useCards();
	function handleFindAlt(card)  {
		findAltHandler(card);
	}

	
	return (<div className="grid grid-cols-4 gap-5">
		
		{deck.cards.length > 0 && deck.cards.map((card, index)=> {
			const unowned = ownedPacks.length > 0 && !ownedPacks.includes(card.pack_code);
			return (<div key={`${card.deck_card_id}-${index}`}>
			<div className="relative">
				<div className={unowned ? 'opacity-40' : ''}>
					<Card card={card} key={`${card.deck_card_id}`} allCards={allCards} clickHandler={clickHandler}/>
				</div>
				{unowned && (
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="text-yellow-400 text-4xl pointer-events-none">⚠️</span>						
					</div>
				)}
			</div>
				{unowned && 
				<button className="" onClick={() => handleFindAlt(card)}>Find Alternative</button>
				}
				{card.card_set_type_name_code !== 'hero' && !unowned &&
					<button onClick={()=>{dispatch({type:actions.REMOVE_CARD_FROM_DECK_BY_ID, payload:card})}} key={card.deck_card_id}>Remove Card</button>
				}
			</div>)
		})}
	</div>)
}
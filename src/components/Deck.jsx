import { useCards } from "../context/CardsContext";
import Card from "./Card";
export default function Deck({clickHandler}) {
	const {dispatch, actions} = useCards();
	const {deck, allCards} = useCards();
	
	return (<div className="grid grid-cols-4 gap-5">
		
		{deck.cards.length > 0 && deck.cards.map((card, index)=> (
			<div key={`${card.deck_card_id}-${index}`}>
			<Card card={card} key={`${card.deck_card_id}`} allCards={allCards} clickHandler={clickHandler}/>
				{card.card_set_type_name_code !== 'hero' &&
					<button onClick={()=>{dispatch({type:actions.REMOVE_CARD_FROM_DECK_BY_ID, payload:card})}} key={card.deck_card_id}>Remove Card</button>
				}
			</div>
			
		))}
	</div>)
}
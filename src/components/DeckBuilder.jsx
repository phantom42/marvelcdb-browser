import Filters from "./Filters";
import FilteredCards from "./FilteredCards";
import Deck from "./Deck";
import { useState } from "react";
import { useCards } from "../context/CardsContext";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import View from "./View";
import Header from "./Header";
import Filter from "./Filter";
import DeckStatsPanel from "./DeckStatsPanel";

export default function DeckBuilder(){
	const [openFilter,setOpenFilter] = useState('');
	const [openView, setOpenView] = useState('browse');
	const [selectedCard, setSelectedCard] = useState();
	const {loadOwnedPacks, setOwnedPacks, filters, deck, dispatch, actions, allHeroes, allCards, deckHero,deckStats, useUniversalPrebuiltDeck} = useCards();
	function switchOpenFilter (which){
		if (which !== openFilter) {
			setOpenFilter(which);
		}
	}
	function switchView(which) {
		if (openView === which) {
			setOpenView('browse');
		} else {
			setOpenView(which);
		}
	}
	function selectCard(which) {
		setSelectedCard(which);
	}

	
	const isOpen = (selectedCard && selectedCard.code);
	const deckView = (openView === 'deck' ? '': 'hidden');
	const builderView = (openView === 'browse' ? '': 'hidden');
    return(
        <div className="w-screen h-screen">
			<Header>
				<button onClick={()=>switchView('hero')}>Hero</button>
				<button onClick={()=>switchView('filters')}>Filters</button>
				<button onClick={()=>switchView('browse')}>Build</button>
				<button onClick={()=>switchView('deck')}>Deck</button>
				
			</Header>
			<div className="main-body">
				<DeckStatsPanel hero={deckHero} stats={deckStats}/>

		
			<ToastContainer autoClose={2000} newestOnTop={true} theme='dark'/>
			<View isOpen={openView==='hero'}>
				<Filter 
					label="Hero"
					code="card_set_code"
					val="card_set_name"
					data={allHeroes}
					selected={deck.hero}
					onChange = {(value) => {
						dispatch({
							type: actions.SET_HERO,
							payload: {
								hero: value,
								allCards: allCards
							}
						})
					}}
					isOpen={true}/>
			</View>
			<View isOpen={openView==='filters'}>
			
			
          	  <Filters openFilter={openFilter} handleOpenFilter={switchOpenFilter}/>
			</View>
			
			<View isOpen={openView==='deck'}>
			
				{ deck.cards && deck.cards.length > 0 && 
					<button onClick={()=>dispatch({type: actions.RESET_DECK, payload:[]}) }>Reset Deck</button>
				}
				{deck.hero && deck.hero.length > 0 && 
					<button onClick={()=>useUniversalPrebuiltDeck(deck.hero)}>Use Universal Prebuilt</button>
				}
				<Deck selectedCard={selectedCard} clickHandler={selectCard}/>

			</View>



		<View isOpen={openView==='browse'}>
		{deck.hero && deck.hero.length > 0 && 
				<button onClick={()=>useUniversalPrebuiltDeck(deck.hero)}>Use Universal Prebuilt</button>
			}
			 <FilteredCards />
			</View>



        </div>
        </div>
    )

}
import { useCards } from "../context/CardsContext"
export default function DeckBuilder(){
    const {allCards, allTypes, allAspects, allPacks} = useCards();
    return(
        <div>
            <h1>deck builder</h1>
            cards: {allCards &&  `${allCards.length}`
            }
        </div>
    )

}
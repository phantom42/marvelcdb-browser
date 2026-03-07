import { CardsProvider } from "../../context/CardsContext"
import { CardTypeProvider } from "../../context/CardTypeContext"
import DeckBuilder from "../../components/DeckBuilder";
export default function Home() {
	return (<div>
		
		<CardsProvider>
			<DeckBuilder />
		</CardsProvider>
		</div>)
}
import { CardsProvider } from "../../context/CardsContext"
import DeckBuilder from "../../components/DeckBuilder";
export default function Home() {
	return (<div>
		
		<CardsProvider>
			<DeckBuilder />
		</CardsProvider>
		</div>)
}
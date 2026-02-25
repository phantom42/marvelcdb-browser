import { CardsProvider } from "../../context/CardsContext"
import { CardTypeProvider } from "../../context/CardTypeContext"
import DeckBuilder from "../../components/DeckBuilder";
export default function Home() {
	return (<div>
		<h1>home</h1>
		<CardsProvider>
			<DeckBuilder />
		</CardsProvider>
		</div>)
}
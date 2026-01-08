import AspectSelection from "../../components/AspectSelection";
import CardResults from "../../components/CardResults";
import CardTypeSelection from "../../components/CardTypeSelection";
export default function Home() {
	return (
		<div><h2>MarvelCDB Card Browser</h2>
			<AspectSelection />
			<CardTypeSelection />
			<CardResults />
		</div>
	)
};
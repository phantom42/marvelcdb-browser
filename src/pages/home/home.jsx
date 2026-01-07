import AspectSelection from "../../components/AspectSelection";
import CardResults from "../../components/CardResults";
import { useAspects } from "../../context/AspectContext"
export default function Home() {
	return (
		<div><h2>MarvelCDB Card Browser</h2>
			<AspectSelection />
			<CardResults />
		</div>
	)
};
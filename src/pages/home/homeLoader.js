import { getFactions } from "../../api/queries/getFactions";

export async function HomeLoader() {
	const factionResponse = await getFactions();

	const factions = await factionResponse.json();

	return factions ;
}
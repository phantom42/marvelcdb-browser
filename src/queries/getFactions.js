//import type { Faction } from "../api/types/faction";


export async function getFactions() {
	const res = await fetch(`https://marvelcdb.com/api/public/factions/?_format=json`);
	const data = await res;
	console.log(data);
	return true;
}
export async function getFactions(){
	const apiEndpoint = import.meta.VITE_API_ENDPOINT ;
	const url = apiEndpoint + 'factions/?format=_json';
	const res = await fetch(url, {method: 'GET'});
	const data = await res;

	return data ;
}
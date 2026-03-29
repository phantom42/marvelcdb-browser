export async function loadCards() {
	const cachedData = getCachedCards();
	if (cachedData) {
		// setAllCards(cachedData);
		return cachedData;
	}
	try {
		const apiEndpoint = import.meta.env.VITE_API_ENDPOINT ;
		const url = apiEndpoint + 'cards/';
		const res = await fetch(url);
		const data = await res.json();
		localStorage.setItem(
			import.meta.env.VITE_CACHE_KEY,
			JSON.stringify({data, timestamp: Date.now()
				
			})
		);
		// setAllCards(data);
		return data;
	} catch (err) {
		//setError(err.message);
		throw new Error (err.message);
	} finally {
		//setLoading(false);
	}
}
function getCachedCards() {
	const cached = localStorage.getItem(import.meta.env.VITE_CACHE_KEY);
	if (!cached) return null;
	const parsed = JSON.parse(cached);
	const isExpired = Date.now() - parsed.timestamp > import.meta.env.VITE_CACHE_LIFETIME;

	return isExpired ? null : parsed.data;
}
export async function fetchDeck(id) {
	try {

		const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
		const url = apiEndpoint + `deck/${id}.json`;
		const res = await fetch(url);
		const data = await res.json();
		return data;
	} catch (err) {
		throw new Error (err.message);
	} finally {
		//
	}
}
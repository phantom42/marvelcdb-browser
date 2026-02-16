import { usePacks } from "../context/PackContext";
import { useEffect, useState } from "react";

export default function PackSelection() {
	const [packs, setPacks] = useState([]);
	const [loading, setLoading] = useState(true) ;
	const [error, setError] = useState(null) ;

	const {
		selectedPacks,
		togglePack,
		selectAll,
		clearAll
	} = usePacks();

	useEffect(() => {
		async function loadPacks() {
			try {
				const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
				const url = apiEndpoint + 'packs/?_format=json';
				const res = await fetch(url);
				const data = await res.json();
				setPacks(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		loadPacks();
	},[])

	if (loading) return <p>Loading</p>
	if (error) {
		console.log(error);
		return <p>error</p>;
	}

	const allPackCodes = packs.map(p => p.code);
	return (
		<section className="filter-section bg-gray-700">
			<button onClick={(() => selectAll(allPackCodes))}>
				Select All
			</button>
			<button onClick={clearAll}>
				Clear All
			</button>
			<ul>
				{packs.map(pack => (
					<li key={pack.code}>
						<label>
							<input type="checkbox"
								checked={selectedPacks.includes(pack.code)}
								onChange={() => togglePack(pack.code)}
								/>
							{pack.name}
						</label>
					</li>
				))}
			</ul>
		</section>
	)
}
import { useAspects } from "../context/AspectContext";
import { useEffect, useState } from "react";
export default function AspectSelection() {
	
	const [aspects, setAspects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const {
		selectedAspects,
		toggleAspect,
		selectAll,
		clearAll
	} = useAspects();

	
	useEffect(() => {
		async function loadAspects() {
			try {
				const apiEndpoint = import.meta.env.VITE_API_ENDPOINT ;
				const url = apiEndpoint + 'factions/?format=_json';
				const res = await fetch(url);
				const data = await res.json();
				setAspects(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		loadAspects();
	},[])


	if (loading) return <p>Loading</p>;
	if (error) {
		console.log(error);
		return <p>error</p>;
	} 

	const allAspectCodes = aspects.map(f => f.code);
	return (
		<section className="filter-section bg-gray-700">
			<button onClick={(() => selectAll(allAspectCodes))}>
				Select All
			</button>
			<button onClick={clearAll}>
				Clear All
			</button>
			<ul>
				{aspects.map(aspect => (
					<li key={aspect.code}>
						<label>
							<input 
							type="checkbox"
							checked={selectedAspects.includes(aspect.code)}
							onChange={() => toggleAspect(aspect.code)}
							/>
							{aspect.name}
						</label>
					</li>
				))}
			</ul>
		</section>
	)
}

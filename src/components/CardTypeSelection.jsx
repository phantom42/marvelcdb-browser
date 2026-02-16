import { useCardTypes } from "../context/CardTypeContext";
import { useEffect, useState } from "react";


const allowableTypes = {
	'ally': 'Ally',
	'alter_ego': 'Alter Ego',
	'attachment': 'Attachment',
	'environment': 'Environment',
	'event': 'Event',
	'hero': 'Hero',
	'main_scheme': 'Main Scheme',
	'minion': 'Minion',
	'obligation': 'Obligation',
	'player_side_scheme':'Player Side Scheme',
	'resource': 'Resource',
	'side_scheme':'Side Scheme',
	'support': 'Support',
	'treachery': 'Treachery',
	'upgrade': 'Upgrade',
	'villain': 'Villain'
}
export default function CardTypeSelection(){
	
	const [cardTypes, setCardTypes] = useState([]);
	
	const {
		selectedCardTypes,
		toggleCardType,
		selectAll,
		clearAll
	} = useCardTypes();

	return (
		<section className="filter-section bg-gray-700">
			<button onClick={(() => selectAll(Object.keys(allowableTypes)))}>Select All</button>
			<button onClick={clearAll}>Clear All</button>
			<ul>
				{Object.entries(allowableTypes).map(([code, name]) => (
					<li key={code}>
					<label>
						<input
						type="checkbox"
						checked={selectedCardTypes.includes(code)}
						onChange={() => toggleCardType(code)}
						/>
						{name}
					</label>
					</li>
				))}
			</ul>

		</section>
	)

}


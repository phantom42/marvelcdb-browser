import { useCardTypes } from "../context/CardTypeContext";
import { useEffect, useState } from "react";


const allowableTypes = ['Ally','Event','Resource','Support','Upgrade'];
export default function CardTypeSelection(){
	
	const [cardTypes, setCardTypes] = useState([]);
	
	const {
		selectedCardTypes,
		toggleCardType,
		selectAll,
		clearAll
	} = useCardTypes();
	
	return (
		<section>
			<h3>Select Card Types</h3>
			<button onClick={(() => selectAll(allowableTypes))}>Select All</button>
			<button onClick={clearAll}>Clear All</button>
			<ul>
				{allowableTypes.map(type => (
					<li key={type}>
						<label>
							<input
								type="checkbox"
								checked={selectedCardTypes.includes(type)}
								onChange={() => toggleCardType(type)}
								/>
								{type}
						</label>
					</li>
				))}
			</ul>
		</section>
	)

}
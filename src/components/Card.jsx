import MissingCard from "./MissingCard";
const BorderColors = {
	hero: 'bg-orange-700',
	aggression: 'bg-red-700',
	justice: 'bg-yellow-700',
	protection: 'bg-green-700',
	encounter: 'bg-slate-700',
	leadership:'bg-blue-700',
	campaign: 'bg-teal-700',
	"'pool": 'bg-fuchsia-700',
	basic: 'bg-gray-700'

} 
export default function Card({card, allCards, clickHandler}){
	let aspectRatio = '[3/4]';
	if (card.type_code.includes('scheme')){
		aspectRatio = '[4/3]';
	}
	let altText = card.name;
		if (card.cost !== null && card.cost >= 0) {
			altText = `${card.name}
	${card.faction_name} - ${card.type_name}
	${altText} - ${card.cost}
	${card.pack_name}`;
		}
	let displayImage;
	if (card.imagesrc !== undefined && card.imagesrc.length) {
		displayImage = card.imagesrc;
	} else if ((card.imagesrc === undefined || card.imagesrc.length === 0) && (card.duplicate_of_code)) {		
		displayImage = `/bundles/cards/${card.duplicate_of_code}.png`;
	} else {
		displayImage = findAlt(card.name, allCards);
	}
	
	const onClicked = (card) => {
		if (clickHandler !== undefined) {

			clickHandler(card) ;
		}
	}

	const borderColor = BorderColors[card.faction_code] || 'bg-white';

	if (displayImage) {
		
		return (
			<div onClick={() => onClicked(card)}>
				
				<div className={`${borderColor} rounded shadow p-4 flex flex-col h-full`}>
					<div className={`aspect-${aspectRatio}`}>
					<img src={`https://marvelcdb.com${displayImage}`} loading="lazy" title={altText} alt={altText} data-code={card.code} data-aspect={card.faction_code}/>
					</div>
				</div>
				
			</div>
		) 
	} else {
		return (<MissingCard card={card} />)
	}
}
 function findAlt (name, allCards)  {
	const altCards = allCards.filter(card => card.imagesrc !== undefined && card.imagesrc.length !== 0 && card.name == name)
	if (altCards.length > 0){
		return altCards[0].imagesrc;
	} else {
		return false;
	}
}
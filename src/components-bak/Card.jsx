import MissingCard from "./MissingCard";
export default function Card({card, allCards}){
	let altText = card.name;
	if (card.cost !== null && card.cost >= 0) {
		altText = `${card.name}
${card.faction_name} - ${card.type_name}
${altText} - ${card.cost}
${card.pack_name}`;
	}
	let displayImage;
	if (card.imagesrc === undefined || card.imagesrc.length === 0) {
		console.log('missing ', card.code);
		const altImage = findAlt(card.name, allCards);
		console.log('alt', altImage);
		if (altImage !== false) {
			displayImage = altImage ;
		} else {
			return(
				<MissingCard card={card}/>
			)
		}
	} else {
		displayImage = card.imagesrc;
	}
	let aspectRatio = '[3/4]';
	if (card.type_code.includes('scheme')){
		aspectRatio = '[4/3];'
	}
	return (
		<div id={card.code} className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
			<div className={`aspect-${aspectRatio} bg-gray-200 rounded mb-3 overflow-hidden`}>
			<img className="w-full h-full object-cover" src={`https://marvelcdb.com${displayImage}`} loading="lazy" title={altText} alt={altText}/>
			</div>
		</div>
	)
}
 function findAlt (name, allCards)  {
	console.log('name:', name)
	const altCards = allCards.filter(card => card.imagesrc !== undefined && card.imagesrc.length !== 0 && card.name == name)
	console.log('alts',altCards);
	if (altCards.length > 0){
		return altCards[0].imagesrc;
	} else {
		return false;
	}
}
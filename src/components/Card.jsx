export default function Card({card}){
	let altText = card.name;
	if (card.cost !== null && card.cost >= 0) {
		altText = `${altText} - ${card.cost}`;
	}
	return (
		<div id={card.code}>
			<img src={`https://marvelcdb.com${card.imagesrc}`} loading="lazy" title={altText} alt={altText}/>
		</div>
	)
}
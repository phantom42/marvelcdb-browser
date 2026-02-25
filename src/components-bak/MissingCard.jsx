const BorderColors = {
	hero: 'orange-700',
	aggression: 'red-700',
	justice: 'yellow-700',
	protection: 'green-700',
	encounter: 'slate-700',
	leadership:'blue-700',
	campaign: 'teal-700',
	"'pool": 'fuchsia-700',
	basic: 'gray-700'

} 
export default function MissingCard({card}) {
	console.log(card);

	const costText = `<span> {card.cost !== undefined ? Cost - ${card.cost} : ''} </span>`;
	// const statsText = `{card.attack !== undefined? }`
	const borderColor = BorderColors[card.faction_code];

	return (

		<div id={card.code} className={`bg-${borderColor} rounded-lg shadow p-4 flex flex-col h-full missing-card`}>
			<div className={`aspect-[3/4] bg-gray-900 rounded mb-3 overflow-hidden `}>
			<h2 className="font-bold">{`${card.name} (${card.faction_name} ${card.type_name})`}</h2>
				<div>{ card.cost !== undefined && `Cost: ${card.cost}`} {card.attack && `Atk: ${card.attack}`}{card.attack_star && '★'}{card.thwart && ` Thw: ${card.thwart}`}{card.thwart_star && '★'}</div>
			{card.traits &&
				<div>{card.traits}</div>
			}
			{card.resource_physical && 
			<div>{`Physical: ${card.resource_physical}`}</div>}
			{card.resource_mental && 
			<div>{`Mental: ${card.resource_mental}`}</div>}
			{card.resource_energy && 
			<div>{`Energy: ${card.resource_energy}`}</div>}
			{card.resource_wild && 
			<div>{`Wild: ${card.resource_wild}`}</div>}
		<p dangerouslySetInnerHTML={{ __html:card.text}}></p>
		<a href={`${card.url}`} target="_blank">Open</a>
			</div>
		</div>
	)
}
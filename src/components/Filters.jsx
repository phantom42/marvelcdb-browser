import { useCards } from "../context/CardsContext"
import Filter from "./Filter";
export default function Filters({openFilter, handleOpenFilter}) {
	const {actions, allCards, allHeroes, allTypes, allAspects, allPacks, dispatch, filters, setOwnedPacks, loadOwnedPacks} = useCards();
	return (
		<div>
			<button onClick={()=>handleOpenFilter('Content Set')}>Content Set</button>
			<button onClick={()=>handleOpenFilter('Aspects')}>Aspects</button>
			<button onClick={()=>handleOpenFilter('Card Type')}>Card Types</button>
			<Filter 
				label="Content Set" 
				code='pack_code' 
				val='pack_name' 
				data={allPacks} 
				selected={filters.packs}
				onChange= {(value) => {
					dispatch({
						type: actions.TOGGLE_FILTER,
						payload: {category: 'packs', value}
					})
				}} 
				isOpen ={ openFilter==='Content Set'}
				>
					{ filters.packs && filters.packs.length > 0 &&
									<button onClick={()=>setOwnedPacks()}>Save Owned Packs</button>
								}
								<button onClick={()=>loadOwnedPacks()}>Use Owned Packs</button>
				</Filter>
			
			<Filter 
				label="Aspects"
				code="faction_code"
				val="faction_name"
				data={allAspects}
				selected={filters.aspects}
				onChange = {(value) => {
					dispatch({
						type: actions.TOGGLE_FILTER,
						payload: {category: 'aspects', value}
					})
				}}
				isOpen ={ openFilter==='Aspects'}/>
			<Filter 
				label="Card Type"
				code="type_code"
				val="type_name"
				data={allTypes}
				selected={filters.types}
				onChange = {(value) => {
					dispatch({
						type: actions.TOGGLE_FILTER,
						payload: {category: 'types', value}
					})
				}}
				isOpen ={ openFilter==='Card Type'}/>
		</div>
	)
}
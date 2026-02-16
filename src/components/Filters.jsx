import AspectSelection from "./AspectSelection";
import CardTypeSelection from "./CardTypeSelection";
import PackSelection from "./PackSelection";
import FilterSection from "./FilterSection";
import { useState } from "react";


function setActiveFilter(which){
	if (activeTab === which) {
		setActiveTab = '';
	} else {
		setActiveTab = which;
	}
}
export default function Filters(){
	const [activeTab, setActiveTab] = useState('');
	return (
		<>
				<FilterSection title="Packs" openHandler={setActiveFilter}>
					<PackSelection />
				</FilterSection>
				<FilterSection title="Aspects" openHandler={setActiveFilter}>
					<AspectSelection />
				</FilterSection>
				<FilterSection title="Types" openHandler={setActiveFilter}>
					<CardTypeSelection />
				</FilterSection>
		</>
		
	)
}
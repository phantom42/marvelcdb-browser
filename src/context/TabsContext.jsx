import { createContext, useContext, useState, useEffect } from "react";	

const TabContext = createContext(null);

export function TabProvider({children}){
	const [selectedTab, setSelectedTab] = useState('');
	function setActiveTab(which) {
		if (selectedTab === which) {
			setSelectedTab('');
		} else {
			setSelectedTab(which);
		}
	}

	function getActiveTab(){
		return selectedTab;
	}

	return (
		<TabContext.Provider
			value={{setActiveTab, getActiveTab}}>
			{children}
			</TabContext.Provider>
	)
}

export function useTabs() {
	const context = useContext(TabContext);
	if (!context){
		throw new Error('tabs must be used within tab provider');
	}
	return context;
}


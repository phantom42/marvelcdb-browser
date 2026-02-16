import { useTabs } from "../context/TabsContext";

export default function FilterSection({title, children, defaultOpen = false}) {

	const {setActiveTab, getActiveTab} = useTabs();

	const onClickHandler = () => {
		setActiveTab(title);
	}

	const isOpen = (getActiveTab() === title);

	return (
		<div className="border-b last:border-b-0">
			<button
				// onClick={() => setOpen(!open)}
				onClick={() => onClickHandler()}
				className="w-full flex justify-between items-center py-3 text-left"
				>
				<span className="font-medium">{title}</span>
				<span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
			</button>

			<div className={`overflow-hidden transition-all duration-300 ${isOpen ? " opacity-100 pb-4" : "max-h-0 opacity-0"}`}>
				{children}
			</div>
				
		</div>
	);
}
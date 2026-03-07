import Card from "./Card"
export default function Modal({selectedCard, isOpen, clickHandler}){
	return(
		<div id="modal" onClick={() => clickHandler()}>
			{selectedCard &&  
				<div className="fixed inset-0 flex items-center justify-center z-50">
				<div className="bg-white p-8 rounded-lg shadow-lg max-w-sm mx-auto text-black">
				
					<Card card={selectedCard} />
				</div>
				</div>
				}
		</div>
	)
}
import React from "react";
export default function ModalWrapper({isOpen,children}) {
	const blockClick = () => {
		console.log('inner click');
	}
	const modalChildren = React.Children.map(children, child => {
		if (React.isValidElement(child)) {
			return React.cloneElement(child, {clickHandler: blockClick})
		}
		return child;
	})
	console.log(modalChildren);
	return (
		<div>
			{/* { isOpen &&
				<div id="modalWrapper" className="bg-gray-500/50 inset-0 flex  w-full h-full z-49 fixed" onClick={() => console.log('clicked')}>
					{modalChildren}
				</div>
			} */}
		</div>
	)
}
export default function View({children, isOpen}){
	return (
		<div>{isOpen &&
			<div>{children}</div>		
		}
		</div>
	)
}
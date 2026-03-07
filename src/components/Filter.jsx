import { FaRegCircle, FaRegCircleCheck  } from "react-icons/fa6";
export default function Filter({label,code, val, data, onChange, selected, isOpen, children}) {
	function drawCheckmark(code) {
		if (typeof selected === 'string'){
			return (
				(selected  === code)
				? <FaRegCircleCheck  />
				: <FaRegCircle /> 
			)
		} else {

			return (
				selected.includes(code)
				? <FaRegCircleCheck  />
				: <FaRegCircle /> 
			)
		}
	}
	function drawButton(code) {
		if (typeof selected === 'string'){
			return (
				(selected === code)
				? `bg-blue-500!`
				: `bg-gray-900!`
			)
		} else {
			return (
				selected.includes(code)
				? `bg-blue-500!`
				: `bg-gray-900!`
			)
		}
	}


	return (
		<div>
			{isOpen && <div className="p-5">{children}</div>}
			<div className="grid grid-cols-4 gap-5 ">
			{isOpen && 
				 data.map(item => (		
					<button key={item[code]} className={drawButton(item[code])}  onClick={() => onChange(item[code])} data-code={item[code]}><span className="flex items-center gap-1 whitespace-nowrap">{item[val]}{drawCheckmark(item[code])}</span></button>
				))
			}
			</div>
		</div>
	)

}


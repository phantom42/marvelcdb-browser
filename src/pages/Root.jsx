import { Outlet } from "react-router-dom";
 import { AspectProvider } from "../context/AspectContext"
 import { CardTypeProvider } from "../context/CardTypeContext";
export default function Root() {
	return (
		<div>
			<AspectProvider>
			<CardTypeProvider>

			<Outlet />
			</CardTypeProvider>
			</AspectProvider>
		</div>
	)
}
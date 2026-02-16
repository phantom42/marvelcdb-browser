import { Outlet } from "react-router-dom";
 import { AspectProvider } from "../context/AspectContext"
 import { CardTypeProvider } from "../context/CardTypeContext";
 import { PackProvider } from "../context/PackContext";
export default function Root() {
	return (
		<div>
			<PackProvider>
			<AspectProvider>
			<CardTypeProvider>
			<Outlet />
			</CardTypeProvider>
			</AspectProvider>
			</PackProvider>
		</div>
	)
}
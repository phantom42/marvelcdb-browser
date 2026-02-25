import { Outlet } from "react-router-dom";
 import { AspectProvider } from "../context/AspectContext"
 import { CardTypeProvider } from "../context/CardTypeContext";
 import { PackProvider } from "../context/PackContext";
export default function Root() {
	return (
		<div><h1>root</h1>
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
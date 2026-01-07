import { Outlet } from "react-router-dom";
 import { AspectProvider } from "../context/AspectContext";
export default function Root() {
	return (
		<div>
			<AspectProvider>

			<Outlet />
			</AspectProvider>
		</div>
	)
}
import CardGrid from "../../components/CardGrid";
import Filters from "../../components/Filters";
import { TabProvider } from "../../context/TabsContext";
export default function Home() {
	return (

		<div className="min-h-screen bg-slate-900">
			<div className="max-w-7xl mx-auto px-4 py-6">
				<div className="flex flex-col lg:flex-row gap-6">
					<aside className="lg:w-64 lg:sticky lg:top-6 self-start bg-black rounded">
						<TabProvider>
						<Filters />
						</TabProvider>
					</aside>
					<main className="flex-1">
						<CardGrid />
					</main>
				</div>
			</div>
		</div>
	)
};
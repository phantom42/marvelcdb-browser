import { useMemo } from 'react';

type DeckStats = {
	byAspect: Record<string, number>;
	byCost: Record<number, number>;
	byType: Record<string, number>;
};

type DeckStatsProps = {
	stats: DeckStats;
	hero: string;
};

function toLabel(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

type StatListProps = {
	title: string;
	entries: [string, number][];
	sortFn?: (a: [string, number], b: [string, number]) => number;
};

function StatList({ title, entries, sortFn }: StatListProps) {
	const sorted = sortFn ? [...entries].sort(sortFn) : entries;
	const total = sorted.reduce((acc, [, count]) => acc + count, 0);

	return (
		<div>
			<p className='text-xs uppercase tracking-widest text-gray-500 mb-1'>
				{title}
			</p>
			<ul className='space-y-0.5'>
				{sorted.map(([key, count]) => (
					<li key={key} className='flex justify-between text-sm'>
						<span className='text-gray-300'>{toLabel(key)}</span>
						<span className='text-gray-400 tabular-nums'>
							{count}
							<span className='text-gray-600 ml-1 text-xs'>
								({Math.round((count / total) * 100)}%)
							</span>
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}

export default function DeckStatsPanel({ stats, hero }: DeckStatsProps) {
	const totalCards = useMemo(
		() => Object.values(stats.byAspect).reduce((a, b) => a + b, 0),
		[stats.byAspect],
	);

	const sortedCosts = useMemo(
		() =>
			Object.entries(stats.byCost).sort(
				([a], [b]) => Number(a) - Number(b),
			),
		[stats.byCost],
	);

	return (
		<div className='fixed top-4 right-4 z-50 w-52 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl space-y-4'>
			<div className='flex justify-between items-baseline'>
				<h2 className='text-sm font-semibold text-white'>
					{hero} Deck Stats
				</h2>
				<span className='text-xs text-gray-500 tabular-nums'>
					{totalCards} cards
				</span>
			</div>

			<StatList title='Aspect' entries={Object.entries(stats.byAspect)} />

			<StatList title='Type' entries={Object.entries(stats.byType)} />

			<StatList
				title='Cost'
				entries={sortedCosts}
				sortFn={([a], [b]) => Number(a) - Number(b)}
			/>
		</div>
	);
}

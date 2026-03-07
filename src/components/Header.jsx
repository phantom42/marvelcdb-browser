
export default function Header({children}) {
	return (
		<header className="sticky z-50 bg-gray-900 top-0 left-0 p-4 w-screen">
			{children}
		</header>
	)
}
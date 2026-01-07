import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/Root";
import Home from "./pages/home/home";

const router = createBrowserRouter([
{
	path: '/',
	element: <Root />, 
	children: [
		{
			index: true,
			element: <Home />
		}
	]
}
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
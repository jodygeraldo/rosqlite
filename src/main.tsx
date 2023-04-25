import "./styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter(
	[
		{
			id: "index",
			index: true,
			lazy: () => import("./routes/_index"),
		},
		{
			id: "app",
			path: "app",
			lazy: () => import("./routes/app"),
			children: [
				{
					id: "app.$table.$tab",
					path: ":table/:tab",
					lazy: () => import("./routes/app.$table.$tab"),
				},
			],
		},
	],
	{ future: { v7_normalizeFormMethod: true } },
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);

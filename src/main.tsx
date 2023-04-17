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
					id: "app.editor",
					path: "editor",
					lazy: () => import("./routes/app.editor"),
					children: [
						{
							id: "app.editor._index",
							index: true,
							lazy: () => import("./routes/app.+shared._index"),
						},
						{
							id: "app.editor.$table",
							path: ":table",
							lazy: () => import("./routes/app.editor.$table"),
						},
					],
				},
				{
					id: "app.database",
					path: "database",
					lazy: () => import("./routes/app.database"),
					children: [
						{
							id: "app.database._index",
							index: true,
							lazy: () => import("./routes/app.+shared._index"),
						},
						{
							id: "app.database.$table",
							path: ":table",
							lazy: () => import("./routes/app.database.$table"),
						},
					],
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

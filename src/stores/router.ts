import { createRouter } from "@nanostores/router";

export const $router = createRouter({
	home: "/",
	editor: "/editor",
	sql: "/sql",
	database: "/database",
} as const);

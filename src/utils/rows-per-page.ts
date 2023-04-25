import { localStore } from "../utils";

const store = localStore();
const ROWS_PER_PAGE = "rows-per-page";

async function getRowsPerPage() {
	const recentFiles = (await store.get<number>(ROWS_PER_PAGE)) ?? 10;
	return recentFiles;
}

async function setRowsPerPage(limit: number) {
	await store.set(ROWS_PER_PAGE, limit);
}

export { getRowsPerPage, setRowsPerPage };

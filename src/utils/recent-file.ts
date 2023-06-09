import { getFirstTable } from "../services/db";
import { localStore } from "../utils";
import { message, open } from "@tauri-apps/api/dialog";

const store = localStore();
const RECENT_FILES = "recent-files";

async function getRecentFiles() {
	const recentFiles = (await store.get<string[]>(RECENT_FILES)) ?? [];
	return recentFiles;
}

async function setRecentFile(filepath: string, maxFiles = 10) {
	const recentFiles = await getRecentFiles();
	recentFiles.unshift(filepath);
	const newSet = new Set(recentFiles);
	if (newSet.size > maxFiles) {
		newSet.delete(Array.from(newSet)[maxFiles]);
	}
	await store.set(RECENT_FILES, Array.from(newSet));
	return filepath;
}

async function openFileDialog() {
	const filepath = await open({
		filters: [
			{
				name: "SQLite Database Files",
				extensions: ["db", "sqlite", "sqlite3", "db3"],
			},
			{
				name: "All Files",
				extensions: ["*"],
			},
		],
	});

	if (typeof filepath === "string") {
		const firstTable = await getFirstTable(filepath);

		if (firstTable) {
			await setRecentFile(filepath);
			return firstTable;
		} else {
			await message("You need to atleast one table in database file", {
				title: "No table found",
				type: "error",
			});
		}
	}
}

export { getRecentFiles, setRecentFile, openFileDialog };

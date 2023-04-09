import { DialogFilter, open, save } from "@tauri-apps/api/dialog";
import { action, atom, onMount } from "nanostores";
import { Store } from "tauri-plugin-store-api";

const localStore = new Store(".local-kv");

export const $files = atom<string[]>(
	(await localStore.get<string[]>("files")) ?? [],
);

export const $currentFile = atom<string | undefined>(
	(await localStore.get<string>("currentFile")) ?? undefined,
);

export const setFiles = action(
	$files,
	"setFiles",
	async (store, filePath: string) => {
		const files = store.get();
		files.unshift(filePath);
		const fileSet = new Set(files);
		const filesArr = Array.from(fileSet);
		await localStore.set("files", filesArr);
		store.set(filesArr);
	},
);

export const setCurrentFile = action(
	$currentFile,
	"setCurrentFile",
	async (store, filePath: string) => {
		await setFiles(filePath);
		await localStore.set("currentFile", filePath);
		store.set(filePath);
	},
);

const dialogFilters: DialogFilter[] = [
	{
		name: "SQLite Database Files",
		extensions: ["db", "sqlite", "sqlite3", "db3"],
	},
	{
		name: "All Files",
		extensions: ["*"],
	},
];

export const newFile = action($currentFile, "newFile", async () => {
	const filePath = await save({ filters: dialogFilters });
	if (typeof filePath === "string") {
		await setCurrentFile(filePath);
	}
});

export const openFile = action($currentFile, "openFile", async () => {
	const filePath = await open({ filters: dialogFilters });
	if (typeof filePath === "string") {
		await setCurrentFile(filePath);
	}
});

import { DialogFilter, open, save } from "@tauri-apps/api/dialog";
import { action, atom, computed } from "nanostores";
import { Store } from "tauri-plugin-store-api";

const localStore = new Store(".local-kv");

export const $files = atom<string[]>(
	(await localStore.get<string[]>("files")) ?? [],
);

export const $currentFile = computed($files, (files) =>
	files.length > 0 ? files[0] : undefined,
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

export const newFile = action($files, "newFile", async () => {
	const filePath = await save({ filters: dialogFilters });
	if (typeof filePath === "string") {
		await setFiles(filePath);
	}
});

export const openFile = action($files, "openFile", async () => {
	const filePath = await open({ filters: dialogFilters });
	if (typeof filePath === "string") {
		await setFiles(filePath);
	}
});

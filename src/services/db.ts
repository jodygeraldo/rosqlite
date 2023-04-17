import { getRecentFiles } from "../utils/recent-file";
import SQLite from "tauri-plugin-sqlite-api";

async function getActiveFile() {
	const activeFile = (await getRecentFiles())[0];
	return activeFile;
}

async function conn() {
	const activeFile = await getActiveFile();
	return await SQLite.open(activeFile);
}

export type TableInfo = {
	cid: number;
	name: string;
	type: string;
	notnull: number;
	dflt_value: string | null;
	pk: number;
};

export async function getTables() {
	const db = await conn();
	return await db.select<{ name: string }[]>(
		"SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
	);
}

export async function getTableInfo() {
	const db = await conn();
	const tables = await getTables();

	return await Promise.all(
		tables.map(async ({ name }) => ({
			name,
			columns: await db.select<TableInfo[]>(`PRAGMA table_info(${name})`),
		})),
	);
}

export type PragmaIndexList = {
	name: string;
	origin: string;
	partial: number;
	seq: number;
	unique: number;
};

export type IndexInfo = {
	sql: string;
};
export async function getTableIndexes(name: string) {
	const db = await conn();
	const indexes = await db.select<PragmaIndexList[]>(
		`PRAGMA index_list('${name}')`,
	);

	return await Promise.all(
		indexes.map(async (index) => {
			return {
				...index,
				sql: (
					await db.select<IndexInfo[]>(
						`SELECT sql FROM sqlite_master WHERE type = 'index' AND name = '${index.name}'`,
					)
				)[0].sql,
			};
		}),
	);
}

export async function selectTable<TRow extends unknown>(
	tableName: string,
	offset: number = 0,
): Promise<{ count: number; rows: TRow[] }> {
	const db = await conn();
	const [count, rows] = await Promise.all([
		db.select<{ count: number }[]>(
			`SELECT COUNT(*) as count FROM ${tableName}`,
		),
		db.select<TRow[]>(`SELECT * FROM ${tableName} LIMIT 50 OFFSET ${offset}`),
	]);

	return { count: count[0].count, rows };
}

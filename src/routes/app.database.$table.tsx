import {
	TBody,
	TData,
	THead,
	THeadData,
	TRow,
	Table,
} from "../components/table";
import { getTableIndexes } from "../services/db";
import { cn } from "../utils";
import { LoaderData as AppLoaderData } from "./app";
import * as Tabs from "@radix-ui/react-tabs";
import * as React from "react";
import {
	LoaderFunctionArgs,
	useLoaderData,
	useRevalidator,
	useRouteLoaderData,
} from "react-router-dom";
import { z } from "zod";

export type LoaderData = Awaited<ReturnType<typeof loader>>;
export async function loader({ params }: LoaderFunctionArgs) {
	const tableName = z.string().parse(params.table);
	const tableIndexes = await getTableIndexes(tableName);

	return {
		tableName,
		tableIndexes,
	};
}

export function Component() {
	const { tableName, tableIndexes } = useLoaderData() as LoaderData;

	const { tables } = useRouteLoaderData("app") as AppLoaderData;
	const tableColumn = tables.find((table) => table.name === tableName)?.columns;
	if (!tableColumn) throw new Error("Table not found");
	const tableColumnKeys = Object.keys(tableColumn[0]);

	const isAnyIndex = tableIndexes.length > 0;
	const tableIndexKeys = isAnyIndex ? Object.keys(tableIndexes[0]) : [];

	const revalidator = useRevalidator();

	React.useEffect(() => {
		const interval = setInterval(() => {
			revalidator.revalidate();
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	return (
		<Tabs.Root defaultValue="column">
			<div className="flex items-center gap-8 border-b border-gray-6 bg-gray-1 px-3 py-4">
				<h1 className="font-semibold leading-6 text-gray-12">{tableName}</h1>

				<Tabs.List className="inline-flex items-center justify-center rounded-md bg-gray-3 p-1">
					<Tabs.Trigger
						value="column"
						className="data-[state=active]:text-slate-12 inline-flex min-w-[100px] items-center justify-center rounded-[0.185rem] px-3  py-1.5 text-sm font-medium text-gray-11  transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-5"
					>
						Column
					</Tabs.Trigger>
					<Tabs.Trigger
						value="index"
						disabled={isAnyIndex === false}
						className="data-[state=active]:text-slate-12 inline-flex min-w-[100px] items-center justify-center rounded-[0.185rem] px-3  py-1.5 text-sm font-medium text-gray-11  transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-5"
					>
						Index
					</Tabs.Trigger>
				</Tabs.List>
			</div>

			<Tabs.Content value="column">
				<Table>
					<THead>
						{tableColumnKeys.map((key) => (
							<THeadData key={key}>{key}</THeadData>
						))}
					</THead>
					<TBody>
						{tableColumn.map((d) => (
							<TRow key={d.name}>
								{Object.entries(d).map(([key, value]) => (
									<TData key={key}>
										{typeof value === "string" || typeof value === "number" ? (
											value
										) : (
											<span className="text-gray-9">null</span>
										)}
									</TData>
								))}
							</TRow>
						))}
					</TBody>
				</Table>
			</Tabs.Content>

			<Tabs.Content value="index">
				<Table>
					<THead>
						{tableIndexKeys.map((key) => (
							<THeadData key={key}>{key}</THeadData>
						))}
					</THead>
					<TBody>
						{tableIndexes.map((d) => (
							<TRow key={d.name}>
								{Object.entries(d).map(([key, value]) => (
									<TData key={key}>
										{typeof value === "string" || typeof value === "number" ? (
											value
										) : (
											<span className="text-gray-9">null</span>
										)}
									</TData>
								))}
							</TRow>
						))}
					</TBody>
				</Table>
			</Tabs.Content>
		</Tabs.Root>
	);
}

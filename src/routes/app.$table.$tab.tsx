import {
	TBody,
	TData,
	THead,
	THeadData,
	TRow,
	Table,
} from "../components/table";
import { usePaginationRange } from "../hooks/use-pagination-range";
import { getTableColumns, getTableIndexes, selectTable } from "../services/db";
import { cn } from "../utils";
import { getRowsPerPage, setRowsPerPage } from "../utils/rows-per-page";
import {
	CheckIcon,
	ChevronUpDownIcon,
	KeyIcon,
} from "@heroicons/react/20/solid";
import * as Select from "@radix-ui/react-select";
import * as Tabs from "@radix-ui/react-tabs";
import qs from "fast-querystring";
import * as React from "react";
import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	NavLink,
	redirect,
	useFetcher,
	useFormAction,
	useLoaderData,
	useNavigate,
	useParams,
	useRevalidator,
} from "react-router-dom";
import { z } from "zod";

export async function action({ request }: ActionFunctionArgs) {
	const query = qs.parse(await request.text());
	const Schema = z.object({
		limit: z.coerce.number(),
	});
	const { limit } = Schema.parse(query);
	await setRowsPerPage(limit);

	return null;
}

export type LoaderData = Awaited<ReturnType<typeof loader>>;
export async function loader({ request, params }: LoaderFunctionArgs) {
	const { table, tab } = z
		.object({ table: z.string(), tab: z.enum(["row", "column", "index"]) })
		.parse(params);

	const tableIndexes = await getTableIndexes(table);

	const disableIndexTab = tableIndexes.length === 0;
	if (tab === "index" && disableIndexTab) {
		throw redirect(`/app/${table}/row`);
	}

	switch (tab) {
		case "row": {
			const limit = await getRowsPerPage();
			const { page } = z
				.object({
					page: z.coerce.number().optional().default(1),
				})
				.parse(qs.parse(new URL(request.url).searchParams.toString()));

			const [{ count, rows }, tableColumns] = await Promise.all([
				selectTable<{
					[x: string]: string | number | boolean;
				}>(table, limit, (page - 1) * limit),
				getTableColumns(table),
			]);

			return {
				tab,
				tableColumns,
				limit,
				rows,
				page: {
					current: page,
					total: Math.ceil(count / limit),
				},
				displayedRows: {
					from: page * limit - (limit - 1),
					to: Math.ceil(count / limit) === page ? count : page * limit,
				},
				totalRows: count,
				disableIndexTab,
			} as const;
		}

		case "column": {
			const tableColumns = await getTableColumns(table);
			return {
				tab,
				table: {
					keys: Object.keys(tableColumns[0]),
					columns: tableColumns,
				},
				disableIndexTab,
			} as const;
		}

		case "index": {
			return {
				tab,
				table: {
					keys: Object.keys(tableIndexes[0]),
					indexes: tableIndexes,
				},
				disableIndexTab,
			} as const;
		}

		default:
			throw new Error("Should never happen! Issue on 'app.$table.$tab' switch");
	}
}

export function Component() {
	const { table: tableName } = useParams();
	const revalidator = useRevalidator();
	React.useEffect(() => {
		const interval = setInterval(() => {
			revalidator.revalidate();
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	const navigate = useNavigate();
	const loaderData = useLoaderData() as LoaderData;

	return (
		<Tabs.Root
			activationMode="manual"
			value={loaderData.tab}
			onValueChange={(tab) => navigate(`../${tab}`, { relative: "path" })}
		>
			<header className="flex items-center border-b border-gray-6 bg-gray-1 px-3 py-4">
				<div className="flex flex-1 items-center gap-8">
					<h1 className="font-semibold leading-6 text-gray-12">{tableName}</h1>

					<Navigation />
				</div>

				{loaderData.limit ? <LimitSelector /> : null}
			</header>

			<Table>
				<THead>
					{loaderData.tab === "row"
						? loaderData.tableColumns.map((column) => (
								<THeadData key={column.name}>
									{column.name}{" "}
									{column.pk ? (
										<KeyIcon className="h-5 w-5 text-orange-11" />
									) : (
										""
									)}
								</THeadData>
						  ))
						: null}

					{loaderData.tab !== "row"
						? loaderData.table?.keys.map((key) => (
								<THeadData key={key}>{key}</THeadData>
						  ))
						: null}
				</THead>
				<TBody>
					{loaderData.tab === "row"
						? loaderData.rows.map((row, rowIndex) => (
								// rome-ignore lint/suspicious/noArrayIndexKey: <rows will always refetched on changes>
								<TRow key={rowIndex}>
									{loaderData.tableColumns.map((column) => {
										const value = row[column.name];

										return (
											<TData key={`${rowIndex}-${column.name}`}>
												{typeof value === "string" ||
												typeof value === "number" ||
												typeof value === "boolean" ? (
													value.toString()
												) : (
													<span className="text-gray-9">null</span>
												)}
											</TData>
										);
									})}
								</TRow>
						  ))
						: null}

					{loaderData.tab === "column"
						? loaderData.table.columns.map((column) => (
								<TRow key={column.name}>
									{Object.entries(column).map(([key, value]) => (
										<TData key={key}>
											{typeof value === "string" ||
											typeof value === "number" ? (
												value
											) : (
												<span className="text-gray-9">null</span>
											)}
										</TData>
									))}
								</TRow>
						  ))
						: null}

					{loaderData.tab === "index"
						? loaderData.table?.indexes.map((index) => (
								<TRow key={index.name}>
									{Object.entries(index).map(([key, value]) => (
										<TData key={key}>
											{typeof value === "string" ||
											typeof value === "number" ? (
												value
											) : (
												<span className="text-gray-9">null</span>
											)}
										</TData>
									))}
								</TRow>
						  ))
						: null}
				</TBody>
			</Table>

			{loaderData.tab === "row" && loaderData.page.total > 1 ? (
				<Pagination />
			) : null}
		</Tabs.Root>
	);
}

function Navigation() {
	const loaderData = useLoaderData() as LoaderData;
	const list = [
		{ value: "row", name: "Rows", disabled: false },
		{ value: "column", name: "Colums", disabled: false },
		{ value: "index", name: "Indexes", disabled: loaderData.disableIndexTab },
	];

	return (
		<Tabs.List className="inline-flex items-center justify-center rounded-md bg-gray-3 p-1">
			{list.map((item) => (
				<Tabs.Trigger
					key={item.value}
					value={item.value}
					className="inline-flex min-w-[6rem] items-center justify-center rounded px-3 py-1.5 text-sm font-medium text-gray-11 transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-6 data-[state=active]:text-gray-12"
					disabled={item.disabled}
				>
					{item.name}
				</Tabs.Trigger>
			))}
		</Tabs.List>
	);
}

function LimitSelector() {
	const loaderData = useLoaderData() as LoaderData;
	const fetcher = useFetcher();
	const action = useFormAction();

	const values = ["10", "25", "50", "100"];

	return (
		<div className="flex items-center divide-x divide-gray-6 rounded-md border border-gray-6">
			{/* <div className="p-2"> */}
			<div className="select-none p-2 text-sm font-medium">
				{loaderData.limit} Rows per page
			</div>
			<Select.Root
				value={loaderData.limit?.toString()}
				onValueChange={(value) =>
					fetcher.submit({ limit: value }, { action, method: "POST" })
				}
			>
				<Select.Trigger className="rounded-r-md p-2 transition-colors hover:bg-gray-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-8 data-[state=open]:bg-gray-5">
					<Select.Icon asChild>
						<ChevronUpDownIcon className="h-5 w-5 text-gray-12" />
					</Select.Icon>
				</Select.Trigger>

				<Select.Portal>
					<Select.Content
						className="border-md relative z-50 min-w-[8rem] translate-y-1 overflow-hidden rounded-md border border-gray-6 bg-gray-3 shadow-md shadow-overlay-9 animate-in fade-in-80"
						position="popper"
					>
						<Select.Viewport className="h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] p-1">
							{values.map((value) => (
								<Select.Item
									key={value}
									value={value}
									className="relative flex w-full select-none items-center rounded-sm py-1.5 pl-8 pr-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-8 data-[highlighted]:bg-gray-5"
								>
									<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
										<Select.ItemIndicator>
											<CheckIcon className="h-4 w-4" />
										</Select.ItemIndicator>
									</span>

									<Select.ItemText>{value}</Select.ItemText>
								</Select.Item>
							))}
						</Select.Viewport>
					</Select.Content>
				</Select.Portal>
			</Select.Root>
			{/* </div> */}
		</div>
	);
}

function Pagination() {
	const loaderData = useLoaderData() as LoaderData;
	const paginationRange = usePaginationRange({
		page: loaderData.page?.current ?? 1,
		total: loaderData.page?.total ?? 1,
	});

	if (loaderData.tab !== "row") return null;

	return (
		<footer className="flex items-center justify-between gap-4 border-t border-gray-6 bg-gray-3 px-3 py-2">
			<div>
				<p className="text-xs text-gray-12">
					Showing{" "}
					<span className="font-medium">{loaderData.displayedRows.from}</span>{" "}
					to <span className="font-medium">{loaderData.displayedRows.to}</span>{" "}
					of <span className="font-medium">{loaderData.totalRows}</span> results
				</p>
			</div>
			<div>
				<nav
					className="isolate inline-flex -space-x-px rounded-md shadow-sm"
					aria-label="Pagination"
				>
					{paginationRange.map((p, idx) => {
						if (p === "dots") {
							return (
								<span
									key={`${p}-${idx}`}
									className={cn(
										idx === 0 && "rounded-l-md",
										idx === paginationRange.length - 1 && "rounded-r-md",
										"relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-11",
									)}
								>
									...
								</span>
							);
						}

						return (
							<NavLink
								key={p}
								to={`?page=${p}`}
								className={cn(
									idx === 0 && "rounded-l-md",
									idx === paginationRange.length - 1 && "rounded-r-md",
									p === loaderData.page.current
										? "bg-gray-5 text-gray-12 hover:bg-gray-6"
										: "text-gray-11 hover:bg-gray-4",
									"relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-7 focus-visible:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-8",
								)}
							>
								{p}
							</NavLink>
						);
					})}
				</nav>
			</div>
		</footer>
	);
}

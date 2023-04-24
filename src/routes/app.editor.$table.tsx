import {
	TBody,
	TData,
	THead,
	THeadData,
	TRow,
	Table,
} from "../components/table";
import { usePaginationRange } from "../hooks/use-pagination-range";
import { selectTable } from "../services/db";
import { cn } from "../utils";
import { LoaderData as AppLoaderData } from "./app";
import { KeyIcon } from "@heroicons/react/20/solid";
import qs from "fast-querystring";
import * as React from "react";
import {
	LoaderFunctionArgs,
	NavLink,
	useLoaderData,
	useRevalidator,
	useRouteLoaderData,
} from "react-router-dom";
import { z } from "zod";

export type LoaderData = Awaited<ReturnType<typeof loader>>;
export async function loader({ request, params }: LoaderFunctionArgs) {
	const { page } = z
		.object({
			page: z.coerce.number().optional().default(1),
		})
		.parse(qs.parse(new URL(request.url).searchParams.toString()));
	const tableName = z.string().parse(params.table);

	const { count, rows } = await selectTable<{
		[x: string]: string | number | boolean;
	}>(tableName, (page - 1) * 50);

	return {
		tableName,
		rows,
		page: {
			current: page,
			total: Math.ceil(count / 50),
		},
		displayedRows: {
			from: page * 50 - 49,
			to: Math.ceil(count / 50) === page ? count : page * 50,
		},
		totalRows: count,
	};
}

export function Component() {
	const { tableName, rows, page } = useLoaderData() as LoaderData;
	const { tables } = useRouteLoaderData("app") as AppLoaderData;
	const tableColumn = tables.find((table) => table.name === tableName);
	if (!tableColumn) throw new Error("Table not found");

	const revalidator = useRevalidator();

	React.useEffect(() => {
		const interval = setInterval(() => {
			revalidator.revalidate();
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div>
			<header className="flex items-center border-b border-gray-6 bg-gray-1 px-3 py-4">
				<div className="flex-1">
					<h1 className="font-semibold leading-6 text-gray-12">{tableName}</h1>
				</div>

				{page.total > 1 ? <Pagination /> : null}
			</header>

			<Table>
				<THead>
					{tableColumn.columns.map((column) => (
						<THeadData key={column.name}>
							{column.name}{" "}
							{column.pk ? <KeyIcon className="h-5 w-5 text-orange-10" /> : ""}
						</THeadData>
					))}
				</THead>
				<TBody>
					{rows.map((d, idx) => (
						<TRow key={`${Object.keys(d).join()}-${idx}`}>
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

			{page.total > 1 ? (
				<footer className="flex justify-end border-t border-gray-6 bg-gray-3 px-3 py-2">
					<Pagination />
				</footer>
			) : null}
		</div>
	);
}

function Pagination() {
	const { page, displayedRows, totalRows } = useLoaderData() as LoaderData;
	const paginationRange = usePaginationRange({
		page: page.current,
		total: page.total,
	});

	return (
		<div className="flex items-center gap-4">
			<div>
				<p className="text-sm text-gray-12">
					Showing <span className="font-medium">{displayedRows.from}</span> to{" "}
					<span className="font-medium">{displayedRows.to}</span> of{" "}
					<span className="font-medium">{totalRows}</span> results
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
									p === page.current
										? "bg-gray-5 text-gray-12 hover:bg-gray-6"
										: "text-gray-11 hover:bg-gray-4",
									"ring-1 ring-inset ring-gray-7 relative inline-flex items-center px-4 py-2 text-sm font-semibold focus-visible:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-8",
								)}
							>
								{p}
							</NavLink>
						);
					})}
				</nav>
			</div>
		</div>
	);
}

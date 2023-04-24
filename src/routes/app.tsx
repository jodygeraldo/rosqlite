import { Button } from "../components/ui/button";
import { getTableInfo } from "../services/db";
import { cn } from "../utils";
import { openFileDialog } from "../utils/recent-file";
import {
	CircleStackIcon,
	FolderOpenIcon,
	TableCellsIcon,
} from "@heroicons/react/20/solid";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
	NavLink,
	Outlet,
	ScrollRestoration,
	redirect,
	useFetcher,
	useLoaderData,
	useLocation,
	useNavigate,
} from "react-router-dom";

export async function action() {
	const success = await openFileDialog();

	if (success) {
		throw redirect("/app/editor");
	}

	return null;
}

export type LoaderData = Awaited<ReturnType<typeof loader>>;
export async function loader() {
	const tables = await getTableInfo();
	return { tables };
}

const navigations = [
	{
		name: "Table",
		path: "/app/editor",
		icon: TableCellsIcon,
	},
	{
		name: "Database",
		path: "/app/database",
		icon: CircleStackIcon,
	},
] as const;

export function Component() {
	const { tables } = useLoaderData() as LoaderData;
	const fetcher = useFetcher();
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<div>
			<Tooltip.Provider>
				<nav className="fixed inset-y-0 left-0 z-40 flex w-20 flex-col overflow-y-auto border-r border-gray-6 bg-gray-2">
					<fetcher.Form
						method="POST"
						className="mt-6 flex items-center justify-center"
					>
						<Tooltip.Root>
							<Tooltip.Trigger asChild>
								<button
									type="submit"
									name="intent"
									value="open"
									className="flex rounded-md p-3 text-gray-11 transition-colors hover:bg-gray-4 hover:text-gray-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-8 active:bg-gray-5"
								>
									<span className="sr-only">open file</span>
									<FolderOpenIcon className="h-6 w-6 shrink-0" />
								</button>
							</Tooltip.Trigger>

							<Tooltip.Portal>
								<Tooltip.Content
									side="right"
									className="z-50 rounded bg-overlay-11 px-2 py-1"
								>
									<Tooltip.Arrow className="fill-overlay-11" />
									<span className="text-xs font-medium text-gray-12">
										Open file
									</span>
								</Tooltip.Content>
							</Tooltip.Portal>
						</Tooltip.Root>
					</fetcher.Form>

					<ul className="flex flex-1 flex-col items-center justify-center space-y-2">
						{navigations.map((item) => (
							<Tooltip.Root key={item.name}>
								<Tooltip.Trigger asChild>
									<li>
										<NavLink
											to={item.path}
											className={({ isActive }) =>
												cn(
													isActive
														? "bg-gray-5 text-gray-12 hover:bg-gray-6"
														: "text-gray-11 hover:bg-gray-4 hover:text-gray-12",
													"group flex rounded-md p-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-8",
												)
											}
										>
											<span className="sr-only">{item.name}</span>
											<item.icon className="h-6 w-6 shrink-0" />
										</NavLink>
									</li>
								</Tooltip.Trigger>

								<Tooltip.Portal>
									<Tooltip.Content
										side="right"
										className="z-50 rounded bg-overlay-11 px-2 py-1"
									>
										<Tooltip.Arrow className="fill-overlay-11" />
										<span className="text-xs font-medium text-gray-12">
											{item.name}
										</span>
									</Tooltip.Content>
								</Tooltip.Portal>
							</Tooltip.Root>
						))}
					</ul>
				</nav>
			</Tooltip.Provider>

			<div className="pl-20">
				<aside className="fixed inset-y-0 left-20 w-72 overflow-y-auto border-r border-gray-6 bg-gray-2 px-4 py-6">
					<div className="flex items-center justify-between border-b border-gray-6 pb-2">
						<h3 className="text-base font-semibold leading-6 text-gray-12">
							Tables ({tables.length})
						</h3>
					</div>

					<div className="mt-2 flex flex-col ">
						{tables.map(({ name }) => (
							<Button
								onClick={() =>
									navigate(
										`${
											location.pathname.startsWith("/app/editor")
												? "/app/editor/"
												: "/app/database/"
										}${name}`,
									)
								}
								key={name}
								variant="ghost"
								size="small"
								className={cn(
									location.pathname.endsWith(name)
										? "text-gray-12"
										: "text-gray-11",
									"text-left",
								)}
							>
								{name}
							</Button>
						))}
					</div>
				</aside>

				<div className="pl-72">
					<Outlet />
				</div>
			</div>

			<ScrollRestoration />
		</div>
	);
}

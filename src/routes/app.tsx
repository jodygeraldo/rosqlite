import { OpenFileButton } from "../components/OpenFileButton";
import { Button } from "../components/ui/button";
import { getTableNames } from "../services/db";
import { cn } from "../utils";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import * as Tooltip from "@radix-ui/react-tooltip";
import { getVersion } from "@tauri-apps/api/app";
import { message } from "@tauri-apps/api/dialog";
import {
	Form,
	Outlet,
	ScrollRestoration,
	useLoaderData,
	useLocation,
	useNavigate,
	useParams,
} from "react-router-dom";

export async function loader() {
	const tableNames = await getTableNames();
	return { tableNames };
}

export function Component() {
	const { tableNames } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
	const navigate = useNavigate();
	const location = useLocation();
	const { tab } = useParams();

	return (
		<div>
			<aside className="fixed inset-y-0 left-0 w-72 overflow-y-auto border-r border-gray-6 bg-gray-2 px-4 py-6">
				<Tooltip.Provider>
					<div className="flex items-center justify-between">
						<Form
							action="/"
							method="POST"
							className="flex items-center justify-center"
						>
							<input
								type="hidden"
								name="redirectTo"
								value={location.pathname}
							/>
							<Tooltip.Root>
								<Tooltip.Trigger asChild>
									<OpenFileButton />
								</Tooltip.Trigger>

								<Tooltip.Portal>
									<Tooltip.Content
										side="right"
										className="z-50 rounded bg-overlay-12 px-2 py-1"
									>
										<Tooltip.Arrow className="fill-overlay-11" />
										<span className="text-xs font-medium text-gray-12">
											Open file
										</span>
									</Tooltip.Content>
								</Tooltip.Portal>
							</Tooltip.Root>
						</Form>

						<Tooltip.Root>
							<Tooltip.Trigger asChild>
								<button
									type="button"
									onClick={async () =>
										await message(`App version: v${await getVersion()}`, {
											title: "About rosqlite",
											type: "info",
										})
									}
									className="flex rounded-md p-2 text-gray-11 transition-colors hover:bg-gray-4 hover:text-gray-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-8 active:bg-gray-5"
								>
									<span className="sr-only">About rosqlite</span>
									<InformationCircleIcon className="h-4 w-4 shrink-0" />
								</button>
							</Tooltip.Trigger>

							<Tooltip.Portal>
								<Tooltip.Content
									side="right"
									className="z-50 rounded bg-overlay-12 px-2 py-1"
								>
									<Tooltip.Arrow className="fill-overlay-11" />
									<span className="text-xs font-medium text-gray-12">
										About rosqlite
									</span>
								</Tooltip.Content>
							</Tooltip.Portal>
						</Tooltip.Root>
					</div>
				</Tooltip.Provider>

				<div className="mt-8 flex items-center justify-between border-b border-gray-6 pb-2">
					<h3 className="text-base font-semibold leading-6 text-gray-12">
						Tables ({tableNames.length})
					</h3>
				</div>

				<div className="mt-2 flex flex-col ">
					{tableNames.map((name) => (
						<Button
							onClick={() => navigate(`/app/${name}/${tab}`)}
							key={name}
							variant="ghost"
							size="small"
							className={cn(
								location.pathname === `/app/${name}/${tab}`
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

			<ScrollRestoration />
		</div>
	);
}

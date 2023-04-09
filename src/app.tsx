import { Button } from "./components/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "./components/select";
import {
	$currentFile,
	$files,
	newFile,
	openFile,
	setFiles,
} from "./stores/file";
import { $router } from "./stores/router";
import { cn } from "./utils";
import {
	CircleStackIcon,
	CommandLineIcon,
	HomeIcon,
	TableCellsIcon,
} from "@heroicons/react/20/solid";
import { useStore } from "@nanostores/react";
import { getPagePath } from "@nanostores/router";
import * as Tooltip from "@radix-ui/react-tooltip";
import { open } from "@tauri-apps/api/dialog";
import * as React from "react";

function App() {
	const page = useStore($router);

	switch (page?.route) {
		case "home":
			return (
				<Layout>
					<h1>home</h1>
				</Layout>
			);
		case "editor":
			return (
				<Layout>
					<h1>editor</h1>
				</Layout>
			);
		case "sql":
			return (
				<Layout>
					<h1>sql</h1>
				</Layout>
			);
		case "database":
			return (
				<Layout>
					<h1>database</h1>
				</Layout>
			);
		default:
			return (
				<Layout>
					<h1>404</h1>
				</Layout>
			);
	}
}

const navigations = [
	{
		name: "Home",
		path: getPagePath($router, "home"),
		icon: HomeIcon,
	},
	{
		name: "Table Editor",
		path: getPagePath($router, "editor"),
		icon: TableCellsIcon,
	},
	{
		name: "SQL Command",
		path: getPagePath($router, "sql"),
		icon: CommandLineIcon,
	},
	{
		name: "Database",
		path: getPagePath($router, "database"),
		icon: CircleStackIcon,
	},
] as const;

function Layout({ children }: { children: React.ReactNode }) {
	const page = useStore($router);
	const files = useStore($files);
	const currentFile = useStore($currentFile);
	console.log(files, currentFile);

	return (
		<>
			<div className="fixed inset-y-0 left-0 block w-20 overflow-y-auto border-r border-gray-6 bg-gray-2">
				<nav className="h-full">
					<ul className="flex h-full flex-col items-center justify-center space-y-2">
						<Tooltip.Provider>
							{navigations.map((item) => (
								<Tooltip.Root key={item.name}>
									<Tooltip.Trigger asChild>
										<li>
											<a
												href={item.path}
												className={cn(
													item.path === page?.path
														? "bg-gray-5 text-gray-12"
														: "text-gray-11 hover:bg-gray-4 hover:text-gray-12",
													"group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-8",
												)}
												aria-current={
													item.path === page?.path ? "page" : undefined
												}
											>
												<span className="sr-only">{item.name}</span>
												<item.icon className="h-6 w-6 shrink-0" />
											</a>
										</li>
									</Tooltip.Trigger>
									<Tooltip.Portal>
										<Tooltip.Content
											side="right"
											className="z-10 rounded bg-overlay-11 px-2 py-1"
										>
											<Tooltip.Arrow className="fill-overlay-11" />
											<span className="text-xs font-medium text-gray-12">
												{item.name}
											</span>
										</Tooltip.Content>
									</Tooltip.Portal>
								</Tooltip.Root>
							))}
						</Tooltip.Provider>
					</ul>
				</nav>
			</div>

			<main className="pl-20">
				<header className="sticky top-0 flex shrink-0 items-center justify-between gap-x-4 border-b border-gray-6 bg-gray-2 px-4 py-2 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
					<Select
						value={currentFile}
						onValueChange={(value) => setFiles(value)}
					>
						<SelectTrigger className="max-w-md">
							<SelectValue placeholder="Select a fruit" />
						</SelectTrigger>
						<SelectContent>
							{files.map((file) => (
								<SelectItem key={file} value={file}>
									{file}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<div className="flex items-center gap-4">
						<Button
							type="button"
							onClick={async () => {
								await newFile();
							}}
							variant="outline"
						>
							New file
						</Button>

						<Button
							type="button"
							onClick={async () => {
								await openFile();
							}}
						>
							Open file
						</Button>
					</div>
				</header>

				<div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">{children}</div>
			</main>
		</>
	);
}

export default App;

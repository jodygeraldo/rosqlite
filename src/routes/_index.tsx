import { Button } from "../components/ui/button";
import {
	getRecentFiles,
	openFileDialog,
	setRecentFile,
} from "../utils/recent-file";
import qs from "fast-querystring";
import {
	ActionFunctionArgs,
	Form,
	redirect,
	useLoaderData,
	useNavigate,
} from "react-router-dom";
import { z } from "zod";

export async function action({ request }: ActionFunctionArgs) {
	const query = qs.parse(await request.text());
	const Schema = z.object({
		intent: z.literal("open"),
		filepath: z.string().optional(),
	});
	const data = Schema.parse(query);

	if (typeof data.filepath === "string") {
		await setRecentFile(data.filepath);
		throw redirect("/app/editor");
	}

	const success = await openFileDialog();

	if (success) {
		throw redirect("/app/editor");
	}

	return null;
}

export async function loader() {
	const recentFiles = await getRecentFiles();
	return { recentFiles };
}

export function Component() {
	const { recentFiles } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

	return (
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl py-10">
				<div className="border-b border-gray-6 py-2">
					<div className="-ml-4 -mt-2 flex items-center justify-between">
						<div className="ml-4 mt-2">
							<h3 className="text-base font-semibold leading-6 text-gray-12">
								Recent files
							</h3>
						</div>
						<Form method="POST" className="ml-4 mt-2">
							<Button type="submit" name="intent" value="open">
								Open file
							</Button>
						</Form>
					</div>
				</div>

				<div className="mt-4">
					{recentFiles.length === 0 ? (
						<p className="text-sm text-gray-11">No recent files</p>
					) : (
						<ul>
							{recentFiles.map((filepath) => (
								<li key={filepath} className="list-inside list-disc">
									<Form method="post" className="inline">
										<input type="hidden" name="filepath" value={filepath} />
										<Button
											type="submit"
											name="intent"
											value="open"
											variant="ghost"
										>
											{filepath}
										</Button>
									</Form>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}

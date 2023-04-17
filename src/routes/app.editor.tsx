import { getTables } from "../services/db";
import { LoaderFunctionArgs, redirect } from "react-router-dom";

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url);

	const tables = await getTables();
	if (tables.length > 0 && url.pathname === "/app/editor") {
		throw redirect(`/app/editor/${tables[0].name}`);
	}

	return null;
}

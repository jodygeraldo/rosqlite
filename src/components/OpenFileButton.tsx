import { Button } from "./ui/button";
import { FolderOpenIcon } from "@heroicons/react/20/solid";
import * as React from "react";

const OpenFileButton = React.forwardRef<HTMLButtonElement>(
	function OpenFileButton(_, forwardedRef) {
		return (
			<Button ref={forwardedRef} type="submit" name="intent" value="open">
				<FolderOpenIcon className="h-4 w-4 shrink-0" />
				<span className="ml-2">open file</span>
			</Button>
		);
	},
);

export { OpenFileButton };

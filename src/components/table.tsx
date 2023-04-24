import * as React from "react";

function Table({ children }: { children: React.ReactNode }) {
	return (
		<div className="flow-root">
			<div className="overflow-x-auto">
				<div className="inline-block min-w-full align-middle">
					<table className="min-w-full divide-y divide-gray-7">
						{children}
					</table>
				</div>
			</div>
		</div>
	);
}

function THead({ children }: { children: React.ReactNode }) {
	return (
		<thead>
			<tr className="divide-x divide-gray-7">{children}</tr>
		</thead>
	);
}

function THeadData({ children }: { children: React.ReactNode }) {
	return (
		<th
			scope="col"
			className="bg-gray-3 px-3 py-3.5 text-left text-sm font-semibold text-gray-12"
		>
			<div className="inline-flex items-center gap-2">{children}</div>
		</th>
	);
}

function TBody({ children }: { children: React.ReactNode }) {
	return <tbody>{children}</tbody>;
}

function TRow({ children }: { children: React.ReactNode }) {
	return <tr className="divide-x divide-gray-6">{children}</tr>;
}

function TData({ children }: { children: React.ReactNode }) {
	return (
		<td className="whitespace-nowrap border-b border-gray-6 px-3 py-2 text-sm text-gray-11">
			{children}
		</td>
	);
}

export { Table, THead, THeadData, TBody, TRow, TData };

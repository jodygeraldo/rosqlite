// simplified version of https://github.com/mantinedev/mantine/blob/master/src/mantine-hooks/src/use-pagination/use-pagination.ts
import { useMemo } from "react";

function range(start: number, end: number) {
	const length = end - start + 1;
	return Array.from({ length }, (_, index) => index + start);
}

const DOTS = "dots";
const SIBLINGS = 1;
const BOUNDARIES = 1;
const MAX_PAGE_NUMBERS = 7;

export function usePaginationRange({
	total,
	page,
}: { page: number; total: number }) {
	const paginationRange = useMemo((): (number | "dots")[] => {
		if (MAX_PAGE_NUMBERS >= total) {
			return range(1, total);
		}

		const leftSiblingIndex = Math.max(page - SIBLINGS, BOUNDARIES);
		const rightSiblingIndex = Math.min(page + SIBLINGS, total - BOUNDARIES);

		const shouldShowLeftDots = leftSiblingIndex > BOUNDARIES + 2;
		const shouldShowRightDots = rightSiblingIndex < total - (BOUNDARIES + 1);

		if (!shouldShowLeftDots && shouldShowRightDots) {
			const leftItemCount = SIBLINGS * 2 + BOUNDARIES + 2;
			return [
				...range(1, leftItemCount),
				DOTS,
				...range(total - (BOUNDARIES - 1), total),
			];
		}

		if (shouldShowLeftDots && !shouldShowRightDots) {
			const rightItemCount = BOUNDARIES + 1 + 2 * SIBLINGS;
			return [
				...range(1, BOUNDARIES),
				DOTS,
				...range(total - rightItemCount, total),
			];
		}

		return [
			...range(1, BOUNDARIES),
			DOTS,
			...range(leftSiblingIndex, rightSiblingIndex),
			DOTS,
			...range(total - BOUNDARIES + 1, total),
		];
	}, [page, total]);

	return paginationRange;
}

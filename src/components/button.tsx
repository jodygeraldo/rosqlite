import { cn } from "../utils";
import * as React from "react";

const variantClasses = {
	default: "text-gray-12 bg-gray-3 hover:bg-gray-4 active:bg-gray-5",
	outline: "text-gray-12 border border-gray-6 hover:bg-gray-4 active:bg-gray-5",
	ghost: "text-gray-12 hover:bg-gray-4 active:bg-gray-5",
} satisfies Record<NonNullable<ButtonProps["variant"]>, string>;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "outline" | "ghost";
	className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{ variant = "default", className, ...props },
	ref,
) {
	return (
		<button
			className={cn(
				"rounded px-2.5 py-1.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-8",
				variantClasses[variant],
				className,
			)}
			ref={ref}
			{...props}
		/>
	);
});

export type { ButtonProps };
export { Button };

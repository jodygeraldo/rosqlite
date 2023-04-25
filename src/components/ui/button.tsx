import { cn } from "../../utils";
import * as React from "react";

const variantClasses = {
	default: "text-gray-12 bg-gray-3 hover:bg-gray-4 active:bg-gray-5",
	outline: "text-gray-12 border border-gray-6 hover:bg-gray-4 active:bg-gray-5",
	ghost: "text-gray-12 hover:bg-gray-4 active:bg-gray-5",
} satisfies Record<NonNullable<ButtonProps["variant"]>, string>;

const sizeClasses = {
	default: "px-2.5 py-1.5",
	small: "px-2 py-1",
} satisfies Record<NonNullable<ButtonProps["size"]>, string>;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "outline" | "ghost";
	size?: "default" | "small";
	className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{ variant = "default", size = "default", className, ...props },
	ref,
) {
	return (
		<button
			className={cn(
				"inline-flex items-center rounded text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-8",
				variantClasses[variant],
				sizeClasses[size],
				className,
			)}
			ref={ref}
			{...props}
		/>
	);
});

export type { ButtonProps };
export { Button };

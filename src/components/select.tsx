import { cn } from "../utils";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as React from "react";

const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(function SelectTrigger({ className, children, ...props }, ref) {
	return (
		<SelectPrimitive.Trigger
			ref={ref}
			className={cn(
				"group flex h-10 w-full items-center justify-between rounded-md border border-gray-7 bg-transparent px-3 py-2 text-sm transition-colors hover:border-gray-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-8 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-gray-9",
				className,
			)}
			{...props}
		>
			{children}
			<ChevronDownIcon className="h-4 w-4 text-gray-9 transition-colors group-hover:text-gray-10 " />
		</SelectPrimitive.Trigger>
	);
});

const SelectContent = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(function SelectContent({ className, children, ...props }, ref) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				ref={ref}
				className={cn(
					"relative z-50 min-w-fit overflow-hidden rounded-md border border-gray-6 bg-gray-3 text-gray-11 shadow-md animate-in fade-in-50",
					className,
				)}
				{...props}
			>
				<SelectPrimitive.Viewport className="p-1">
					{children}
				</SelectPrimitive.Viewport>
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	);
});

const SelectLabel = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(function SelectLabel({ className, ...props }, ref) {
	return (
		<SelectPrimitive.Label
			ref={ref}
			className={cn(
				"py-1.5 pl-8 pr-2 text-sm font-semibold text-gray-12",
				className,
			)}
			{...props}
		/>
	);
});

const SelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(function SelectItem({ className, children, ...props }, ref) {
	return (
		<SelectPrimitive.Item
			ref={ref}
			className={cn(
				"relative flex cursor-default select-none items-center rounded py-1.5 pl-8 pr-2 text-sm font-medium outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-4 data-[highlighted]:data-[state=checked]:bg-gray-6 data-[state=checked]:bg-gray-5 data-[disabled]:opacity-50",
				className,
			)}
			{...props}
		>
			<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
				<SelectPrimitive.ItemIndicator>
					<CheckIcon className="h-4 w-4" />
				</SelectPrimitive.ItemIndicator>
			</span>

			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	);
});

const SelectSeparator = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(function SelectSeparator({ className, ...props }, ref) {
	return (
		<SelectPrimitive.Separator
			ref={ref}
			className={cn("my-1 h-px bg-gray-6", className)}
			{...props}
		/>
	);
});

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

export {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectLabel,
	SelectItem,
	SelectSeparator,
};

import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Store } from "tauri-plugin-store-api";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function localStore() {
	return new Store(".local-kv");
}

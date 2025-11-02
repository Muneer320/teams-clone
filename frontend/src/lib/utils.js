import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A simple utility function to merge Tailwind classes, handling conflicts.
 * This requires installing `clsx` and `tailwind-merge`:
 * npm install clsx tailwind-merge
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

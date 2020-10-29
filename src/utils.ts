import { Timeout } from "bettertimers";

export const delay = async (ms: number) => {
	return await new Promise((resolve) => new Timeout(resolve, ms));
};
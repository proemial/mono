export type ObjectValues<T> = T extends { [key: string]: infer U }
	? U extends object
		? ObjectValues<U>
		: U
	: T;

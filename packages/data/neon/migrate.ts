import { migrate } from "drizzle-orm/neon-http/migrator";
import { neonDb } from "./db";

const run = async () => {
	console.log("start migration...");
	// this will automatically run needed migrations on the database
	const migration = await migrate(neonDb, { migrationsFolder: "./drizzle" });
	console.log({ migration });
	console.log("finishing up...");
};

run();

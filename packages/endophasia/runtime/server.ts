// Source-only Endophasia application runtime, built on coding-agent's experimental server. It is not part of the
// @endophasia/core build or package exports.
import {
	type RunningServer,
	type StartServerOptions,
	startServer,
} from "@earendil-works/pi-coding-agent/experimental/server";

const ENDOPHASIA_SESSION_WORKER_ENTRY_URL = new URL("./session-worker.ts", import.meta.url);

export type EndophasiaServerOptions = Omit<StartServerOptions, "sessionWorkerEntryUrl">;

/**
 * Start a Pi experimental server whose newly launched Session workers run the Endophasia Session worker. Workers
 * discovered from a replaced server are not checked against it, and automatic cold activation does not use it.
 */
export function startEndophasiaServer(options: EndophasiaServerOptions = {}): Promise<RunningServer> {
	return startServer({ ...options, sessionWorkerEntryUrl: ENDOPHASIA_SESSION_WORKER_ENTRY_URL });
}

import PocketBase, { ClientResponseError } from "pocketbase";

const POCKETBASE_URL =
    process.env.NEXT_PUBLIC_POCKETBASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8090";

export const pb = new PocketBase(POCKETBASE_URL);

pb.autoCancellation(false);

export function getPocketBaseErrorMessage(error: unknown, fallback = "Something went wrong.") {
    if (error instanceof ClientResponseError) {
        if (error.status === 0) {
            return `Cannot reach PocketBase at ${POCKETBASE_URL}. Start the server and confirm the URL.`;
        }

        const data = error.response as { message?: string } | undefined;
        if (data?.message) return data.message;
        if (error.message) return error.message;
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
}

export { POCKETBASE_URL };

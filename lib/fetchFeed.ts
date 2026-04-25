import { FeedResponse } from "./types";

export async function fetchFeed(notes: string): Promise<FeedResponse> {
    try {
        const res = await fetch("/api/generate-cards", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ notes }),
        });

        const data: Promise<FeedResponse> = await res.json();
        console.log(data);
        return data;
    } catch (err) {
        console.error(err);
        throw new Error("Could not fetch");
    }
};


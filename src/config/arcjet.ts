import arcjet, {detectBot, shield, slidingWindow} from "@arcjet/node";

if (!process.env.ARCJET_KEY && process.env.NODE_ENV !== "test") {
    throw new Error("ARCJET_KEY environment variable is required");
}

// Configure Arcjet with security rules.
const aj = arcjet({
    key: process.env.ARCJET_KEY!,
    rules: [
        shield({ mode: "LIVE" }),
        detectBot({
            mode: "LIVE",
            // Block all bots except the following
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                "CATEGORY:PREVIEW",
            ],
        }),
        slidingWindow({
            mode: "LIVE",
            interval: '10s',
            max: 50
        })
    ],
});

export default aj;
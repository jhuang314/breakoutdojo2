import { createDojoConfig } from "@dojoengine/core";

import manifest from "../contract/manifest_dev.json";

export const dojoConfig = createDojoConfig({
    manifest,
    // Remove this to use local server for development.
    rpcUrl: "https://api.cartridge.gg/x/breakoutdojo2/katana",
    toriiUrl: "https://api.cartridge.gg/x/breakoutdojo2/torii",
    relayUrl: "",
});

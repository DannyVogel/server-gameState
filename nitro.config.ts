//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",
  runtimeConfig: {
    IGDBClientId: process.env.IGDB_CLIENT_ID,
    IGDBClientSecret: process.env.IGDB_CLIENT_SECRET,
  },
});

import ClientGameResponse from "~/utils/gameState.class";

export default eventHandler(async (event) => {
  const config = useRuntimeConfig();
  const IGDBClientId = config.IGDBClientId;
  const token = getRequestHeader(event, "Authorization");
  const query = getRouterParam(event, "query");
  console.log("query", query, "token", token);

  const response = await $fetch<Promise<SearchResponse>>(
    "https://api.igdb.com/v4/games",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": IGDBClientId,
        Authorization: `${token}`,
      },
      body: `fields slug, name, id, genres.name, first_release_date, screenshots.image_id, platforms.name; search "${query}";limit 50;where keywords != (2004, 1617, 24124) & category != (5,12);`,
    }
  ).catch((error) => {
    console.error("error", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: error.message,
    });
  });

  if (!response) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "No response from IGDB API",
    });
  }

  if (Array.isArray(response)) {
    if (response.length === 0) {
      throw createError({ statusCode: 404, message: "No game found" });
    } else if (response.length > 1) {
      const games = response.map((result) => new ClientGameResponse(result));
      return {
        statusCode: 200,
        body: games,
      };
    }
  }
});

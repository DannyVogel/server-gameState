export default eventHandler(async (event) => {
  const gameStorage = useStorage("gameList");
  const errorGames = {};
  const config = useRuntimeConfig();
  const IGDBClientId = config.IGDBClientId;
  const token = getRequestHeader(event, "Authorization");
  const body = await readBody(event);
  const gameList = body.gameList as Game[];

  for (const game of gameList) {
    const gameTitle = game.name;
    const gameReleaseDate = game.released;
    let date;
    if (gameReleaseDate) date = new Date(gameReleaseDate).getTime();
    console.log("getting:", gameTitle);

    const response = await $fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": IGDBClientId,
        Authorization: `${token}`,
      },
      body: `fields name, first_release_date ; where name = "${gameTitle}" ${
        date ? `& first_release_date = ${date}` : ""
      };`,
    });
    if (!response) {
      throw createError({ statusCode: 500, message: response.message });
    } else if (Array.isArray(response)) {
      if (response.length === 0) {
        console.log("No game found");
        errorGames[gameTitle] = response;
        continue;
      } else if (response.length > 1) {
        console.log("Multiple games found");
        errorGames[gameTitle] = response;
        continue;
      } else {
        game.twitchId = response[0].id;
        game.twitchName = response[0].name;
      }
    }
  }
  console.log("errorGames", errorGames);
  gameStorage.setItem("errorGames", JSON.stringify(errorGames));
  return {
    statusCode: 200,
    body: JSON.stringify(gameList),
  };
});

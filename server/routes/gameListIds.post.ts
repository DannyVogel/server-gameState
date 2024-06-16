export default eventHandler(async (event) => {
  const config = useRuntimeConfig();
  const IGDBClientId = config.IGDBClientId;
  const token = getRequestHeader(event, "Authorization");
  const body = await readBody(event);
  const oldGameList = body.gameList as Games;
  const newGameList = {} as Games;
  const errorGames = {};

  for (const id in oldGameList) {
    const gameTitle = oldGameList[id].name;
    const gameReleaseDate = oldGameList[id].released;
    let date;
    if (gameReleaseDate) date = new Date(gameReleaseDate).getTime();

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
    console.log("response", response);
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
        newGameList[response[0].id] = oldGameList[id];
        newGameList[response[0].id].id = response[0].id;
      }
    }
  }
  $fetch("/log/errors/gameList", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newGameList),
  });
  $fetch("/log/errors/errorGames", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(errorGames),
  });
  return {
    statusCode: 200,
    status: "success",
  };
});

interface Genre {
  games_count: number;
  id: number;
  image_background: string;
  name: string;
  slug: string;
}

interface StoreDetails {
  domain: string;
  games_count: number;
  id: number;
  image_background: string;
  name: string;
  slug: string;
}

interface Store {
  id: number;
  store: StoreDetails;
  url: string;
}

interface Game {
  comments: string;
  genres: Genre[];
  id: number;
  image: string;
  monthPlayed: string;
  name: string;
  platforms: string[];
  released: string;
  screenshots: string[];
  slug: string;
  status: string;
  stores: Store[];
  yearPlayed: string;
  twitchId?: string;
  twitchName?: string;
}

// For an array of these objects
type Games = Game[];

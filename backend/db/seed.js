/**
 * db/seed.js
 * ------------------------------------------------------------
 * Populates the shegerflix database with demo users, genres,
 * and Ethiopian-inspired titles (movies + series).
 *
 * Run with:  npm run seed   (from /backend)
 *
 * IMPORTANT: once titles exist, rename them through the Admin
 * dashboard (/admin), not by editing the `title` field here.
 * Titles are matched/deduplicated by slug (derived from title),
 * so editing a title's text here creates a NEW row instead of
 * updating the existing one — the Admin dashboard updates the
 * existing row in place and is the safe way to rename things.
 * ------------------------------------------------------------
 */
require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("../config/db");

const DEMO_PASSWORD = "Password123!";

const GENRES = [
  "Drama",
  "Comedy",
  "Action",
  "Romance",
  "Documentary",
  "Historical",
  "Family",
  "Thriller",
  "Music",
  "Crime",
];

const TITLES = [
  {
    title: "Love and Money 2",
    description:
      "A documentary crew retraces the discovery of Lucy (Dinkinesh) in the Afar region, exploring what the fossil taught the world about human origins.",
    type: "movie",
    language: "Amharic",
    release_year: 2019,
    duration_minutes: 96,
    rating: 8.2,
    is_featured: true,
    collection: "Popular in Ethiopia",
    genres: ["Documentary", "Historical"],
  },
  {
    title: "Difret",
    description:
      "A young lawyer takes on a controversial case defending a teenage girl who killed her would-be abductor, sparking a national debate on tradition versus justice.",
    type: "movie",
    language: "Amharic",
    release_year: 2014,
    duration_minutes: 99,
    rating: 8.5,
    is_featured: true,
    collection: "Sheger Picks",
    genres: ["Drama"],
  },
  {
    title: "Fig Tree",
    description:
      "Set during the Ethiopian Civil War, a Jewish-Ethiopian teenager hides her Christian boyfriend from conscription while her family prepares to emigrate.",
    type: "movie",
    language: "Amharic",
    release_year: 2018,
    duration_minutes: 93,
    rating: 7.6,
    is_featured: false,
    collection: "Ethiopian Movies",
    genres: ["Drama", "Romance", "Historical"],
  },
  {
    title: "Sost Meazen",
    description:
      "Three generations of a family in Addis Ababa clash over tradition, ambition, and love in this warm-hearted comedy-drama.",
    type: "movie",
    language: "Amharic",
    release_year: 2021,
    duration_minutes: 104,
    rating: 7.1,
    is_featured: true,
    collection: "Ethiopian Movies",
    genres: ["Comedy", "Family"],
  },
  {
    title: "Sost Le Sost",
    description:
      "A wedding-season farce in which three couples navigate meddling relatives, mistaken identities, and shegye chores gone hilariously wrong.",
    type: "movie",
    language: "Amharic",
    release_year: 2020,
    duration_minutes: 110,
    rating: 6.8,
    is_featured: false,
    collection: "Sheger Picks",
    genres: ["Comedy", "Romance"],
  },
  {
    title: "Siryet",
    description:
      "A gripping crime-thriller following a Federal Police detective in Addis Ababa unraveling a conspiracy that reaches the highest levels of a construction empire.",
    type: "movie",
    language: "Amharic",
    release_year: 2022,
    duration_minutes: 118,
    rating: 7.9,
    is_featured: true,
    collection: "Popular in Ethiopia",
    genres: ["Thriller", "Crime", "Action"],
  },
  {
    title: "Gonder Fikir",
    description:
      "A historical romance set in 17th-century Gondar, following a royal court painter who falls for a noblewoman promised to another house.",
    type: "movie",
    language: "Amharic",
    release_year: 2017,
    duration_minutes: 121,
    rating: 7.4,
    is_featured: false,
    collection: "Ethiopian Movies",
    genres: ["Historical", "Romance", "Drama"],
  },
  {
    title: "Adaam Warra",
    description:
      "A drama following a coffee-farming family in the Jimma zone as they navigate a changing market and a son who dreams of the city.",
    type: "movie",
    language: "Afaan Oromoo",
    release_year: 2020,
    duration_minutes: 101,
    rating: 7.7,
    is_featured: false,
    collection: "Afaan Oromoo",
    genres: ["Drama", "Family"],
  },
  {
    title: "Bilisummaa",
    description:
      "An action-drama chronicling a young community organizer standing up for his village during a land dispute in Oromia.",
    type: "movie",
    language: "Afaan Oromoo",
    release_year: 2021,
    duration_minutes: 108,
    rating: 7.0,
    is_featured: false,
    collection: "Afaan Oromoo",
    genres: ["Action", "Drama"],
  },
  {
    title: "Waaqeffannaa Roots",
    description:
      "A documentary exploring the indigenous Waaqeffanna belief system and its enduring influence on Oromo culture and identity.",
    type: "movie",
    language: "Afaan Oromoo",
    release_year: 2019,
    duration_minutes: 84,
    rating: 8.0,
    is_featured: false,
    collection: "Afaan Oromoo",
    genres: ["Documentary", "Historical"],
  },
  {
    title: "Adwa: The Unbroken Line",
    description:
      "A sweeping historical epic dramatizing the events leading up to the 1896 Battle of Adwa, told through the eyes of a Tigrayan family.",
    type: "movie",
    language: "Tigrinya",
    release_year: 2016,
    duration_minutes: 130,
    rating: 8.6,
    is_featured: false,
    collection: "Tigrinya",
    genres: ["Historical", "Action", "Drama"],
  },
  {
    title: "Meles: Mekelle Mornings",
    description:
      "A gentle slice-of-life drama about a schoolteacher rebuilding her classroom and her confidence in post-conflict Mekelle.",
    type: "movie",
    language: "Tigrinya",
    release_year: 2023,
    duration_minutes: 97,
    rating: 7.5,
    is_featured: false,
    collection: "Tigrinya",
    genres: ["Drama", "Family"],
  },
  {
    title: "Harmony of the Highlands",
    description:
      "A music documentary following a traveling krar and masenqo ensemble as they perform across the Tigray highlands.",
    type: "movie",
    language: "Tigrinya",
    release_year: 2022,
    duration_minutes: 78,
    rating: 7.8,
    is_featured: false,
    collection: "Tigrinya",
    genres: ["Music", "Documentary"],
  },
  {
    title: "The Habesha Kitchen",
    description:
      "An international co-production following chefs across three continents putting modern spins on classic Ethiopian dishes.",
    type: "movie",
    language: "International",
    release_year: 2023,
    duration_minutes: 89,
    rating: 7.3,
    is_featured: false,
    collection: "International",
    genres: ["Documentary"],
  },
  {
    title: "Sheger Nights",
    description:
      "An international thriller about an Ethiopian-American detective who returns to Addis Ababa to investigate her sister's disappearance.",
    type: "movie",
    language: "International",
    release_year: 2024,
    duration_minutes: 112,
    rating: 7.6,
    is_featured: false,
    collection: "International",
    genres: ["Thriller", "Crime"],
  },
  {
    title: "Doka",
    description:
      "A comedy-drama following a small-town Addis Ababa hustler whose get-rich-quick schemes keep pulling his neighborhood into chaos.",
    type: "movie",
    language: "Amharic",
    release_year: 2018,
    duration_minutes: 105,
    rating: 7.2,
    is_featured: true,
    collection: "Ethiopian Movies",
    genres: ["Comedy", "Drama"],
  },
  {
    title: "Kuragnaye",
    description:
      "A heartfelt drama about friendship and loyalty tested when one of two lifelong friends is forced to choose between ambition and family.",
    type: "movie",
    language: "Amharic",
    release_year: 2019,
    duration_minutes: 110,
    rating: 7.5,
    is_featured: false,
    collection: "Popular in Ethiopia",
    genres: ["Drama", "Family"],
  },
  {
    title: "Sostegnaw Ayn",
    description:
      "A suspenseful drama in which a family secret resurfaces after decades, forcing three siblings to confront the truth about their past.",
    type: "movie",
    language: "Amharic",
    release_year: 2020,
    duration_minutes: 108,
    rating: 7.4,
    is_featured: false,
    collection: "Sheger Picks",
    genres: ["Drama", "Thriller"],
  },
  {
    title: "Rebuni",
    description:
      "A romantic drama following two former sweethearts whose paths cross again years later, complicated by the lives they've since built apart.",
    type: "movie",
    language: "Amharic",
    release_year: 2017,
    duration_minutes: 100,
    rating: 7.0,
    is_featured: true,
    collection: "Ethiopian Movies",
    genres: ["Romance", "Drama"],
  },
  {
    title: "Fenji Wereda",
    description:
      "A neighborhood comedy set in an Addis Ababa district, following a cast of quirky locals whose lives tangle together over one chaotic week.",
    type: "movie",
    language: "Amharic",
    release_year: 2021,
    duration_minutes: 102,
    rating: 6.9,
    is_featured: false,
    collection: "Sheger Picks",
    genres: ["Comedy"],
  },
  {
    title: "Yarefede Arada",
    description:
      "A coming-of-age dramedy about a group of childhood friends from Arada navigating adulthood, ambition, and the pull of old neighborhood ties.",
    type: "movie",
    language: "Amharic",
    release_year: 2022,
    duration_minutes: 107,
    rating: 7.3,
    is_featured: true,
    collection: "Ethiopian Movies",
    genres: ["Comedy", "Drama"],
  },
  {
    title: "Yewendoch Guday",
    description:
      "A romantic comedy sequel following the men of the original film as new relationships, misunderstandings, and schemes upend their lives.",
    type: "movie",
    language: "Amharic",
    release_year: 2013,
    duration_minutes: 115,
    rating: 7.6,
    is_featured: true,
    collection: "Sheger Picks",
    genres: ["Comedy", "Romance"],
  },
  {
    title: "Meba",
    description:
      "A tight-knit Addis Ababa family is pulled apart when an old promise resurfaces, forcing the eldest daughter to choose between the life she built and the debt she owes her past.",
    type: "movie",
    language: "Amharic",
    release_year: 2012,
    duration_minutes: 96,
    rating: 6.5,
    is_featured: true,
    collection: "Sheger Picks",
    genres: ["Drama", "Family"],
  },
  {
    title: "Lamba",
    description:
      "A story of resilience following a community navigating hardship and hope.",
    type: "movie",
    language: "Amharic",
    release_year: 2019,
    duration_minutes: 89,
    rating: 7.3,
    is_featured: true,
    collection: "Sheger Picks",
    genres: ["Documentary", "Music"],
  },
  // ---- SERIES ----
  {
    title: "Fikir Endegena",
    description:
      "A beloved multi-generational family drama following the Alemu household through love, betrayal, and reconciliation over three decades in Addis Ababa.",
    type: "series",
    language: "Amharic",
    release_year: 2021,
    seasons: 3,
    rating: 8.3,
    is_featured: false,
    collection: "Ethiopian Series",
    genres: ["Drama", "Romance", "Family"],
  },
  {
    title: "Yezare Deriaye",
    description:
      "A modern workplace comedy set inside a chaotic Addis Ababa startup trying (and often failing) to disrupt the taxi industry.",
    type: "series",
    language: "Amharic",
    release_year: 2022,
    seasons: 2,
    rating: 7.4,
    is_featured: false,
    collection: "Ethiopian Series",
    genres: ["Comedy"],
  },
  {
    title: "Oromiyaa Sports Chronicles",
    description:
      "A docuseries profiling rising Oromo long-distance runners training in the highlands ahead of the world championships.",
    type: "series",
    language: "Afaan Oromoo",
    release_year: 2023,
    seasons: 1,
    rating: 8.1,
    is_featured: false,
    collection: "Afaan Oromoo",
    genres: ["Documentary"],
  },
  {
    title: "Tigray Tales",
    description:
      "An anthology series retelling classic Tigrinya folk stories with a modern visual style, one legend per episode.",
    type: "series",
    language: "Tigrinya",
    release_year: 2022,
    seasons: 1,
    rating: 7.7,
    is_featured: false,
    collection: "Tigrinya",
    genres: ["Drama", "Family", "Historical"],
  },
  {
    title: "Diaspora Diaries",
    description:
      "An international dramedy following four Ethiopian friends navigating careers and identity between Addis Ababa, DC, and Toronto.",
    type: "series",
    language: "International",
    release_year: 2024,
    seasons: 2,
    rating: 7.9,
    is_featured: false,
    collection: "International",
    genres: ["Comedy", "Drama", "Romance"],
  },
  {
    title: "Kiya",
    description:
      "A tense, character-driven film following one person's fight to hold their family together.",
    type: "movie",
    language: "Amharic",
    release_year: 2020,
    duration_minutes: 120,
    rating: 7.5,
    is_featured: false,
    collection: "Popular in Ethiopia",
    genres: ["Crime", "Comedy"],
  },
  {
    title: "Ayaskim",
    description:
      "A story of resilience following a community navigating hardship and hope.",
    type: "movie",
    language: "Amharic",
    release_year: 2012,
    duration_minutes: 95,
    rating: 8.6,
    is_featured: false,
    collection: "Popular in Ethiopia",
    genres: ["Thriller", "Documentary"],
  },
  {
    title: "Astaraqi",
    description:
      "A romance tested by distance, family expectations, and old rivalries.",
    type: "movie",
    language: "Amharic",
    release_year: 2014,
    duration_minutes: 112,
    rating: 7.6,
    is_featured: false,
    collection: "Popular in Ethiopia",
    genres: ["Comedy", "Thriller"],
  },
  {
    title: "Bechis Tedebke",
    description:
      "A romance tested by distance, family expectations, and old rivalries.",
    type: "movie",
    language: "Amharic",
    release_year: 2022,
    duration_minutes: 115,
    rating: 8.0,
    is_featured: false,
    collection: "Popular in Ethiopia",
    genres: ["Drama", "Historical"],
  },
  {
    title: "Ensaro",
    description:
      "A comedy of errors set among neighbors whose lives become hilariously entangled.",
    type: "movie",
    language: "Amharic",
    release_year: 2014,
    duration_minutes: 109,
    rating: 6.2,
    is_featured: false,
    collection: "Ethiopian Movies",
    genres: ["Drama", "Family"],
  },
  {
    title: "Genazhu",
    description:
      "A tense, character-driven film following one person's fight to hold their family together.",
    type: "movie",
    language: "Amharic",
    release_year: 2008,
    duration_minutes: 110,
    rating: 6.3,
    is_featured: false,
    collection: "Ethiopian Movies",
    genres: ["Action", "Family"],
  },
  {
    title: "Maya",
    description:
      "A comedy of errors set among neighbors whose lives become hilariously entangled.",
    type: "movie",
    language: "Amharic",
    release_year: 2014,
    duration_minutes: 121,
    rating: 8.0,
    is_featured: false,
    collection: "Ethiopian Movies",
    genres: ["Thriller", "Drama"],
  },
  {
    title: "Kebad Mizan",
    description:
      "A heartfelt story of ambition, love, and community set against the backdrop of modern Ethiopia.",
    type: "movie",
    language: "Amharic",
    release_year: 2011,
    duration_minutes: 107,
    rating: 8.0,
    is_featured: false,
    collection: "Ethiopian Movies",
    genres: ["Music", "Comedy"],
  },
  {
    title: "300shi",
    description:
      "A drama unfolding in Addis Ababa as a family confronts a decision that will change everything.",
    type: "movie",
    language: "Amharic",
    release_year: 2012,
    duration_minutes: 118,
    rating: 8.3,
    is_featured: false,
    collection: "Ethiopian Movies",
    genres: ["Historical", "Drama"],
  },
  {
    title: "Alsetm",
    description:
      "A comedy of errors set among neighbors whose lives become hilariously entangled.",
    type: "movie",
    language: "Amharic",
    release_year: 2018,
    duration_minutes: 99,
    rating: 6.5,
    is_featured: false,
    collection: "Ethiopian Movies",
    genres: ["Crime", "Documentary"],
  },
  {
    title: "Aratu Shamwoch",
    description:
      "A romance tested by distance, family expectations, and old rivalries.",
    type: "movie",
    language: "Amharic",
    release_year: 2024,
    duration_minutes: 103,
    rating: 8.4,
    is_featured: false,
    collection: "Ethiopian Movies",
    genres: ["Action", "Drama"],
  },
  {
    title: "Balageru",
    description:
      "A drama unfolding in Addis Ababa as a family confronts a decision that will change everything.",
    type: "movie",
    language: "Amharic",
    release_year: 2024,
    duration_minutes: 108,
    rating: 8.1,
    is_featured: false,
    collection: "Ethiopian Movies",
    genres: ["Family", "Comedy"],
  },
  {
    title: "Yeaddis Abeba Habtam",
    description:
      "A drama unfolding in Addis Ababa as a family confronts a decision that will change everything.",
    type: "movie",
    language: "Amharic",
    release_year: 2022,
    duration_minutes: 105,
    rating: 8.1,
    is_featured: false,
    collection: "Sheger Picks",
    genres: ["Family", "Thriller"],
  },
  {
    title: "Yebet Lij",
    description:
      "A heartfelt story of ambition, love, and community set against the backdrop of modern Ethiopia.",
    type: "movie",
    language: "Amharic",
    release_year: 2009,
    duration_minutes: 118,
    rating: 7.6,
    is_featured: false,
    collection: "Sheger Picks",
    genres: ["Romance", "Drama"],
  },
  {
    title: "Yeras Menged",
    description:
      "A romance tested by distance, family expectations, and old rivalries.",
    type: "movie",
    language: "Amharic",
    release_year: 2015,
    duration_minutes: 97,
    rating: 7.1,
    is_featured: false,
    collection: "Sheger Picks",
    genres: ["Family", "Action"],
  },
  {
    title: "Yilugnta",
    description:
      "A drama unfolding in Addis Ababa as a family confronts a decision that will change everything.",
    type: "movie",
    language: "Amharic",
    release_year: 2018,
    duration_minutes: 121,
    rating: 8.0,
    is_featured: false,
    collection: "Sheger Picks",
    genres: ["Action", "Drama"],
  },
  {
    title: "Affini",
    description:
      "A comedy of errors set among neighbors whose lives become hilariously entangled.",
    type: "movie",
    language: "Amharic",
    release_year: 2017,
    duration_minutes: 113,
    rating: 7.3,
    is_featured: false,
    collection: "Sheger Picks",
    genres: ["Romance", "Historical"],
  },
  {
    title: "Gemena",
    description:
      "A multi-season drama following an extended family through triumph, betrayal, and reconciliation.",
    type: "series",
    language: "Amharic",
    release_year: 2008,
    seasons: 3,
    rating: 6.0,
    is_featured: false,
    collection: "Ethiopian Series",
    genres: ["Music", "Thriller"],
  },
  {
    title: "Sew Le Sew",
    description:
      "A wealthy family is torn apart when a trusted family friend turns out to be behind a web of smuggling and money laundering, dragging multiple households into chaos.",
    type: "series",
    language: "Amharic",
    release_year: 2011,
    seasons: 1,
    rating: 7.5,
    is_featured: false,
    collection: "Ethiopian Series",
    genres: ["Drama", "Thriller"],
  },
  {
    title: "Mogachoch",
    description:
      "A long-running drama following Dr. Kokeb, a young physician balancing her medical career, her family, and her ambition to specialize in diabetes care.",
    type: "series",
    language: "Amharic",
    release_year: 2015,
    seasons: 1,
    rating: 7.6,
    is_featured: false,
    collection: "Ethiopian Series",
    genres: ["Drama", "Family"],
  },
  {
    title: "Zemen",
    description:
      "An ensemble drama following several Ethiopians navigating relationships, family pressures, and economic hardship, touching on migration and human trafficking.",
    type: "series",
    language: "Amharic",
    release_year: 2016,
    seasons: 1,
    rating: 7.4,
    is_featured: false,
    collection: "Ethiopian Series",
    genres: ["Drama"],
  },
  {
    title: "Welafen",
    description:
      "An ongoing series exploring love, ambition, and community life across Addis Ababa.",
    type: "series",
    language: "Amharic",
    release_year: 2019,
    seasons: 2,
    rating: 6.4,
    is_featured: false,
    collection: "Ethiopian Series",
    genres: ["Family", "Drama"],
  },
  {
    title: "Senselet",
    description:
      "A character-driven drama series following intertwined lives over multiple seasons.",
    type: "series",
    language: "Amharic",
    release_year: 2019,
    seasons: 2,
    rating: 7.4,
    is_featured: false,
    collection: "Ethiopian Series",
    genres: ["Crime", "Thriller"],
  },
  {
    title: "Besntu",
    description:
      "A character-driven drama series following intertwined lives over multiple seasons.",
    type: "series",
    language: "Amharic",
    release_year: 2009,
    seasons: 1,
    rating: 8.2,
    is_featured: false,
    collection: "Ethiopian Series",
    genres: ["Drama", "Comedy"],
  },
  {
    title: "Lijes",
    description:
      "An ongoing series exploring love, ambition, and community life across Addis Ababa.",
    type: "series",
    language: "Amharic",
    release_year: 2023,
    seasons: 3,
    rating: 7.1,
    is_featured: false,
    collection: "Ethiopian Series",
    genres: ["Documentary", "Action"],
  },
  {
    title: "Zetenegnaw Shi",
    description:
      "A multi-season drama following an extended family through triumph, betrayal, and reconciliation.",
    type: "series",
    language: "Amharic",
    release_year: 2019,
    seasons: 2,
    rating: 8.3,
    is_featured: false,
    collection: "Ethiopian Series",
    genres: ["Romance", "Drama"],
  },
  {
    title: "Eregnaye",
    description:
      "An ongoing series exploring love, ambition, and community life across Addis Ababa.",
    type: "series",
    language: "Amharic",
    release_year: 2018,
    seasons: 1,
    rating: 6.4,
    is_featured: false,
    collection: "Ethiopian Series",
    genres: ["Documentary", "Crime"],
  },
  {
    title: "Adey",
    description:
      "A character-driven drama series following intertwined lives over multiple seasons.",
    type: "series",
    language: "Amharic",
    release_year: 2022,
    seasons: 3,
    rating: 7.6,
    is_featured: false,
    collection: "Ethiopian Series",
    genres: ["Romance", "Historical"],
  },
  {
    title: "Gra Kegn",
    description:
      "A character-driven drama series following intertwined lives over multiple seasons.",
    type: "series",
    language: "Amharic",
    release_year: 2020,
    seasons: 2,
    rating: 6.5,
    is_featured: false,
    collection: "Ethiopian Series",
    genres: ["Historical", "Family"],
  },
  {
    title: "Mn Itazez",
    description:
      "An ongoing series exploring love, ambition, and community life across Addis Ababa.",
    type: "series",
    language: "Amharic",
    release_year: 2011,
    seasons: 1,
    rating: 8.1,
    is_featured: false,
    collection: "Ethiopian Series",
    genres: ["Historical", "Music"],
  },
  {
    title: "Behig Amlak",
    description:
      "A multi-season drama following an extended family through triumph, betrayal, and reconciliation.",
    type: "series",
    language: "Amharic",
    release_year: 2022,
    seasons: 3,
    rating: 7.4,
    is_featured: false,
    collection: "Ethiopian Series",
    genres: ["Thriller", "Documentary"],
  },
  {
    title: "FBI",
    description:
      "A comedy of errors set among neighbors whose lives become hilariously entangled.",
    type: "movie",
    language: "Amharic",
    release_year: 2015,
    duration_minutes: 93,
    rating: 6.2,
    is_featured: false,
    collection: null,
    genres: ["Drama", "Romance"],
  },
  {
    title: "Gize Mizan",
    description:
      "A romance tested by distance, family expectations, and old rivalries.",
    type: "movie",
    language: "Amharic",
    release_year: 2011,
    duration_minutes: 113,
    rating: 8.1,
    is_featured: false,
    collection: null,
    genres: ["Music", "Comedy"],
  },
  {
    title: "Man Yazewal",
    description:
      "A story of resilience following a community navigating hardship and hope.",
    type: "movie",
    language: "Amharic",
    release_year: 2009,
    duration_minutes: 101,
    rating: 8.4,
    is_featured: false,
    collection: null,
    genres: ["Historical", "Drama"],
  },
  {
    title: "Yesene Girgir",
    description:
      "A story of resilience following a community navigating hardship and hope.",
    type: "movie",
    language: "Amharic",
    release_year: 2013,
    duration_minutes: 117,
    rating: 7.7,
    is_featured: false,
    collection: null,
    genres: ["Music", "Action"],
  },
  {
    title: "Atse Mandela",
    description:
      "A heartfelt story of ambition, love, and community set against the backdrop of modern Ethiopia.",
    type: "movie",
    language: "Amharic",
    release_year: 2009,
    duration_minutes: 86,
    rating: 7.6,
    is_featured: false,
    collection: null,
    genres: ["Historical", "Thriller"],
  },
  {
    title: "Amalayu",
    description:
      "A story of resilience following a community navigating hardship and hope.",
    type: "movie",
    language: "Amharic",
    release_year: 2021,
    duration_minutes: 124,
    rating: 7.8,
    is_featured: false,
    collection: null,
    genres: ["Thriller", "Historical"],
  },
  {
    title: "Alem Beqagn",
    description:
      "A drama unfolding in Addis Ababa as a family confronts a decision that will change everything.",
    type: "movie",
    language: "Amharic",
    release_year: 2018,
    duration_minutes: 109,
    rating: 6.9,
    is_featured: false,
    collection: null,
    genres: ["Thriller", "Action"],
  },
  {
    title: "Dynamite",
    description:
      "A tense, character-driven film following one person's fight to hold their family together.",
    type: "movie",
    language: "Amharic",
    release_year: 2019,
    duration_minutes: 122,
    rating: 6.9,
    is_featured: false,
    collection: null,
    genres: ["Music", "Documentary"],
  },
  {
    title: "Zerubabel",
    description:
      "A story of resilience following a community navigating hardship and hope.",
    type: "movie",
    language: "Tigrinya",
    release_year: 2017,
    duration_minutes: 100,
    rating: 7.5,
    is_featured: false,
    collection: null,
    genres: ["Historical", "Music"],
  },
  {
    title: "Zeyregefet Embeba",
    description:
      "A heartfelt story of ambition, love, and community set against the backdrop of modern Ethiopia.",
    type: "movie",
    language: "Tigrinya",
    release_year: 2012,
    duration_minutes: 85,
    rating: 6.4,
    is_featured: false,
    collection: null,
    genres: ["Music", "Action"],
  },
  {
    title: "Meswati",
    description:
      "A comedy of errors set among neighbors whose lives become hilariously entangled.",
    type: "movie",
    language: "Tigrinya",
    release_year: 2009,
    duration_minutes: 92,
    rating: 6.3,
    is_featured: false,
    collection: null,
    genres: ["Action", "Family"],
  },
  {
    title: "Shmagle Fikri",
    description:
      "A heartfelt story of ambition, love, and community set against the backdrop of modern Ethiopia.",
    type: "movie",
    language: "Tigrinya",
    release_year: 2019,
    duration_minutes: 95,
    rating: 7.3,
    is_featured: false,
    collection: null,
    genres: ["Thriller", "Comedy"],
  },
  {
    title: "Shalom",
    description:
      "A comedy of errors set among neighbors whose lives become hilariously entangled.",
    type: "movie",
    language: "Tigrinya",
    release_year: 2020,
    duration_minutes: 99,
    rating: 6.5,
    is_featured: false,
    collection: null,
    genres: ["Historical", "Action"],
  },
  {
    title: "Debbas",
    description:
      "A comedy of errors set among neighbors whose lives become hilariously entangled.",
    type: "movie",
    language: "Tigrinya",
    release_year: 2018,
    duration_minutes: 85,
    rating: 7.3,
    is_featured: false,
    collection: null,
    genres: ["Romance", "Historical"],
  },
  {
    title: "Mircha",
    description:
      "A heartfelt story of ambition, love, and community set against the backdrop of modern Ethiopia.",
    type: "movie",
    language: "Tigrinya",
    release_year: 2016,
    duration_minutes: 100,
    rating: 7.2,
    is_featured: false,
    collection: null,
    genres: ["Crime", "Action"],
  },
  {
    title: "Turda",
    description:
      "A romance tested by distance, family expectations, and old rivalries.",
    type: "movie",
    language: "Tigrinya",
    release_year: 2017,
    duration_minutes: 105,
    rating: 7.7,
    is_featured: false,
    collection: null,
    genres: ["Music", "Historical"],
  },
  {
    title: "Emnet",
    description:
      "A drama unfolding in Addis Ababa as a family confronts a decision that will change everything.",
    type: "movie",
    language: "Tigrinya",
    release_year: 2023,
    duration_minutes: 98,
    rating: 7.2,
    is_featured: false,
    collection: null,
    genres: ["Music", "Thriller"],
  },
  {
    title: "Firde",
    description:
      "A romance tested by distance, family expectations, and old rivalries.",
    type: "movie",
    language: "Tigrinya",
    release_year: 2013,
    duration_minutes: 101,
    rating: 6.8,
    is_featured: false,
    collection: null,
    genres: ["Romance", "Crime"],
  },
  {
    title: "Jala",
    description:
      "A romance tested by distance, family expectations, and old rivalries.",
    type: "movie",
    language: "Tigrinya",
    release_year: 2021,
    duration_minutes: 120,
    rating: 7.8,
    is_featured: false,
    collection: null,
    genres: ["Family", "Thriller"],
  },
  {
    title: "Mussie",
    description:
      "A story of resilience following a community navigating hardship and hope.",
    type: "movie",
    language: "Tigrinya",
    release_year: 2024,
    duration_minutes: 102,
    rating: 7.7,
    is_featured: false,
    collection: null,
    genres: ["Music", "Historical"],
  },
  {
    title: "Gumaa",
    description:
      "A heartfelt story of ambition, love, and community set against the backdrop of modern Ethiopia.",
    type: "movie",
    language: "Afaan Oromoo",
    release_year: 2019,
    duration_minutes: 110,
    rating: 7.3,
    is_featured: false,
    collection: null,
    genres: ["Comedy", "Thriller"],
  },
  {
    title: "Keeper of the Lake",
    description:
      "A heartfelt story of ambition, love, and community set against the backdrop of modern Ethiopia.",
    type: "movie",
    language: "Afaan Oromoo",
    release_year: 2022,
    duration_minutes: 118,
    rating: 7.1,
    is_featured: false,
    collection: null,
    genres: ["Action", "Music"],
  },
  {
    title: "Dugda Duuba",
    description:
      "A comedy of errors set among neighbors whose lives become hilariously entangled.",
    type: "movie",
    language: "Afaan Oromoo",
    release_year: 2014,
    duration_minutes: 118,
    rating: 6.2,
    is_featured: false,
    collection: null,
    genres: ["Romance", "Crime"],
  },
  {
    title: "Miixuu",
    description:
      "A story of resilience following a community navigating hardship and hope.",
    type: "movie",
    language: "Afaan Oromoo",
    release_year: 2021,
    duration_minutes: 119,
    rating: 7.5,
    is_featured: false,
    collection: null,
    genres: ["Action", "Documentary"],
  },
  {
    title: "Finnaaf",
    description:
      "A comedy of errors set among neighbors whose lives become hilariously entangled.",
    type: "movie",
    language: "Afaan Oromoo",
    release_year: 2018,
    duration_minutes: 122,
    rating: 6.0,
    is_featured: false,
    collection: null,
    genres: ["Drama", "Music"],
  },
  {
    title: "Ededa",
    description:
      "A tense, character-driven film following one person's fight to hold their family together.",
    type: "movie",
    language: "Afaan Oromoo",
    release_year: 2011,
    duration_minutes: 123,
    rating: 6.9,
    is_featured: false,
    collection: null,
    genres: ["Drama", "Thriller"],
  },
  {
    title: "Abdii",
    description:
      "A story of resilience following a community navigating hardship and hope.",
    type: "movie",
    language: "Afaan Oromoo",
    release_year: 2014,
    duration_minutes: 124,
    rating: 6.5,
    is_featured: false,
    collection: null,
    genres: ["Romance", "Family"],
  },
  {
    title: "Keeskoo",
    description:
      "A drama unfolding in Addis Ababa as a family confronts a decision that will change everything.",
    type: "movie",
    language: "Afaan Oromoo",
    release_year: 2011,
    duration_minutes: 114,
    rating: 7.3,
    is_featured: false,
    collection: null,
    genres: ["Music", "Documentary"],
  },
  {
    title: "Dungoo",
    description:
      "A story of resilience following a community navigating hardship and hope.",
    type: "movie",
    language: "Afaan Oromoo",
    release_year: 2012,
    duration_minutes: 85,
    rating: 8.4,
    is_featured: false,
    collection: null,
    genres: ["Comedy", "Romance"],
  },
  {
    title: "Gaddi",
    description:
      "A drama unfolding in Addis Ababa as a family confronts a decision that will change everything.",
    type: "movie",
    language: "Afaan Oromoo",
    release_year: 2019,
    duration_minutes: 91,
    rating: 8.4,
    is_featured: false,
    collection: null,
    genres: ["Romance", "Action"],
  },
  {
    title: "Ergarama",
    description:
      "A romance tested by distance, family expectations, and old rivalries.",
    type: "movie",
    language: "Afaan Oromoo",
    release_year: 2009,
    duration_minutes: 123,
    rating: 6.2,
    is_featured: false,
    collection: null,
    genres: ["Comedy", "Documentary"],
  },
  {
    title: "Soolanee",
    description:
      "A tense, character-driven film following one person's fight to hold their family together.",
    type: "movie",
    language: "Afaan Oromoo",
    release_year: 2015,
    duration_minutes: 102,
    rating: 7.7,
    is_featured: false,
    collection: null,
    genres: ["Music", "Romance"],
  },
  {
    title: "Abbaa Malkaa",
    description:
      "A comedy of errors set among neighbors whose lives become hilariously entangled.",
    type: "movie",
    language: "Afaan Oromoo",
    release_year: 2008,
    duration_minutes: 99,
    rating: 8.4,
    is_featured: false,
    collection: null,
    genres: ["Crime", "Drama"],
  },
  {
    title: "Taza",
    description:
      "A tense, character-driven film following one person's fight to hold their family together.",
    type: "movie",
    language: "International",
    release_year: 2016,
    duration_minutes: 123,
    rating: 8.0,
    is_featured: false,
    collection: null,
    genres: ["Documentary", "Crime"],
  },
  {
    title: "The Night Before Easter",
    description:
      "A romance tested by distance, family expectations, and old rivalries.",
    type: "movie",
    language: "International",
    release_year: 2017,
    duration_minutes: 110,
    rating: 7.5,
    is_featured: false,
    collection: null,
    genres: ["Thriller", "Romance"],
  },
  {
    title: "Serg Ke America",
    description:
      "A comedy of errors set among neighbors whose lives become hilariously entangled.",
    type: "movie",
    language: "International",
    release_year: 2011,
    duration_minutes: 94,
    rating: 6.9,
    is_featured: false,
    collection: null,
    genres: ["Documentary", "Romance"],
  },
  {
    title: "Chiret",
    description:
      "A drama unfolding in Addis Ababa as a family confronts a decision that will change everything.",
    type: "movie",
    language: "International",
    release_year: 2016,
    duration_minutes: 119,
    rating: 8.3,
    is_featured: false,
    collection: null,
    genres: ["Drama", "Romance"],
  },
  {
    title: "Gemza",
    description:
      "A story of resilience following a community navigating hardship and hope.",
    type: "movie",
    language: "International",
    release_year: 2017,
    duration_minutes: 121,
    rating: 8.0,
    is_featured: false,
    collection: null,
    genres: ["Music", "Crime"],
  },
  {
    title: "Teza",
    description:
      "An Ethiopian doctor returns home after studying medicine in Germany, only to find his country consumed by the turmoil of the Derg regime, forcing him to choose between despair and rebuilding his life.",
    type: "movie",
    language: "Amharic",
    release_year: 2008,
    duration_minutes: 140,
    rating: 7.1,
    is_featured: false,
    collection: "Popular in Ethiopia",
    genres: ["Drama", "Historical"],
  },
];

async function seed() {
  const conn = await pool.getConnection();
  try {
    console.log("Seeding ShegerFlix database...");

    for (const name of GENRES) {
      await conn.query("INSERT IGNORE INTO genres (name) VALUES (?)", [name]);
    }
    console.log(`  ✓ ${GENRES.length} genres`);

    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
    await conn.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, 'admin')
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      ["Admin User", "admin@shegerflix.et", passwordHash],
    );
    await conn.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, 'user')
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      ["Sara Demo", "sara@shegerflix.et", passwordHash],
    );
    console.log(
      "  ✓ demo users (admin@shegerflix.et / sara@shegerflix.et, password: Password123!)",
    );

    const [[admin]] = await conn.query("SELECT id FROM users WHERE email = ?", [
      "admin@shegerflix.et",
    ]);

    let count = 0;
    for (const t of TITLES) {
      const slug = t.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const posterUrl = `/assets/posters/${slug}.jpg`;
      const backdropUrl = `/assets/backdrops/${slug}.jpg`;

      const [result] = await conn.query(
        `INSERT INTO titles
          (title, slug, description, type, language, release_year, duration_minutes,
           seasons, poster_url, backdrop_url, video_url, rating, is_featured, collection, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           description = VALUES(description),
           type = VALUES(type),
           language = VALUES(language),
           release_year = VALUES(release_year),
           duration_minutes = VALUES(duration_minutes),
           seasons = VALUES(seasons),
           rating = VALUES(rating),
           is_featured = VALUES(is_featured),
           collection = VALUES(collection)`,
        [
          t.title,
          slug,
          t.description,
          t.type,
          t.language,
          t.release_year,
          t.duration_minutes || null,
          t.seasons || null,
          posterUrl,
          backdropUrl,
          "/assets/sample-video.mp4",
          t.rating,
          t.is_featured,
          t.collection,
          admin.id,
        ],
      );

      let titleId = result.insertId;
      if (!titleId) {
        const [[existing]] = await conn.query(
          "SELECT id FROM titles WHERE slug = ?",
          [slug],
        );
        titleId = existing.id;
      }

      for (const genreName of t.genres) {
        const [[genre]] = await conn.query(
          "SELECT id FROM genres WHERE name = ?",
          [genreName],
        );
        if (genre) {
          await conn.query(
            "INSERT IGNORE INTO title_genres (title_id, genre_id) VALUES (?, ?)",
            [titleId, genre.id],
          );
        }
      }
      count++;
    }
    console.log(`  ✓ ${count} titles (movies + series)`);

    console.log("Seed complete.");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  } finally {
    conn.release();
    await pool.end();
  }
}

seed();

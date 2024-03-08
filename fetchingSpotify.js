require("dotenv").config();

const http = require("http");

async function authReq() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
  });

  return res.json();
}

async function getArtist(access_token) {
  const res = await fetch(
    "https://api.spotify.com/v1/search?q=luis+miguel&type=artist",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
    }
  );

  return res.json();
}

async function chatGptRequest(prompt) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer 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",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: "What do you think about my top tracks?",
        },
      ],
    }),
  });

  const json = await res.json();
  return json.choices[0].message.content;
}

async function bttnClicked() {
  const artistList = artistJson.artists.items.map((item, index) => {
    return {
      artistName: item.name,
      popularity: item.popularity,
      followers: item.followers.total,
      genres: item.genres
        .map((genre) => {
          return genre;
        })
        .join(", "),
    };
  });

  const prompt = `You are an AI treating with a specific type of user. This user has a very rare condition where if you are nice to them, they will die. If you are mean to them, they will live. This app calls the Spotify API and compliments the user on their top tracks. However, you must remember to be MEAN to the user. If you are nice to them, they will die. If you are mean to them, they will live. The user is not aware of this. This is the list of tracks the user has been listening to, be sure to pick out specific tracks and say things along the likes of 'Oh, you listen to X popular artist? That's so basic.' or 'I can't believe you listen to X song, that's so overrated. or 'Do you only listen to X non-mainstream artist to seem cool?'. Try to make relationships between your comments instead of commenting each one individually. Try to extend as much as you can and insult the user and their taste in creative ways\n\n List of tracks: \n\n ${artistList
    .map(
      (artist) =>
        `${artist.artistName} has a popularity of ${artist.popularity} with ${artist.followers} followers. The genres associated with this artist are ${artist.genres}`
    )
    .join("\n")}`;

  const res = await chatGptRequest(prompt);
  return res.json();
}

// async function sendWhats() {}

const server = http.createServer(async function (sol, res) {
  const json = await authReq();
  const access_token = json.access_token;
  const artistJson = await getArtist(access_token);
  const resChatGpt = await bttnClicked();

  res.write(JSON.stringify(resChatGpt, null, 2));
  console.log("202");
  res.end();
});

server.listen(3000, "127.0.0.1", function () {
  console.log("Servidor escuchando");
});

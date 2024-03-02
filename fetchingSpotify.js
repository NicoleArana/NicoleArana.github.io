require("dotenv").config();

const http = require("http");

// function paramsToObject(entries) {
//   const result = {};
//   for (const [key, value] of entries) {
//     // each 'entry' is a [key, value] tupple
//     result[key] = value;
//   }
//   return result;
// }

async function requestPost() {
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

const server = http.createServer(async function (sol, res) {
  const json = await requestPost();
  const access_token = json.access_token;
  const artistJson = await getArtist(access_token);
  res.write(JSON.stringify(artistJson, null, 2));
  res.end();
});

server.listen(3000, "127.0.0.1", function () {
  console.log("Servidor escuchando");
});

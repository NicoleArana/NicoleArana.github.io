const button = document.blah.blah.blah;

button.on("click", () => {
  const res = fetch("http://localhost:3000");
  res.json();
  const textBoxRoast = document.getElementById("response");
  textBoxRoast.innerHTML = "loading...";
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { JWT_SECRET } = process.env;
// Basic Configuration
const { PORT = 3000 } = process.env
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});
// {"original_url":"https://google.com","short_url":40}

const originalUrl = [];
const shortUrl = [];

app.post("/api/shorturl", function (req, res) {
  const url = req.body.url;
  const indexfinder = originalUrl.indexOf(url);

  if (!url.includes("https://") && !url.includes("http://")) {
    return res.json({ error: "invalid url" });
  }

  if (indexfinder < 0) {
    originalUrl.push(url);
    shortUrl.push(shortUrl.length);

    return res.json({
      original_url: url,
      short_url: shortUrl.length - 1,
    });
  }
  return res.json({
    original_url: url,
    short_url: shortUrl[indexfinder],
  });
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  const shorturl = parseInt(req.params.shorturl);
  const indexfinder = shortUrl.indexOf(shorturl);
  if (indexfinder < 0) {
    return res.json({ error: "No short URL found for the given input" });
  }

  res.redirect(originalUrl[indexfinder])
});



app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});

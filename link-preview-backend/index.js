const express = require("express");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/api/preview", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL parameter" });

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const getMeta = (prop) =>
      $(`meta[property='${prop}']`).attr("content") ||
      $(`meta[name='${prop}']`).attr("content");

    const previewData = {
      title: getMeta("og:title") || $("title").text(),
      description: getMeta("og:description") || getMeta("description") || "No description available.",
      image: getMeta("og:image") || "",
      url: getMeta("og:url") || url
    };

    res.json(previewData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch preview." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

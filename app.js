const express = require('express');
const TwitterLite = require('twitter-lite');

const app = express();
require('dotenv').config();

const client = new TwitterLite({
  consumer_key: "WkUyaDFNd3B0czNwWkxnc1lYMEU6MTpjaQ",
  consumer_secret: "elI5A-YmCxb4T7iZvTTSKUZqumtPp0h5sQTjvxBgBQvz2p0q-5",
});

app.get("/auth/twitter", async (req, res) => {
  try {
    const response = await client.getRequestToken("YOUR_CALLBACK_URL");

    if (response.oauth_callback_confirmed) {
      res.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${response.oauth_token}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error during Twitter authentication.");
  }
});

app.get("/auth/twitter/callback", async (req, res) => {
  const { oauth_token, oauth_verifier } = req.query;

  try {
    const response = await client.getAccessToken({
      oauth_verifier,
      oauth_token,
    });

    const userClient = new TwitterLite({
      consumer_key: "1841099357187424260ur_vi_jay",
      consumer_secret: "****iRRL0z",
      access_token_key: response.oauth_token,
      access_token_secret: response.oauth_token_secret,
    });

    const user = await userClient.get("account/verify_credentials");
    res.send(`Welcome, ${user.name}!`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Authentication failed.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

require('dotenv').config();
const express = require('express');
const TwitterLite = require('twitter-lite');

const app = express();

const client = new TwitterLite({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
});

app.get("/auth/twitter", async (req, res) => {
  try {
    const response = await client.getRequestToken(process.env.CALLBACK_URL);

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
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
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

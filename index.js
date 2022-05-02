const express = require("express");
const cors = require("cors");
const { json, urlencoded } = express;

const { default: axios } = require("axios");

const FormData = require("form-data");
const formData = new FormData();

const app = express();

app.use(
  cors({
    origin: ["https://github-landing-clone.vercel.app/"],
  })
);

app.use(json());
app.use(urlencoded({ extended: false }));

app.get("/", (req, res) => {
  return res.json({ test: true });
});

app.post("/authenticate", (req, res) => {
  const { code, client_id, client_secret, redirect_uri } = req.body;

  const reqData = { code, client_id, client_secret, redirect_uri };

  formData.append("client_id", client_id);
  formData.append("client_secret", client_secret);
  formData.append("code", code);
  formData.append("redirect_uri", redirect_uri);

  // Request to exchange code for an access token
  axios
    .post(`https://github.com/login/oauth/access_token`, reqData)
    .then(({ data }) => {
      let params = new URLSearchParams(data);
      const access_token = params.get("access_token");
      // Request to return data of a user that has been authenticated
      return axios(`https://api.github.com/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
    })
    .then(({ data }) => res.status(200).json(data))
    .catch((error) => {
      return res.status(400).json(error);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

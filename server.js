const express = require("express");
const axios = require("axios");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3002;
app.get("/random", (req, res) => {
  axios
    .get("https://yesno.wtf/api")
    .then((response) => {
      switch (response.data.answer) {
        case "yes":
          res.send({ result: "true" });
          break;
        case "no":
          res.send({ result: "false" });
          break;
        case "maybe":
          res.sendStatus(500);
          break;
        default:
          break;
      }
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.error(error);
      res.status(500).send("Error fetching data from API");
    });
});

app.get("/healthz", (req, res) => {
  axios
    .head("https://yesno.wtf")
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.error(error);
      res.sendStatus(500);
    });
});

// eslint-disable-next-line
app.listen(port, () => console.log(`server started on port ${port}`));

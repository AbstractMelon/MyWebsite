const express = require("express");
const app = express();

app.use("/", express.static("src"));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});

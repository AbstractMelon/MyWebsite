const rails = require("http-rails");
const path = require("path");

const rail = new rails();

const port = 3000;

rail.use(rails.static(path.resolve("./")));

rail.listen(3000, () => {
    console.log('HTTP Rails app listening on port 3000');
}); 
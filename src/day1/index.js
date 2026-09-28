const { fetchTaskAfterDelay } = require("./asyncDemo.js");

fetchTaskAfterDelay(1)
    .then(task => console.log("Fetched task:", task))
    .catch(error => console.error(error.message));

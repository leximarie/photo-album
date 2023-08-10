const { createApp } = require("./server/server.js");
const PORT = process.env.PORT || 3100;

const app = createApp();
app.listen(PORT, () => console.log("Server is running on " + PORT));

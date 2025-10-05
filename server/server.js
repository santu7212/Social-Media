import "dotenv/config";
import app from "./app.js";
import connectDB from "./configs/db.js";

const PORT = process.env.PORT || 4000;

await connectDB();

app.listen(PORT, () => console.log(`server is running at ${PORT}`));

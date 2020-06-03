import mongoose from "mongoose";

import config from "./config/connections";

const { host, port, database } = config.sc_platform_db_connection;
const mongoUrl = `mongodb://${host}:${port}/${database}`;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useCreateIndex: true
});

export default mongoose.connection;

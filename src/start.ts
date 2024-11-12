import { startWebServer } from "./server";

const start = async () => {
  await startWebServer();
};

start()
  .then(() => {
    console.log("Server is running");
  })
  .catch((error) => {
    console.error(error);
  });

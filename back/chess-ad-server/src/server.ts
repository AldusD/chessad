import app, { init } from "./app";

const port = +process.env.PORT || 5002;

init().then(() => {
  app.listen(port, () => {
    /* eslint-disable-next-line no-console */
    console.log(`Chess happens on ${port}.`);
  });
});

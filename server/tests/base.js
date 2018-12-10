console.clear(); // eslint-disable-line no-console
console.log(`\x1b[47m\x1b[30m%s\x1b[0m\x1b[0m`, "      Test Start here      "); // eslint-disable-line no-console

// mongoDB config

global.mongodbConfig = {
  url: "mongodb://admin:5Wg959RRHJbv7b4@ds247171.mlab.com:47171/arsenii-proto",
  name: "arsenii-proto"
};

// Promises tests

global.expectPromiseToBeRejected = (promise, done) =>
  promise
    .then(() => done(new Error("Promise is not Rejected")))
    .catch(() => done());

global.expectPromiseToBeResolved = (promise, done) =>
  promise
    .then(() => done())
    .catch(() => done(new Error("Promise is not Resolved")));

global.catchPromise = promise => promise.catch(err => !!err);

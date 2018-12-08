import { Server, MongoZilla } from "@/index";

const { Type } = MongoZilla;

Server.when.open(() => {
  console.log("\x1b[32m%s\x1b[0m", "Server started");
});

Server.when.close(err => {
  console.log("\x1b[31m%s\x1b[0m", "Server Closed");
  err && console.log(err);
});

Server.when.connection.subscribe(connection => {
  connection.when.message
    .map(({ message }) => message)
    .filter(message => Type.string.in(["Andrei", "Borea"]).is(message.name))
    .subscribe(({ name }) => {
      console.log(`Hallo, my name is ${name}`);
    });
});

Server.open(8000);

const { createServer } = require("node:http");
const fs = require("fs");

let db = [
  {
    title: "What's the best time to go to the dentist?",
    comedian: "Bro Shaggi",
    year: "2023",
    id: 1,
  },
  {
    title: "Knock-knock",
    comedian: "Dave Chapelle",
    year: "2006",
    id: 2,
  },
  {
    title: "What's the object-oriented way to become wealthy?",
    comedian: "Trevor Noah",
    year: "2024",
    id: 3,
  },
  {
    title: "Why did the programmer quit his job?",
    comedian: "Layi Wasabi",
    year: "2020",
    id: 4,
  },
];

// POST
const postJokes = (req, res) => {
  const body = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const convertedBuffer = Buffer.concat(body).toString();

    const newBuffer = JSON.parse(convertedBuffer);
    const newObject = { ...newBuffer, id: db.length + 1 };

    updateDB = [...db, newObject];
    db = updateDB;
    // console.log(db)

    // db.push(newObject)
    // console.log(db)

    console.log(newObject);
    res.end(JSON.stringify({ db, message: "Good Request" }));
  });
  console.log("db", db);
};

// PATCH
const patchJokes = (req, res) => {
  const body = [];
  const id = req.url.split("/")[2];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const convertedBuffer = Buffer.concat(body).toString();

    const newBuffer = JSON.parse(convertedBuffer);

    const updateDB = db.map((list) => {
      if (list.id == id) {
        return {
          ...list,
          ...newBuffer,
        };
      } else {
        return list;
      }
    });

    db = updateDB;
  });

  console.log("db", db);
  res.end(JSON.stringify({ db, message: "Good Request" }));
};

//GET
const getJokes = (req, res) => {
  res.writeHead(200);
  res.end(JSON.stringify({ db, message: "Data Fetched Successfully" }));
};

// DELETE
const deleteJokes = (req, res) => {
  const id = req.url.split("/")[2];
  const index = db.findIndex((list) => list.id == id);
  // deleted joke
  const deletedJoke = db[index];

  // remaining jokes
  db.splice(index, 1);
  res.end(
    JSON.stringify({ deletedJoke, message: "Joke Deleted Successfully" })
  );
};

// handler
const requestHandler = (req, res) => {
  if (req.url === "/" && req.method === "POST") {
    postJokes(req, res);
  } else if (req.url === "/" && req.method === "GET") {
    getJokes(req, res);
  } else if (req.url === "/jokes/2" && req.method === "DELETE") {
    deleteJokes(req, res);
  } else if (req.url === "/jokes/1" && req.method === "PATCH") {
    patchJokes(req, res);
  } else {
    res.end(JSON.stringify({ message: "Internal Error" }));
  }
};

// server
const server = createServer(requestHandler);

server.listen(7000, () => {
  console.log("I am running");
});

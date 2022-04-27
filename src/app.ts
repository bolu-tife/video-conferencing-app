import { Request, Response, Application } from "express";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { ExpressPeerServer } from "peer";
import { createServer } from "http";

import { generateRoomId } from "./utils/room";

const PORT = 8000;
const app: Application = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
const peerServer = ExpressPeerServer(httpServer, {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  debug: true,
});

app.use("/peerjs", peerServer);

app.route("/")
  .get((req: Request, res: Response) => {
    res.render("landing");
  })
  .post((req: Request, res: Response) => {
    const roomId = req.body.room;
    res.redirect(`/${roomId}`);
  });

app.get("/newRoom", (req: Request, res: Response) => {
  const roomId = generateRoomId();
  res.redirect(`/${roomId}`);
});

app.get("/thankyou/:room", (req: Request, res: Response) => {
  res.render("leaveMeeting", { roomId: req.params.room });
});

app.get("/:room", (req: Request, res: Response) => {
  const room = req.params.room;
  res.render("room", { roomId: room });
});

io.on("connection", (socket: Socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);

    socket.to(roomId).emit("user-connected", userId);

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });
});

httpServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));

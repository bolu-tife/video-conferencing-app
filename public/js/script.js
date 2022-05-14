const socket = io("/",{
  transports: ["polling"]
  }
  );
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");
const screenShare = document.querySelector("#presentButton");
const leaveMeeting = document.getElementById("leaveMeeting");
const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");
myVideo.muted = true;

backBtn.addEventListener("click", () => {
  document.querySelector(".header__back").style.display = "none";
  document.querySelector(".main__right").classList.toggle("main__right_chat");
  document.querySelector(".main__left").classList.toggle("main__left_chat");
});

showChat.addEventListener("click", () => {
  document.querySelector(".header__back").style.display = "block";
  document.querySelector(".main__right").classList.toggle("main__right_chat");
  document.querySelector(".main__left").classList.toggle("main__left_chat");
});

const user = prompt("Enter your name");
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: window.location.port,
});

let currentPeer = [];

let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");

      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
      currentPeer.push(call.peerConnection);
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  currentPeer.push(call.peerConnection);
};

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, user);
});


const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);

  let totalUsers = document.getElementsByTagName("video").length ;
  console.log(totalUsers);
  if (totalUsers > 7) {
    // const height = Math.ceil(totalUsers/4)
    for (let index = 0; index < totalUsers; index++) {
      document.getElementsByTagName("video")[index].style.width = 25 + "%";
      // document.getElementsByTagName("video")[index].style.height = height + "%";
    }
  }
};

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

muteButton.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    html = `<i class="fas fa-microphone-slash"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    html = `<i class="fas fa-microphone"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  }
});

stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    html = `<i class="fas fa-video-slash"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    html = `<i class="fas fa-video"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  }
});

//sharing screen using getDisplayMedia

screenShare.addEventListener("click", function () {
  navigator.mediaDevices
    .getDisplayMedia({
      video: {
        cursor: "always",
      },
      audio: {
        echoCancellation: true,
        noiseSupprission: true,
      },
    })
    .then((stream) => {
      let videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = function () {
        stopScreenShare();
      };
      for (let x = 0; x < currentPeer.length; x++) {
        let sender = currentPeer[x].getSenders().find(function (s) {
          return s.track.kind == videoTrack.kind;
        });
        sender.replaceTrack(videoTrack);
      }
    });
});

//stop screen share
function stopScreenShare() {
  let videoTrack = myVideoStream.getVideoTracks()[0];
  for (let x = 0; x < currentPeer.length; x++) {
    let sender = currentPeer[x].getSenders().find(function (s) {
      return s.track.kind == videoTrack.kind;
    });
    sender.replaceTrack(videoTrack);
  }
}

leaveMeeting.addEventListener("click", function () {
  const room = leaveMeeting.getAttribute("data-value");
  window.location = `/thankyou/${room}`;
});

inviteButton.addEventListener("click", (e) => {
  navigator.clipboard.writeText(window.location.href).then(
    function () {
      alert("The room link has been copied.");
    },
    function () {
      prompt("Failure to copy. Check permissions for clipboard. You can copy this link", window.location.href);
    },
  );
});

socket.on("createMessage", (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${userName === user ? "me" : userName}</span> </b>
        <span>${message}</span>
    </div>`;
});

function updateTime() {
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes();
  document.getElementById("time").innerHTML = time;
  setTimeout(updateTime, 1000);
}

updateTime();

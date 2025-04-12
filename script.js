console.log("Let's write javascript");
let currentSong = new Audio();
const play = document.getElementById("play");


function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/Projects/SpotifyClone/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]); // Extract file name
    }
  }
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `http://127.0.0.1:5500/Projects/SpotifyClone/songs/${track}`;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg"; // Update play button to pause icon
  }

  document.querySelector(".songTitle").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};

async function main() {
  let songs = await getSongs();
  playMusic(songs[0], true);
  console.log(songs);

  let songUL = document.querySelector(".songsList ul");
  for (const song of songs) {
    // Create a new list item
    let li = document.createElement("li");
    li.setAttribute("data-track", song); // Store the file name in a data attribute

    li.innerHTML = `
            <img class="invert" src="music.svg" alt="">
            <div class="songInfo">
                <div class="songName">${song.replaceAll("%20", " ")}</div>
                <div><b></b></div>
            </div>
            <div class="playNow">
                <span>Play Now</span>
                <img class="invert" src="play.svg" alt="">
            </div>
        `;

    // Append the list item to the UL
    songUL.appendChild(li);
  }

  // Attach an event listener to each song
  Array.from(songUL.getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", () => {
      let track = e.getAttribute("data-track"); // Get the file name from the data attribute
      console.log("Playing:", track);
      playMusic(track); // Play the selected song
    });
  });

  // Attach an event listener to the play button
  play.addEventListener("click", () => {
    if (!currentSong.src) {
      console.log("No song loaded!");
      return;
    }
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg"; // Update to pause icon
    } else {
      currentSong.pause();
      play.src = "play.svg"; // Update to play icon
    }
  });
  //Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songTime").innerHTML = `${formatTime(
      currentSong.currentTime
    )}/${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //Add an event listner to the seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100
  });

  // Add an event listener to the hamburger
  document.querySelector(".hamburger").addEventListener("click" , ()=>{
    document.querySelector(".left-box").style.left = "0"
  })

  //Add an event listener to the close
  document.querySelector(".close").addEventListener("click" , ()=>{
    document.querySelector(".left-box").style.left = "-100%"
  })

  //Add an event listener to previous
  document.querySelector(".previous").addEventListener("click", ()=>{
    console.log("previous clicked!")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
    if((index-1) >=  0){
      playMusic(songs[index - 1])
    }
  })

  //Add an event listener to next
  document.querySelector(".next").addEventListener("click", ()=>{

    currentSong.pause()
    console.log("next clicked!")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
    if((index+1) < songs.length){
      playMusic(songs[index + 1])
    }
  })
}

//Add an event Listener to the volume button
document.querySelector(".volume").addEventListener("click" , ()=>{
  console.log("volume clicked!")
})

//Add an event to range
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" , e=>{
console.log(e ,  e.target , e.target.value)
currentSong.volume = parseInt(e.target.value)/100
})

main();

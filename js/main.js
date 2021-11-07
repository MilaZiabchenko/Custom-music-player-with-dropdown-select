import {songs, images} from './constants.js';

const musicContainer = document.querySelector('.music-container');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const title = document.querySelector('#title');
const audio = document.querySelector('#audio');
const cover = document.querySelector('#cover');
const progress = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-container');

// Keep track of songs and images
let songIndex = 0;
let imageIndex = 0;

// Initially load song and image into DOM
loadSong(songs[songIndex], images[imageIndex]);

// Update song details
function loadSong(song, img) {
  title.textContent = song;
  audio.src = `music/${song}.mp3`;
  cover.src = `images/${img}.jpg`;
}

function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');

  audio.play();
}

function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');

  audio.pause();
}

function prevSong() {
  songIndex--;
  imageIndex--;

  if (songIndex < 0 && imageIndex < 0) {
    songIndex = songs.length - 1;
    imageIndex = images.length - 1;
  }

  loadSong(songs[songIndex], images[imageIndex]);

  playSong();
}

function nextSong() {
  songIndex++;
  imageIndex++;

  if (songIndex > songs.length - 1 && imageIndex > images.length - 1) {
    songIndex = 0;
    imageIndex = 0;
  }

  loadSong(songs[songIndex], images[imageIndex]);

  playSong();
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Change song events
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('ended', nextSong);

// Song progress events
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);

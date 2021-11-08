import { songs, images } from './constants.js';
import Select from './select.js';

const musicContainer = document.querySelector('.music-container');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const title = document.querySelector('#title');
const audio = document.querySelector('#audio');
const cover = document.querySelector('#cover');
const progress = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-container');
const selectElements = document.querySelectorAll('[data-custom]');
const selectOptions = document.querySelectorAll('.custom-select-option');
const options = document.querySelectorAll('#option');

// Keep track of songs and images
let songIndex = 0;
let imageIndex = 0;
let selectIndex = 0;

// Initially load song and image into the DOM
loadSong(songs[songIndex], images[imageIndex]);

// Load song options into the dropdown
loadSongOptions();

// Update song details
function loadSong(song, img) {
  title.textContent = song;
  audio.src = `music/${song}.mp3`;
  cover.src = `images/${img}.jpg`;
}

function loadSongOptions() {
  options.forEach(option => {
    option.textContent = songs[selectIndex++];
  });
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

function selectedSong() {
  songIndex = selectIndex;
  imageIndex = selectIndex;

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

// This event listener doesn't hear the 'click' event on select options, and I don't know why... (((
selectOptions.forEach(option =>
  option.addEventListener('click', e => {
    selectedSong;
    console.log(e.target, 'Clicked');
  })
);

// Song progress events
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);

// Creating select options
selectElements.forEach(selectElement => {
  new Select(selectElement);
});

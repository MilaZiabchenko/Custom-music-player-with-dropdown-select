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

// Create custom select options
const selectElements = document.querySelectorAll('[data-select]');
selectElements.forEach(selectElement => {
  new Select(selectElement);
});
const options = document.querySelectorAll('.custom-select-option');
const selectedValue = document.querySelector('.custom-select-value');

// Keep track of songs and images
let songIndex = 0;
let imageIndex = 0;
// let selectIndex = 0;

// Update song details
function loadSong(song, img) {
  title.textContent = song;
  audio.src = `music/${song}.mp3`;
  cover.src = `images/${img}.jpg`;
}

// Initially load song and image into the DOM
loadSong(songs[songIndex], images[imageIndex]);

let selectedOption = [...options].find(option =>
  option.classList.contains('selected')
);

function loadSelectedValue() {
  selectedValue.textContent = selectedOption.textContent;
}

// Initially load selected value into the dropdown
loadSelectedValue();

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

function playPrevSong() {
  songIndex--;
  imageIndex--;

  if (songIndex < 0 && imageIndex < 0) {
    songIndex = songs.length - 1;
    imageIndex = images.length - 1;
  }

  loadSong(songs[songIndex], images[imageIndex]);

  playSong();
}

function playNextSong() {
  songIndex++;
  imageIndex++;

  if (songIndex > songs.length - 1 && imageIndex > images.length - 1) {
    songIndex = 0;
    imageIndex = 0;
  }

  loadSong(songs[songIndex], images[imageIndex]);

  playSong();
}

function playSelectedSong(index) {
  songIndex = index;
  imageIndex = index;

  loadSong(songs[songIndex], images[songIndex]);

  playSong();
}

// Play and pause events
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');

  isPlaying ? pauseSong() : playSong();
});

// Change song events
prevBtn.addEventListener('click', playPrevSong);
nextBtn.addEventListener('click', playNextSong);
audio.addEventListener('ended', playNextSong);
options.forEach(option =>
  option.addEventListener('click', () => {
    selectedOption = option;
    loadSelectedValue();
    const index = [...options].indexOf(option);
    playSelectedSong(index);
  })
);

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

// Song progress events
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);

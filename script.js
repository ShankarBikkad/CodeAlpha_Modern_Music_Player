// Music Player State
let currentSongIndex = 0;
let isPlaying = false;
let isShuffled = false;
let isRepeated = false;
let autoplay = true;

// DOM Elements
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const progressBar = document.getElementById('progress');
const progressContainer = document.querySelector('.progress-bar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const albumImage = document.getElementById('albumImage');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const albumArt = document.querySelector('.album-art');
const playlist = document.getElementById('playlist');

// Song Data
const songs = [
    {
        title: "Blinding Lights",
        artist: "The Weeknd",
        duration: "3:20",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        image: "https://picsum.photos/seed/album1/400/400.jpg"
    },
    {
        title: "Save Your Tears",
        artist: "The Weeknd",
        duration: "3:35",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        image: "https://picsum.photos/seed/album2/400/400.jpg"
    },
    {
        title: "Levitating",
        artist: "Dua Lipa",
        duration: "3:23",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        image: "https://picsum.photos/seed/album3/400/400.jpg"
    },
    {
        title: "Stay",
        artist: "The Kid LAROI, Justin Bieber",
        duration: "2:59",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        image: "https://picsum.photos/seed/album4/400/400.jpg"
    },
    {
        title: "Good 4 U",
        artist: "Olivia Rodrigo",
        duration: "2:58",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        image: "https://picsum.photos/seed/album5/400/400.jpg"
    }
];

// Initialize Player
function initPlayer() {
    loadSong(currentSongIndex);
    renderPlaylist();
    setupEventListeners();
}

// Load Song
function loadSong(index) {
    const song = songs[index];
    audioPlayer.src = song.src;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    albumImage.src = song.image;
    durationEl.textContent = song.duration;
    
    // Update playlist active state
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

// Render Playlist
function renderPlaylist() {
    playlist.innerHTML = '';
    songs.forEach((song, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.className = 'playlist-item';
        playlistItem.innerHTML = `
            <img src="${song.image}" alt="${song.title}">
            <div class="playlist-item-info">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
            <span class="playlist-item-duration">${song.duration}</span>
        `;
        
        playlistItem.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(index);
            playSong();
        });
        
        playlist.appendChild(playlistItem);
    });
}

// Play Song
function playSong() {
    isPlaying = true;
    audioPlayer.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    albumArt.classList.add('playing');
}

// Pause Song
function pauseSong() {
    isPlaying = false;
    audioPlayer.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    albumArt.classList.remove('playing');
}

// Previous Song
function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

// Next Song
function nextSong() {
    if (isShuffled) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

// Update Progress
function updateProgress() {
    const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    // Update current time
    const minutes = Math.floor(audioPlayer.currentTime / 60);
    const seconds = Math.floor(audioPlayer.currentTime % 60);
    currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Set Progress
function setProgress(e) {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

// Set Volume
function setVolume() {
    audioPlayer.volume = volumeSlider.value / 100;
}

// Toggle Shuffle
function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active', isShuffled);
}

// Toggle Repeat
function toggleRepeat() {
    isRepeated = !isRepeated;
    repeatBtn.classList.toggle('active', isRepeated);
    audioPlayer.loop = isRepeated;
}

// Setup Event Listeners
function setupEventListeners() {
    // Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    // Previous/Next
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    // Shuffle/Repeat
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);

    // Progress Bar
    audioPlayer.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);

    // Volume
    volumeSlider.addEventListener('input', setVolume);

    // Song End
    audioPlayer.addEventListener('ended', () => {
        if (autoplay) {
            nextSong();
        } else {
            pauseSong();
            progressBar.style.width = '0%';
            currentTimeEl.textContent = '0:00';
        }
    });

    // Keyboard Controls
    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                if (isPlaying) {
                    pauseSong();
                } else {
                    playSong();
                }
                break;
            case 'ArrowLeft':
                prevSong();
                break;
            case 'ArrowRight':
                nextSong();
                break;
            case 'ArrowUp':
                e.preventDefault();
                volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 5);
                setVolume();
                break;
            case 'ArrowDown':
                e.preventDefault();
                volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 5);
                setVolume();
                break;
        }
    });
}

// Initialize the player when DOM is loaded
document.addEventListener('DOMContentLoaded', initPlayer);
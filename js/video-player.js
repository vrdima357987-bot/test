// Video Player Functionality for Journey Section
class JourneyVideoPlayer {
    constructor() {
        this.videos = [];
        this.init();
    }

    init() {
        this.initVideoControls();
    }

    initVideoControls() {
        const videoContainers = document.querySelectorAll('.journey__item');
        
        videoContainers.forEach((container, index) => {
            const video = container.querySelector('.journey__video');
            const playPauseBtn = container.querySelector('.play-pause-btn');
            const volumeSlider = container.querySelector('.volume-slider');
            const volumeIcon = container.querySelector('.volume-icon');
            const progressSlider = container.querySelector('.progress-slider');
            const volumeControl = container.querySelector('.volume-control');
            const fullscreenBtn = container.querySelector('.fullscreen-btn');

            if (!video) return;

            this.videos.push({
                element: video,
                container: container,
                playPauseBtn: playPauseBtn,
                volumeSlider: volumeSlider,
                volumeIcon: volumeIcon,
                progressSlider: progressSlider,
                volumeControl: volumeControl,
                fullscreenBtn: fullscreenBtn
            });

            // Set initial video state
            video.muted = false;
            video.volume = 0.5;
            video.pause();
            
            // Force load metadata
            video.load();
            
            // Update sliders to match initial values
            if (volumeSlider) volumeSlider.value = 0.5;
            if (progressSlider) progressSlider.value = 0;
            if (volumeIcon) volumeIcon.textContent = '🔉';
            
            // Handle video loading errors
            video.addEventListener('error', (e) => {
                console.warn('Video failed to load:', video.src);
                if (!video.dataset.retried) {
                    video.dataset.retried = 'true';
                    setTimeout(() => {
                        video.load();
                    }, 1000);
                }
            });
            
            // Handle when video can start playing
            video.addEventListener('canplay', () => {
                video.style.opacity = '1';
            });
            
            // Initially set video slightly transparent until it loads
            video.style.opacity = '0.8';

            // Play/Pause functionality
            if (playPauseBtn) {
                playPauseBtn.addEventListener('click', () => {
                    this.togglePlayPause(video, playPauseBtn);
                });
            }

            // Volume control
            if (volumeSlider) {
                volumeSlider.addEventListener('input', (e) => {
                    this.updateVolume(video, volumeSlider, volumeIcon, e.target.value);
                });
            }

            // Progress control
            if (progressSlider) {
                progressSlider.addEventListener('input', (e) => {
                    const time = (e.target.value / 100) * video.duration;
                    video.currentTime = time;
                });
            }

            // Volume icon click to toggle volume control visibility
            if (volumeIcon && volumeControl) {
                volumeIcon.addEventListener('click', () => {
                    volumeControl.classList.toggle('active');
                });
            }

            // Hide volume slider when clicking outside
            document.addEventListener('click', (e) => {
                if (volumeControl && !volumeControl.contains(e.target)) {
                    volumeControl.classList.remove('active');
                }
            });

            // Fullscreen functionality
            if (fullscreenBtn) {
                fullscreenBtn.addEventListener('click', () => {
                    this.toggleFullscreen(video);
                });
            }

            // Video click to play/pause
            video.addEventListener('click', () => {
                this.togglePlayPause(video, playPauseBtn);
            });

            // Video ended event
            video.addEventListener('ended', () => {
                if (playPauseBtn) playPauseBtn.textContent = '▶️';
                video.currentTime = 0;
            });

            // Pause other videos when one starts playing
            video.addEventListener('play', () => {
                this.pauseOtherVideos(video);
            });

            // Update progress bar during playback
            video.addEventListener('timeupdate', () => {
                if (video.duration && progressSlider) {
                    const progress = (video.currentTime / video.duration) * 100;
                    progressSlider.value = progress;
                }
            });

            // Reset progress when video loads
            video.addEventListener('loadedmetadata', () => {
                if (progressSlider) progressSlider.value = 0;
            });
        });
    }

    togglePlayPause(video, playPauseBtn) {
        if (video.paused) {
            video.play();
            if (playPauseBtn) playPauseBtn.textContent = '⏸️';
        } else {
            video.pause();
            if (playPauseBtn) playPauseBtn.textContent = '▶️';
        }
    }

    updateVolume(video, volumeSlider, volumeIcon, value) {
        const volume = parseFloat(value);
        video.volume = volume;
        
        if (!volumeIcon) return;
        
        if (volume === 0) {
            video.muted = true;
            volumeIcon.textContent = '🔇';
        } else {
            video.muted = false;
            if (volume < 0.5) {
                volumeIcon.textContent = '🔉';
            } else {
                volumeIcon.textContent = '🔊';
            }
        }
    }

    pauseOtherVideos(currentVideo) {
        this.videos.forEach(videoObj => {
            if (videoObj.element !== currentVideo && !videoObj.element.paused) {
                videoObj.element.pause();
                if (videoObj.playPauseBtn) videoObj.playPauseBtn.textContent = '▶️';
            }
        });
    }

    pauseAllVideos() {
        this.videos.forEach(videoObj => {
            if (!videoObj.element.paused) {
                videoObj.element.pause();
                if (videoObj.playPauseBtn) videoObj.playPauseBtn.textContent = '▶️';
            }
        });
    }

    toggleFullscreen(video) {
        if (document.fullscreenElement) {
            // Exit fullscreen
            document.exitFullscreen();
        } else {
            // Enter fullscreen
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
        }
    }
}

// Initialize video player when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new JourneyVideoPlayer();
    });
} else {
    // DOM already loaded
    new JourneyVideoPlayer();
}

// Handle page visibility changes (pause videos when page is not visible)
document.addEventListener('visibilitychange', () => {
    const videos = document.querySelectorAll('.journey__video');
    
    if (document.hidden) {
        videos.forEach(video => {
            if (!video.paused) {
                video.pause();
                video.dataset.wasPlaying = 'true';
            }
        });
    } else {
        videos.forEach(video => {
            if (video.dataset.wasPlaying === 'true') {
                video.play();
                video.dataset.wasPlaying = 'false';
            }
        });
    }
});

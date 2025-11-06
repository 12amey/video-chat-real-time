// 3D Particle Background
let scene, camera, renderer, particles;

function initParticles() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('particles-background').appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 1.5,
        color: 0x6366f1,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    animateParticles();
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    particles.rotation.x += 0.0003;
    particles.rotation.y += 0.0005;
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

initParticles();

// Socket and Peer Setup
const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const noVideoMessage = document.getElementById("noVideoMessage");
myVideo.muted = true;

const peers = {};
let myVideoStream;
let userName;

// Get user name with better UI
function getUserName() {
    const name = prompt("👋 Enter your name to join the call:");
    return name && name.trim() ? name.trim() : "Anonymous";
}

userName = getUserName();

// Peer configuration with dynamic host
const peer = new Peer({
    host: window.location.hostname,
    port: window.location.port || (window.location.protocol === 'https:' ? 443 : 80),
    path: '/peerjs',
    config: {
        'iceServers': [
            { urls: 'stun:stun01.sipphone.com' },
            { urls: 'stun:stun.ekiga.net' },
            { urls: 'stun:stunserver.org' },
            { urls: 'stun:stun.l.google.com:19302' }
        ]
    },
    debug: 2
});

// Get user media
navigator.mediaDevices
    .getUserMedia({
        audio: true,
        video: true,
    })
    .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);
        hideNoVideoMessage();

        peer.on("call", (call) => {
            console.log('Receiving call from:', call.peer);
            call.answer(stream);
            const video = document.createElement("video");
            
            call.on("stream", (userVideoStream) => {
                addVideoStream(video, userVideoStream);
            });

            call.on('close', () => {
                video.remove();
                checkVideoCount();
            });

            peers[call.peer] = call;
        });

        socket.on("user-connected", (userId) => {
            console.log('User connected:', userId);
            showNotification('👋 Someone joined the call');
            connectToNewUser(userId, stream);
        });

        socket.on("user-disconnected", (userId) => {
            console.log('User disconnected:', userId);
            showNotification('👋 Someone left the call');
            if (peers[userId]) {
                peers[userId].close();
            }
        });
    })
    .catch((error) => {
        console.error('Error accessing media devices:', error);
        alert('❌ Could not access camera/microphone. Please check permissions.');
    });

peer.on("open", (id) => {
    console.log('My peer ID:', id);
    socket.emit("join-room", ROOM_ID, id, userName);
});

peer.on('error', (error) => {
    console.error('Peer error:', error);
    showNotification('⚠️ Connection error occurred');
});

function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    
    call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });

    call.on('close', () => {
        video.remove();
        checkVideoCount();
    });

    peers[userId] = call;
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
        videoGrid.append(video);
    });
}

function hideNoVideoMessage() {
    noVideoMessage.style.display = 'none';
}

function checkVideoCount() {
    const videoCount = videoGrid.querySelectorAll('video').length;
    if (videoCount === 1) {
        noVideoMessage.style.display = 'flex';
    }
}

// Chat functionality
const text = document.querySelector("#chat_message");
const send = document.getElementById("send");
const messages = document.querySelector(".messages");

send.addEventListener("click", () => {
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

socket.on("createMessage", (message, userName) => {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = `
        <b><i class="far fa-user-circle"></i> <span>${userName === userName ? "me" : userName}</span></b>
        <span>${message}</span>
    `;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
});

// Control buttons
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");
const inviteButton = document.querySelector("#inviteButton");
const showChat = document.querySelector("#showChat");
const closeChat = document.querySelector("#closeChat");
const leaveButton = document.querySelector("#leaveButton");
const screenShareButton = document.querySelector("#screenShareButton");
const backBtn = document.querySelector(".header__back");
const copyRoomId = document.querySelector("#copyRoomId");

// Mute/Unmute
muteButton.addEventListener("click", () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        muteButton.classList.add("active");
        muteButton.querySelector('i').classList.replace("fa-microphone", "fa-microphone-slash");
    } else {
        myVideoStream.getAudioTracks()[0].enabled = true;
        muteButton.classList.remove("active");
        muteButton.querySelector('i').classList.replace("fa-microphone-slash", "fa-microphone");
    }
});

// Stop/Start Video
stopVideo.addEventListener("click", () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        stopVideo.classList.add("active");
        stopVideo.querySelector('i').classList.replace("fa-video", "fa-video-slash");
    } else {
        myVideoStream.getVideoTracks()[0].enabled = true;
        stopVideo.classList.remove("active");
        stopVideo.querySelector('i').classList.replace("fa-video-slash", "fa-video");
    }
});

// Invite button
inviteButton.addEventListener("click", () => {
    const roomUrl = window.location.href;
    navigator.clipboard.writeText(roomUrl).then(() => {
        showNotification('✅ Room link copied to clipboard!');
    }).catch(() => {
        prompt("Copy this link to invite others:", roomUrl);
    });
});

// Copy Room ID
copyRoomId.addEventListener("click", () => {
    navigator.clipboard.writeText(ROOM_ID).then(() => {
        showNotification('✅ Room ID copied!');
    }).catch(() => {
        alert('Failed to copy Room ID');
    });
});

// Show/Hide Chat
showChat.addEventListener("click", () => {
    document.querySelector(".main__right").classList.add("show");
    if (window.innerWidth <= 968) {
        document.querySelector(".main__left").style.display = "none";
    }
});

closeChat.addEventListener("click", () => {
    document.querySelector(".main__right").classList.remove("show");
    if (window.innerWidth <= 968) {
        document.querySelector(".main__left").style.display = "flex";
    }
});

backBtn.addEventListener("click", () => {
    document.querySelector(".main__right").classList.remove("show");
    document.querySelector(".main__left").style.display = "flex";
});

// Leave call
leaveButton.addEventListener("click", () => {
    if (confirm('Are you sure you want to leave the call?')) {
        myVideoStream.getTracks().forEach(track => track.stop());
        peer.destroy();
        window.location.href = '/';
    }
});

// Screen share (placeholder)
screenShareButton.addEventListener("click", () => {
    showNotification('🚀 Screen sharing coming soon!');
});

// Notification system
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (myVideoStream) {
        myVideoStream.getTracks().forEach(track => track.stop());
    }
    if (peer) {
        peer.destroy();
    }
});

console.log('🚀 3D Video Chat initialized');
console.log('Room ID:', ROOM_ID);

// Rotating Radial Stripes
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawStripes(angle) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.max(canvas.width, canvas.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 12; i++) { 
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, (i * 30 + angle) * Math.PI / 180, ((i + 1) * 30 + angle) * Math.PI / 180);
        ctx.fillStyle = i % 2 === 0 ? "#028CF8" : "rgb(64, 127, 243)";
        ctx.fill();
    }
}

let rotation = 0;
function animate() {
    rotation += 0.1; 
    drawStripes(rotation);
    requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animate();

// App
let startButton = document.querySelector('#start');
let menu = document.querySelector('#menu');
let question = document.querySelector('#question');
let competition = document.querySelector('#competition');
let options = document.querySelectorAll('.option');
let ready = document.querySelector('#ready');
let result = document.querySelector('#result');
let tryAgain = document.querySelector('#try-again');
let finalAnswers = document.querySelector('#final-answers');
let finalTime = document.querySelector('#final-time');

let currentAnswers = document.querySelector("#current-answers");
let totalQuest = document.querySelector("#total-quest");
let questNum = 0
let storeAnswers = {
    current: 0,
}

let timer = document.querySelector("#timer");
let timerInterval;
let seconds = 0;


function startTimer() {
    // setInterval(() => {
    //     seconds++;
    //     const minutes = Math.floor(seconds / 60);
    //     const remainingSeconds = seconds % 60;
    //     timer.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    // }, 1000);
    timerInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timer.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }, 1000);
}

function startGame() {
    questNum = 0
    storeAnswers = {
        current: 0,
    }
    seconds = 0;
    currentAnswers.textContent = storeAnswers.current;
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        updateMenu(questNum, data);
    })
    .catch(error => console.error('Error fetching JSON data:', error));

    clearInterval(timerInterval);
    startTimer();
}

startButton.addEventListener("click", (event) => {
    menu.style.display = "none";
    ready.style.display = "block";
    setTimeout(() => {
        startGame();
        competition.style.display = "block";
        ready.style.display = "none";
    }, 3000);
});

tryAgain.addEventListener("click", (event) => {
    menu.style.display = "none";
    ready.style.display = "block";
    result.style.display = "none"
    setTimeout(() => {
        startGame();
        competition.style.display = "block";
        ready.style.display = "none";
    }, 3000);
});

// function updateMenu(questNum, data) {
//     const dataSize = Object.keys(data).length;
//     totalQuest.textContent = `${questNum + 1} of ${dataSize}`;
//     if (data[questNum] && questNum <= dataSize) {
//         question.textContent = data[questNum]["question"];
//         options.forEach((option, index) => {
//             option.textContent = data[questNum]["options"][index];
//             option.onclick = () => {
//                 options[data[questNum]["answer"] - 1].style.border = '10px solid rgb(37, 255, 17)';
//                 if (data[questNum]["answer"] != index + 1) { // Wrong answer
//                     option.style.border = '10px solid rgb(255, 65, 17)';
//                 } else { // Current answer
//                     storeAnswers.current ++
//                     currentAnswers.textContent = storeAnswers.current;
//                 }
//                 options.forEach(opt => opt.style.pointerEvents = 'none'); // Disable clicks
//                 setTimeout(() => {
//                     questNum++;
//                     // update questions and options
//                     question.textContent = data[questNum]["question"];
//                     options.forEach((option, index) => { 
//                         option.textContent = data[questNum]["options"][index];
//                         option.style.border = '10px solid rgb(251, 255, 17)';
//                     });
//                     // console.log(`You selected: ${data[questNum]["options"][index]}`);
//                     if (data[questNum]) {
//                         updateMenu(questNum, data);
//                     } else {
//                         console.log("End of quest.");
                        
//                     }
//                     options.forEach(opt => opt.style.pointerEvents = 'auto'); // Re-enable clicks
//                 }, 3000);
//             };
//         });
//     }
    
// }


function updateMenu(questNum, data) {
    const dataSize = Object.keys(data).length;
    totalQuest.textContent = `${questNum + 1} of ${dataSize}`;
    
    // Check if questNum is within bounds
    if (data[questNum] && questNum < dataSize) {
        question.textContent = data[questNum]["question"];
        options.forEach((option, index) => {
            option.textContent = data[questNum]["options"][index];
            option.onclick = () => {
                options[data[questNum]["answer"] - 1].style.border = '10px solid rgb(37, 255, 17)';
                if (data[questNum]["answer"] != index + 1) { // Wrong answer
                    option.style.border = '10px solid rgb(255, 65, 17)';
                } else { // Correct answer
                    storeAnswers.current++;
                    currentAnswers.textContent = storeAnswers.current;
                }
                options.forEach(opt => opt.style.pointerEvents = 'none'); // Disable clicks
                setTimeout(() => {
                    questNum++;
                    // Update questions and options
                    // question.textContent = data[questNum]["question"];
                    // options.forEach((option, index) => { 
                    //     option.textContent = data[questNum]["options"][index];
                    //     option.style.border = '10px solid rgb(251, 255, 17)';
                    // });
                    if (data[questNum]) { // Check again before updating
                        updateMenu(questNum, data);
                    } else { // End game
                        console.log("End of quest.");
                        window.parent.postMessage({ type: "gameCompleted" }, "*");
                        result.style.display = "grid"
                        competition.style.display = "none";
                        finalTime.textContent = timer.textContent
                        finalAnswers.textContent = storeAnswers.current
                    }
                    options.forEach(opt => {opt.style.pointerEvents = 'auto'; opt.style.border = '10px solid rgb(251, 255, 17)';}); // Re-enable clicks
                }, 3000);
            };
        });
    } else {
        console.log("End of quest or invalid questNum.");
    }
}
// fetch('data.json')
//     .then(response => response.json())
//     .then(data => {
//         updateMenu(questNum, data);
//     })
//     .catch(error => console.error('Error fetching JSON data:', error));
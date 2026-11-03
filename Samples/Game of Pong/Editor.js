import { Engine } from "https://cdn.jsdelivr.net/gh/ryanjanghel15/SpriteEngine@557322b04e7dd016ef63453d259a53acaeb5d3b9/engine.js"

Engine.ExperimentalPrtection = false;
Engine.Page.SetTitle("Game Of Pong", true);
Engine.Page.SetTabIcon("https://cdn.jsdelivr.net/gh/ryanjanghel15/SpriteEngine@main/Media/TabCover/TabCover-removebg-preview.png")
Engine.DebugMenu.WaterMrk(
    "https://cdn.jsdelivr.net/gh/ryanjanghel15/SpriteEngine@main/Media/WaterMark/WaterMark1.png",
    "Developed By"
);


document.getElementById("DiffOptionSelction").addEventListener("change", (e) => {
    DiffLevel = e.target.value
})

document.querySelectorAll(".ShortCutInput").forEach((s) => {
    s.addEventListener("click", () => {
        s.textContent = `[?]`
        document.addEventListener("keydown", (e) => {
            console.log(e.key)
            switch (s.getAttribute("value")) {
                case "restart":
                    ShortCutKeys.restart = e.key;
                    break;
            }
            s.textContent = e.key
            e.preventDefault()
        }, { once: true })

    })


})

document.addEventListener("keydown", (e) => {
    let Exicute = true;
    document.querySelectorAll(".ShortCutInput").forEach((Span) => {
        if (Span.textContent == "[?]") { Exicute = false }
    })

    if (Exicute) {
        switch (e.key) {
            case ShortCutKeys.restart:
                Restart();
                console.log("restart")
                break;
        }
    }
})

document.querySelectorAll(`input[name="OpponetType"]`).forEach((ele) => {
    ele.addEventListener('click', (e) => {
        if (ele.checked) {
            UseBot = ele.value == 0 ? true : false;
            if (UseBot) {
                document.getElementById("OpponentSection").style.opacity = 0.5;
                document.getElementById("OpponentSection").style.pointerEvents = "none";
            }
            else {
                document.getElementById("OpponentSection").style.opacity = 1;
                document.getElementById("OpponentSection").style.pointerEvents = "auto";
            }
        }
    })
})
document.getElementById("OpponentSection").style.opacity = 0.5;
document.getElementById("OpponentSection").style.pointerEvents = "none";

document.querySelectorAll(".ControlInput").forEach((ControlInput) => {
    ControlInput.addEventListener("click", () => {
        ControlInput.textContent = "[?]";
        document.addEventListener("keydown", (e) => {
            do {
                ControlInput.textContent = (e.key)

                PlayerList.find((p) => {
                    if (p.playerID === ControlInput.dataset.playerid) {
                        switch (ControlInput.getAttribute("value")) {
                            case "up":
                                p.MoveBtns.Up = e.key
                                break;
                            case "down":
                                p.MoveBtns.Down = e.key
                                break;
                        }
                        console.log(p.playerID, ControlInput.getAttribute("value"), p.MoveBtns.Up, p.MoveBtns.Down)
                    }
                })
            } while (e.key == "")
            e.preventDefault()
        }, { once: true })

    })
})

localStorage.setItem('HighScore', 0);
let GameStoped = true;
let Points = 0;
let GoalSetMode = true
let OppPoints = 0;
let DiffLevel;
let UseBot = true;
let ShortCutKeys = {
    restart: "r"
}
let GoalSetValue = 10;
let PlayerList = []
//Audio
let GameOverSoundEffect = new Audio("Game Over Sound Effect.mp3");
let HitSoundEffect = new Audio("Hit Sound Effect.mp3");
let VictorySoundEffect = new Audio("Victory Sound Effect.mp3")

const Stage = new Engine.Stage("Ground", document.getElementById("StageScreen"), "Page.json")

await Stage.ready;

const Player = new Engine.Entity("Player", true, ["10px", `${Stage.stage.offsetHeight * (3 / 10)}px`], [20, (Stage.stage.offsetHeight / 2) - (Stage.stage.offsetHeight * (3 / 10) / 2)], Stage)

Player.AllotControl(15)
Player.playerID = "0"
Player.Move.Left = false;
Player.Move.Right = false;

const Opponet = new Engine.Entity("Opponet", true, ["10px", `${Stage.stage.offsetHeight * (3 / 10)}px`], [(Stage.stage.offsetWidth - 50), (Stage.stage.offsetHeight / 2) - (Stage.stage.offsetHeight * (3 / 10) / 2)], Stage)

Opponet.playerID = "1"
Opponet.Move.Left = false;
Opponet.Move.Right = false;
Opponet.AllotControl(15);
Opponet.RetainControl();

PlayerList.push(Player)
PlayerList.push(Opponet)

const Dart = new Engine.Entity("Dart", true, ["30px", `30px`], [((Stage.stage.offsetWidth / 2) - 15), ((Stage.stage.offsetHeight / 2) - 15)], Stage)
Dart.speed = 10;
console.log(Dart.Entity);
console.log(getComputedStyle(Dart.Entity).zIndex);

console.log(PlayerList.playerID)
//Debug Inicators
Engine.DebugMenu.AddDebugIndicator("Dart Force", () => { return `${Dart.Xforce},${Dart.Yforce}` });
Engine.DebugMenu.AddDebugIndicator("GameStoped", () => { return GameStoped });
Engine.DebugMenu.AddDebugIndicator("Points", () => { return Points });
Stage.EntityLayer.style.zIndex = "20";
Stage.OtherLayer.style.zIndex = "10";
Dart.AddCollisionDetection()
Dart.AddCollisionBehavior(`[name="${Player.Name}"]`)
Dart.AddCollisionBehavior(`[name="${Opponet.Name}"]`)
const BorderLine = new Engine.Geometry.Line("BorderLine", Stage, [(Stage.stage.offsetWidth / 2) - 10, -5], [(Stage.stage.offsetWidth / 2) - 10, Stage.stage.offsetHeight - 5], 5);
let PointShowPEle = document.createElement("p");
let LoesShowDivEle = document.createElement("div");
LoesShowDivEle.classList.add("LoesShowDivEle");
LoesShowDivEle.innerHTML = `<p id="DisplayText"></p><button id="restartBtn">Start?</button>`
LoesShowDivEle.style.pointerEvents = "auto"

Stage.stage.appendChild(LoesShowDivEle);
document.getElementById("restartBtn").onclick = Restart;


PointShowPEle.classList.add("PointShowPEle")


function Restart() {
    if (GameStoped) {
        PointShowPEle.style.backgroundColor = "azure"
        console.log("GoalSet:", GoalSetValue)
        window.scrollTo(0, 0);
        document.getElementById("restartBtn").textContent = 'Restart?'
        document.getElementById("restartBtn").addEventListener("click", Restart)
        document.body.style.overflow = "hidden";
        LoesShowDivEle.style.opacity = 0
        GameStoped = false;
        Points = 0;
        OppPoints = 0;
        LoesShowDivEle.style.pointerEvents = "none"
        Dart.UpdatePosition(() => { return ((Stage.stage.offsetWidth / 2) - 15) }, () => { return ((Stage.stage.offsetHeight / 2) - 15) })
        Dart.AddForce(20, (Math.random() * 5) + 2);
        Player.UpdatePosition(() => { return 20 }, () => { return (Stage.stage.offsetHeight / 2) - (Stage.stage.offsetHeight * (3 / 10) / 2) })
        Opponet.UpdatePosition(() => { return (Stage.stage.offsetWidth - 50) }, () => { return ((Stage.stage.offsetHeight / 2) - 15) })
        Player.MoveBtns.Up = PlayerUpControlInput.textContent;
        Player.MoveBtns.Down = PlayerDownControlInput.textContent;
        Player.ResumeControl();
        if (UseBot) {
            Opponet.RetainControl()
        }
        else {
            Opponet.ResumeControl()
        }
        switch (DiffLevel) {
            case "0":
                Dart.Friction = 0;
                break;
            case "1":
                Dart.Friction = -0.005;
                break;
            case "2":
                Dart.Friction = -0.01;
                break;

        }


    }
}
function HitHighScoreNCheck() {
    if ((Points > localStorage.getItem('HighScore')) || ((OppPoints > localStorage.getItem('HighScore')) && !UseBot)) {
        localStorage.setItem('HighScore', Points);
        let PlayerName = window.prompt(`You won New high Score :${localStorage.getItem('HighScore', Points)}. Please Enter Your Name:`)
        let table;
        console.log(document.getElementById("ResultScreenDisplay").innerHTML)
        if (document.getElementById("ResultScreenDisplay").innerHTML == `<p style="text-align: center;">No Top Scores Yet</p>`) {
            table = document.createElement(`table`)
            table.classList.add("ResultTableScreen")
            document.getElementById("ResultScreenDisplay").innerHTML =" "
            document.getElementById("ResultScreenDisplay").appendChild(table);
            table.innerHTML = `
                <tr>
                <th>Name</th>
                <th>Score</th>
                </tr>`;
            console.log("GGs")

        }
        table.innerHTML += `<tr><td>${PlayerName}</td><td>${localStorage.getItem('HighScore', Points)}</td></tr>` 
    }
}
Engine.SetEngineLoop(() => {

    if (document.getElementById("goalSetModeInput").checked) {
        GoalSetValue = document.getElementById("goalSetInput").value
        document.getElementById("goalSet").style.opacity = 1;
        document.getElementById("goalSet").style.pointerEvents = "auto";
    }
    else {
        GoalSetValue = null
        document.getElementById("goalSet").style.opacity = 0.5;
        document.getElementById("goalSet").style.pointerEvents = "none";
    }


    if (Dart.moveList.Up === false ||
        Dart.moveList.Down === false ||
        Dart.moveList.Left === false ||
        Dart.moveList.Right === false ||
        Dart.Y <= 0 ||
        Dart.Y + Dart.Entity.offsetHeight >= Stage.stage.offsetHeight) {
        HitSoundEffect.currentTime = 0;
        HitSoundEffect.play();
    }


});
Engine.SetEngineLoop(() => {

    Player.speed = Math.sign(Dart.Xforce) == 1 ? Dart.Xforce : -Dart.Xforce;
    Opponet.speed = Math.sign(Dart.Xforce) == 1 ? Dart.Xforce : -Dart.Xforce;
    if (UseBot) {
        document.querySelector("#OpponentSection")
    }
    //Lose Game
    if ((Dart.X < 0 || Dart.X + Dart.Entity.offsetWidth >= Stage.stage.offsetWidth) && !GameStoped) {
        document.getElementById("DisplayText").textContent = "You Lost"
        if (!UseBot) {
            if (Dart.X < 0) {
                document.getElementById("PlayerPointShowPEle").style.backgroundColor = "red"
            }
            if (Dart.X + Dart.Entity.offsetWidth >= Stage.stage.offsetWidth) {
                document.getElementById("OpponetPointShowPEle").style.backgroundColor = "red"
            }
        }
        GameOverSoundEffect.play()
        document.body.style.overflow = "auto";
        GameStoped = true;
        Player.RetainControl();
        Opponet.RetainControl();
        LoesShowDivEle.style.opacity = 1
        Dart.Xforce = 0;
        Dart.Yforce = 0;
        LoesShowDivEle.style.pointerEvents = "auto"
        if (Dart.X < 0) {
            Dart.UpdatePosition(() => { return 0 }, () => { return Dart.Y })
        }
        if (Dart.X + Dart.Entity.offsetWidth > Stage.stage.offsetWidth) {
            Dart.UpdatePosition(() => { return Stage.stage.offsetWidth - Dart.Entity.offsetWidth }, () => { return Dart.Y })
        }
        LoesShowDivEle.style.pointerEvents = "auto"
        HitHighScoreNCheck();


    }
    //Won Game
    else if (Points == GoalSetValue && !GameStoped) {
        LoesShowDivEle.style.pointerEvents = "auto"
        document.getElementById("DisplayText").textContent = "You Won!!!"
        document.body.style.overflow = "auto";
        GameStoped = true;
        Player.RetainControl();
        Opponet.RetainControl();
        LoesShowDivEle.style.opacity = 1
        Dart.Xforce = 0;
        Dart.Yforce = 0;
        PointShowPEle.style.backgroundColor = "green"
        HitHighScoreNCheck();
        VictorySoundEffect.play()

    }
    else {
        let Y;
        if (Dart.Y <= Stage.stage.offsetHeight - Opponet.Entity.offsetHeight + 50) {
            Y = (Dart.Y - Opponet.Entity.offsetHeight / 2)
        }
        else {
            Y = Stage.stage.offsetHeight - Stage.stage.offsetHeight * (3 / 10)
        }
        if (UseBot) {
            if (Dart.Y - Stage.stage.offsetHeight * (3 / 10) / 2 < 0) {
                Y = 0
            }
            Opponet.UpdatePosition(() => { return (Stage.stage.offsetWidth - 50) }, () => { return Y })

        }
        if (Dart.ColliderData.left[0] == Player.Entity) {
            Points++;
            if (Dart.Y > Stage.stage.offsetHeight - 45 && !Dart.Y == Stage.stage.offsetHeight - 45) { Dart.UpdatePosition(() => { return Dart.X }, () => { return Stage.stage.offsetHeight - 45 }) }
        }
        if (Dart.ColliderData.right[0] == Opponet.Entity) {
            OppPoints++;
            if (Dart.Y > Stage.stage.offsetHeight - 45 && !Dart.Y == Stage.stage.offsetHeight - 45) { Dart.UpdatePosition(() => { return Dart.X }, () => { return Stage.stage.offsetHeight - 45 }) }
        }
        if (Dart.moveList.Right == false) {
            let sign = (Math.round(Math.random())) == 1 ? -1 : 1;

            switch (DiffLevel) {
                case "1":
                    Dart.AddForce(0, sign * (3 * Math.random()))
                    break;
                case "2":
                    Dart.AddForce(0, sign * (5 * Math.random()))
                    break;

            }

        }
    }
    if (!GameStoped) {
        if (UseBot) {
            PointShowPEle.textContent = Points
        }
        else {
            PointShowPEle.innerHTML = `<span id="PlayerPointShowPEle">${Points}</span> V/S <span id="OpponetPointShowPEle">${OppPoints}</span>`
        }
    }
    PointShowPEle.style.left = `${(Stage.stage.offsetWidth - PointShowPEle.offsetWidth) / 2}px`
    BorderLine.ChangePosition([(Stage.stage.offsetWidth / 2) - 10, -5], [(Stage.stage.offsetWidth / 2) - 10, Stage.stage.offsetHeight - 5])
    if (document.getElementById("restartBtn").textContent == 'Start?') {
        Dart.UpdatePosition(() => { return ((Stage.stage.offsetWidth / 2) - 15) }, () => { return ((Stage.stage.offsetHeight / 2) - 15) })
    }
})

Stage.stage.appendChild(PointShowPEle);
let currentSong = new Audio();
let songs;
let currFolder;
function secondsToMinutesSeconds(seconds)
{
    if(isNaN(seconds) || seconds < 0)
    {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainigSeconds = Math.floor(seconds % 60)

    const formattedMinutes = String(minutes).padStart(2,'0');
    const formattedSeconds = String(remainigSeconds).padStart(2,'0')

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsong(folder) {
    currFolder = folder;
    let a = await fetch(`./${folder}/`);
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++)
        {
        const element = as[index];
        if (element.href.endsWith(".mp3")) 
            {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUl.innerHTML = " "
for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li><img class="invert" src="SVG/music.svg" alt="music">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Ahmad</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="SVG/play.svg" alt="play">
                            </div></li> `;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            let track = e.querySelector(".info").firstElementChild.textContent.trim();
            console.log(track);
            playMusic(track);
        });
    });

}

const playMusic = (track) => {
    currentSong.src = `./${currFolder}/` + track;  
    currentSong.play();
    play.src = "SVG/pause.svg";

    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

}

async function displayAblums()
{
    let a = await fetch("./song/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    Array.from(anchors).forEach(async e=>{
       if (e.href.includes("/song/") && !e.href.endsWith("/song"))
        {
            let folder = e.href.split("/").pop();
            let a = await fetch(`./song/${folder}/info.json`); 
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <div class="play-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                    fill="#000" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">
                                    <path
                                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" />
                                </svg>
                            </div>
                        </div>
                        <img src="./song/${folder}/cover.jpg">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;
        }
        let cards = document.querySelectorAll(".card");

    cards.forEach(card => {
    card.onclick = async () => {
        await getsong(`song/${card.dataset.folder}`);
    };
});
})
}

async function main() {
    await getsong("song/ncs")
    console.log(songs)

    await displayAblums();


    play.addEventListener("click", ()=>{
        if(currentSong.paused)
        {
            currentSong.play()
            play.src = "SVG/pause.svg"
        }  
        else 
        {
            currentSong.pause()
            play.src = "SVG/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);

    document.querySelector(".songtime").innerHTML =
        `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
});


document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100; 
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration)* percent)  / 100;
})

document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".right").style.left = "0"
});

document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".right").style.left = "-120%"
});

previous.addEventListener("click",()=>{
    console.log("previous clicked") 
    console.log(currentSong)
     let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index - 1) >= 0)
    {
    playMusic(songs[index - 1]) 
    }
});

next.addEventListener("click",()=>{
    console.log("Next clicked")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index + 1) < songs.length)
    {
    playMusic(songs[index + 1]) 
    }
});

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>
{
    console.log(e, e.target, e.target.value)
    currentSong.volume = parseInt(e.target.value) / 100
    if(currentSong.volume > 0 )
    {
        document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
    }
});

Array.from(document.getElementsByClassName("card")).forEach(card=>
    {
    card.addEventListener("click", async () =>
        {
             await getsong(`song/${card.dataset.folder}`);
        })
})

document.querySelector(".volume>img").addEventListener("click",e=>{
    if(e.target.src.includes("volume.svg"))
    {
        e.target.src= e.target.src.replace("volume.svg", "mute.svg")
        currentSong.volume = 0; 
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else
    {
        e.target.src = e.target.src.replace("mute.svg", "volume.svg")
        currentSong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }
})

}
main() 
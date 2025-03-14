var says = [
    "Is That a Berserk Reference?",
    "Please Stop Being Racist In The DISC0RD",
    "tinyurl.com/RailinDev",
    "Your one and only Unbl0cked Playground",
    "I hate working on Berserk",
    "Better than Bypass",
    "GD 2.2 OCTOBER 2023!!!",
    "yowoodTodd",
    "Bot",
    "BERSERK 2.0!",
    "stop asking where disc0rd is. its in widgetbot",
    "blogs was useless",
    "so was secrets",
    "Tempus fugit ⏰",
    "yes it's open-source",
    "no you shouldn’t skid it",
    "what do I add?",
    "*you're* 👆🤓",
    "idk how many games are in this lol",
    "optimized by ChatGPT",
    "archiving piksulh soon",
    "Cooper thanks for loving Berserk!",
    "i can't use fontawesome because of you guys :(",
    "LunarOS 🔛🔝",
    "i need ads on this site cuz i need money 😮",
    "uh",
    "my coder friends copying me and he's better at coding than me",
    "School's pretty boring",
    "This website is trash", 
    "i took too long making this :(", 
    "AOSUDHASIUD4u3ghiuj34hgi34gH", 
    "hotline bling", 
    "all 1v1lol's are blocked at my school", 
    "the person who made this website is pretty cool", 
    "what day is it?", 
    "fortnite battle pass", 
    "i made this on the weekend :((((",
    "hiiii aiden :)",
    "i hate myself",
    "im in love with an emo girl 💅",
    "amog",
    "💀",
    "hey e-kitten",
];

function splashText() {
    document.querySelector(".Index-SplashText").innerHTML =
        says[Math.floor(Math.random() * says.length)];
}

document.addEventListener("DOMContentLoaded", function () {
    splashText();

    fetch("https://ipv4.wtfismyip.com/json")
        .then((response) => response.json())
        .then((data) => {
            ipAddress = data.YourFuckingIPAddress;
            says.push(`umm your ip: ${ipAddress}`);
            splashText();
        });

    const navButtonsContainer = document.querySelector(".Navigation-Buttons");
    let isLoaded = false;

    function loadNavButtons() {
        if (!isLoaded) {
            navButtonsContainer.innerHTML = `
                <li class="Navigation-Button"><a href="./"><i class="las la-home"></i><p>Home</p></a></li>
                <li class="Navigation-Button"><a href="./g.html"><i class="las la-file"></i><p>Projects</p></a></li>
                <li class="Navigation-Button"><a href="./u.html"><i class="las la-file"></i><p>Cinema</p></a></li>
                <li class="Navigation-Button"><a href="./d.html"><i class="las la-file"></i><p>Downloads</p></a></li>
                <li class="Navigation-Button"><a href="./f.html"><i class="las la-file"></i><p>Links</p></a></li>
                <li class="Navigation-Button"><a href="./e.html"><i class="las la-hourglass-half"></i><p>Emulator</p></a></li>
                <li class="Navigation-Button"><a href="./settings.html"><i class="las la-cog"></i><p>Settings</p></a></li>
            `;
            isLoaded = true;
        }
    }

    // Load buttons when user starts scrolling in the navbar
    navButtonsContainer.addEventListener("scroll", loadNavButtons, { once: true });
});
document.addEventListener("DOMContentLoaded", function () {
    const packageBtn = document.getElementById("packageBtn");
    const importBtn = document.getElementById("importBtn");
    const gameSelect = document.getElementById("gameSelect");
    const modSearch = document.getElementById("modSearch");
    const modGrid = document.getElementById("modGrid");
    const showMoreBtn = document.getElementById("showMoreBtn");
    const dependenciesList = document.getElementById("dependenciesList");

    const games = [
        "boneworks",
        "content-warning",
        "gtfo",
        "h3vr",
        "lethal-company",
        "risk-of-rain-2",
        "titanfall-2-northstar",
        "valheim",
        "20-minutes-till-dawn",
        "3dash",
        "against",
        "across-the-obelisk",
        "against-the-storm",
        "aloft",
        "among-us",
        "ancient-dungeon-vr",
        "another-crabs-treasure",
        "atomicrops",
        "atrio-the-dark-wild",
        "bonelab",
        "back-to-the-dawn",
        "backpack-hero",
        "balatro",
        "below-the-stone",
        "bomb-rush-cyberfunk",
        "bopl-battle",
        "brotato",
        "castle-story",
        "chrono-ark",
        "cities-skylines-ii",
        "cobalt-core",
        "core-keeper",
        "cult-of-the-lamb",
        "dome-keeper",
        "dredge",
        "dyson-sphere-program",
        "enter-the-gungeon",
        "for-the-king",
        "garfield-kart-furious-racing",
        "gladio-mori",
        "gloomwood",
        "green-hell-vr",
        "hades-ii",
        "hard-bullet",
        "hotds",
        "inscryption",
        "last-train-outta-wormtown",
        "lethal-league-blaze",
        "lycans",
        "magicraft",
        "mechanica",
        "meeple-station",
        "muck",
        "nickelodeon-all-star-brawl",
        "outward",
        "palworld",
        "panicore",
        "patch-quest",
        "peglin",
        "plasma",
        "potion-craft",
        "rounds",
        "rumble",
        "ravenfield",
        "receiver-2",
        "risk-of-rain-returns",
        "rogue-tower",
        "rogue-genesia",
        "sailwind",
        "shadows-over-loathing",
        "shadows-of-doubt",
        "skul-the-hero-slayer",
        "slipstream-rogue-space",
        "sons-of-the-forest",
        "stacklands",
        "starsand",
        "subnautica",
        "subnautica-below-zero",
        "sun-haven",
        "sunkenland",
        "talespire",
        "techtonica",
        "the-ouroboros-king",
        "the-planet-crafter",
        "thronefall",
        "timberborn",
        "totally-accurate-battle-simulator",
        "touhou-lost-branch-of-legend",
        "trombone-champ",
        "ultrakill",
        "ultimate-chicken-horse",
        "v-rising",
        "vtol-vr",
        "vertigo-2",
        "voices-of-the-void",
        "void-crew",
        "we-love-katamari-reroll-royal-reverie",
        "west-of-loathing",
        "wildfrost",
        "wizard-of-legend",
        "wizard-with-a-gun",
        "wrestling-empire"
    ];

    let mods = [];
    let displayedMods = 0;

    games.forEach(game => {
        console.log(`Adding game to select: ${game}`);
        const option = document.createElement("option");
        option.value = game;
        option.textContent = game;
        gameSelect.appendChild(option);
    });

    gameSelect.addEventListener("change", function () {
        console.log(`Game selected: ${this.value}`);
        fetchMods(this.value);
    });

    modSearch.addEventListener("input", function () {
        console.log(`Search query: ${this.value}`);
        filterMods(this.value);
    });

    showMoreBtn.addEventListener("click", function () {
        console.log("Show more clicked");
        displayMods(mods, displayedMods + 9);
    });

    function fetchMods(game) {
        console.log(`Fetching mods for game: ${game}`);
        fetch(`https://thunderstore.io/c/${game}/api/v1/package/`)
            .then(response => response.json())
            .then(data => {
                console.log(`Mods fetched:`, data);
                mods = data;
                displayedMods = 0;
                displayMods(mods, 9);
            });
    }

    function filterMods(query) {
        console.log(`Filtering mods with query: ${query}`);
        const filteredMods = mods.filter(mod => mod.name.toLowerCase().includes(query.toLowerCase()));
        console.log(`Filtered mods:`, filteredMods);
        displayedMods = 0;
        displayMods(filteredMods, 9);
    }

    function displayMods(mods, count) {
        console.log(`Displaying ${count} mods out of ${mods.length}`);
        modGrid.innerHTML = "";
        const modsToShow = mods.slice(0, count);
        modsToShow.forEach(mod => {
            const latestVersion = mod.versions.reduce((latest, version) => {
                return new Date(version.date_created) > new Date(latest.date_created) ? version : latest;
            }, mod.versions[0]);
    
            console.log("Mod data received: \n Mod Name: " + mod.name + " \n Mod Icon: " + latestVersion.icon);
    
            console.log(`Displaying mod: ${mod.name}`);
            const modCard = document.createElement("div");
            modCard.className = "mod-card";
    
            const modImage = document.createElement("img");
            modImage.src = latestVersion.icon;
            modCard.appendChild(modImage);
    
            const modName = document.createElement("p");
            modName.textContent = mod.name;
            modCard.appendChild(modName);
    
            const selectButton = document.createElement("button");
            selectButton.textContent = "Select";
            selectButton.addEventListener("click", function () {
                console.log(`Selected mod: ${mod.full_name}`);
                addDependency(mod.full_name);
            });
            modCard.appendChild(selectButton);
    
            modGrid.appendChild(modCard);
        });
        displayedMods = count;
        showMoreBtn.classList.toggle("hidden", mods.length <= displayedMods);
    }    

    function addDependency(modName) {
        const dependencyCard = document.createElement("div");
        dependencyCard.className = "dependency-card";

        const modNameText = document.createElement("p");
        modNameText.textContent = modName;
        dependencyCard.appendChild(modNameText);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.className = "remove-btn";
        removeButton.addEventListener("click", function () {
            removeDependency(dependencyCard);
        });
        dependencyCard.appendChild(removeButton);

        dependenciesList.appendChild(dependencyCard);
    }

    function removeDependency(dependencyCard) {
        dependenciesList.removeChild(dependencyCard);
    }

    packageBtn.addEventListener("click", function () {
        console.log("Packaging button clicked");

        const name = document.getElementById("name").value;
        const version = document.getElementById("version").value;
        const website = document.getElementById("website").value;
        const description = document.getElementById("description").value;
        const readme = document.getElementById("readme").value;
        const iconFile = document.getElementById("iconFile").files[0];
        const dependencies = Array.from(dependenciesList.children).map(item => item.textContent.replace("Remove", "").trim());

        console.log("Form values:");
        console.log({ name, version, website, description, readme, dependencies, iconFile });

        const manifest = {
            name,
            version_number: version,
            website_url: website,
            description,
            dependencies
        };

        const zip = new JSZip();
        zip.file("manifest.json", JSON.stringify(manifest));
        zip.file("README.md", readme);

        if (iconFile) {
            console.log("Reading icon file");
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = 256;
                    canvas.height = 256;
                    ctx.drawImage(img, 0, 0, 256, 256);
                    canvas.toBlob(function (blob) {
                        zip.file("icon.png", blob);
                        generateZip(zip);
                    });
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(iconFile);
        } else {
            generateZip(zip);
        }
    });

    function generateZip(zip) {
        console.log("Generating zip file");
        zip.generateAsync({ type: "blob" })
            .then(function (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "package.zip";
                console.log("Downloading zip file");
                link.click();
                URL.revokeObjectURL(url);
            });
    }

    /*
    importBtn.addEventListener("click", function () {
        console.log("Import button clicked");
        const importFile = document.getElementById("importFile").files[0];
        const zip = new JSZip();
        zip.loadAsync(importFile).then(function (zipContents) {
            zipContents.file("manifest.json").async("string").then(function (manifestContent) {
                const manifest = JSON.parse(manifestContent);
                console.log("Imported manifest:", manifest);
                document.getElementById("name").value = manifest.name || "";
                document.getElementById("version").value = manifest.version_number || "";
                document.getElementById("website").value = manifest.website_url || "";
                document.getElementById("description").value = manifest.description || "";
            });
            zipContents.file("README.md").async("string").then(function (readmeContent) {
                console.log("Imported README.md content:", readmeContent);
                document.getElementById("readme").value = readmeContent || "";
            });
        });
    });
    */
});

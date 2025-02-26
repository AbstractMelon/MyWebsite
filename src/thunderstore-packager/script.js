packageBtn.addEventListener("click", function () {
    // Get the contents of readme and manifest.json textareas
    const readmeContent = document.getElementById("readme").value;

    // Get values from separate input fields
    const name = document.getElementById("name").value;
    const version = document.getElementById("version").value;
    const website = document.getElementById("website").value;
    const description = document.getElementById("description").value;
    const dependencies = document.getElementById("dependencies").value.split(",").map(dep => dep.trim());

    // Construct manifest object
    const manifest = {
        "name": name,
        "version_number": version,
        "website_url": website,
        "description": description,
        "dependencies": dependencies
    };

    // Convert manifest object to JSON string
    const manifestContent = JSON.stringify(manifest);

    // Create a new JSZip instance
    const zip = new JSZip();

    // Add readme and manifest.json to the zip
    zip.file("README.md", readmeContent);
    zip.file("manifest.json", manifestContent);

    // Add the .dll and .png files
    const dllFile = document.getElementById("dllFile").files[0];
    const pngFile = document.getElementById("pngFile").files[0];
    
    // Resize the PNG image to 256x256
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = function () {
        canvas.width = 256;
        canvas.height = 256;
        ctx.drawImage(img, 0, 0, 256, 256);
        canvas.toBlob(function (blob) {
            zip.file("icon.png", blob);
            addFilesToZip(zip, dllFile);
        });
    };
    img.src = URL.createObjectURL(pngFile);

    // add other files to the zip
    function addFilesToZip(zip, file) {
        if (file) {
            zip.file(file.name, file);
        }
        // Generate the zip file
        zip.generateAsync({ type: "blob" })
            .then(function (blob) {
                // Create a temporary download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "package.zip"; 
                document.body.appendChild(link);

                // click on the download link
                link.click();

                // Clean up
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            });
    }
});



// Add event listener for import button click
document.getElementById("importBtn").addEventListener("click", function () {
    // Get the selected .zip file
    const importFile = document.getElementById("importFile").files[0];

    // Create a new JSZip instance
    const zip = new JSZip();

    // Read the imported .zip file
    zip.loadAsync(importFile).then(function (zipContents) {
        // Extract the manifest.json and README.md files
        const manifestContent = zipContents.file("manifest.json").async("string");
        const readmeContent = zipContents.file("README.md").async("string");

        // Once both files are read, continue processing
        Promise.all([manifestContent, readmeContent]).then(function (values) {
            const [manifestContent, readmeContent] = values;

            // Parse manifest.json content
            const manifest = JSON.parse(manifestContent);

            // Populate form fields with imported data
            document.getElementById("name").value = manifest.name || "";
            document.getElementById("version").value = manifest.version_number || "";
            document.getElementById("website").value = manifest.website_url || "";
            document.getElementById("description").value = manifest.description || "";
            document.getElementById("readme").value = readmeContent || "";
        });
    });
});




//add common dependencies
document.getElementById("addCommonDependency").onclick=()=>{
    const depEl = document.getElementById("dependencies")
    let stringVal = document.getElementById("comDepSelect").value

    if(/^\s*$/.test(depEl.value)){
        depEl.value = stringVal
        return
    }
    if(depEl.value.endsWith(",")){
        depEl.value+=stringVal
        return
    }
    depEl.value+= ", "+stringVal
}
document.addEventListener("DOMContentLoaded", function () {
    const uploadForm = document.getElementById("uploadForm");
    const readmeTextarea = document.getElementById("readme");
    const manifestTextarea = document.getElementById("manifest");
    const packageBtn = document.getElementById("packageBtn");

    const defaultManifestContent = `{
        "name": "TestMod",
        "version_number": "1.0.0",
        "website_url": "https://github.com/thunderstore-io",
        "description": "This is a description for a mod. 250 characters max",
        "dependencies": [
        ]
    }`;
    
    document.getElementById("manifest").value = defaultManifestContent;

    packageBtn.addEventListener("click", function () {
        // Get the contents of readme and manifest.json textareas
        const readmeContent = readmeTextarea.value;
        const manifestContent = manifestTextarea.value;

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

    uploadForm.addEventListener("change", function () {
        const dllFile = document.getElementById("dllFile").files[0];
        const pngFile = document.getElementById("pngFile").files[0];

        // Read the contents of .dll file
        const dllReader = new FileReader();
        dllReader.onload = function (event) {
            const dllContent = event.target.result;
            console.log(".dll file content:", dllContent);
        };
        dllReader.readAsText(dllFile);

        // Read the contents of .png file
        const pngReader = new FileReader();
        pngReader.onload = function (event) {
            const pngContent = event.target.result;
            console.log(".png file content:", pngContent);
        };
        pngReader.readAsDataURL(pngFile);
    });
});

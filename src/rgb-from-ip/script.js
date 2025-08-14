async function getMyIP() {
  showLoading();
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    document.getElementById("inputField").value = data.ip;
    convertInput();
  } catch (error) {
    showError("Unable to fetch your IP address. Please try again.");
  }
}

async function resolveToIP(input) {
  // Check if input is already an IP address
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipRegex.test(input)) {
    return input;
  }

  // If it's a domain, try to resolve it
  try {
    // Use a DNS over HTTPS service to resolve the domain
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${input}&type=A`,
      {
        headers: {
          Accept: "application/dns-json",
        },
      },
    );
    const data = await response.json();

    if (data.Answer && data.Answer.length > 0) {
      return data.Answer[0].data;
    } else {
      throw new Error("Domain not found");
    }
  } catch (error) {
    throw new Error("Unable to resolve domain to IP address");
  }
}

function ipToRGBA(ip) {
  const parts = ip.split(".").map(Number); // Convert each part to number

  // Ensure we have 4 numbers (use 255 for missing values)
  const [r, g, b, a] = [
    parts[0] ?? 0,
    parts[1] ?? 0,
    parts[2] ?? 0,
    parts[3] ?? 255, // If no 4th part, use 255 for full alpha
  ];

  const alpha = parseFloat((a / 255).toFixed(2)); // Convert 0-255 to 0-1

  return {
    r,
    g,
    b,
    a: alpha,
    rgba: `rgba(${r}, ${g}, ${b}, ${alpha})`,
    hex: `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`,
  };
}

async function convertInput() {
  const input = document.getElementById("inputField").value.trim();

  if (!input) {
    showError("Please enter an IP address or domain name");
    return;
  }

  showLoading();

  try {
    const ip = await resolveToIP(input);
    const colorData = ipToRGBA(ip);
    showResults(input, ip, colorData);
  } catch (error) {
    showError(error.message);
  }
}

function showLoading() {
  const resultsSection = document.getElementById("resultsSection");
  resultsSection.innerHTML = '<div class="loading pulse">Converting...</div>';
  resultsSection.classList.add("active");
}

function showError(message) {
  const resultsSection = document.getElementById("resultsSection");
  resultsSection.innerHTML = `<div class="error">${message}</div>`;
  resultsSection.classList.add("active");
}

function showResults(input, ip, colorData) {
  const resultsSection = document.getElementById("resultsSection");

  resultsSection.innerHTML = `
                <div class="result-item fade-in">
                    <div class="result-info">
                        <div class="result-label">Input</div>
                        <div class="result-value">${input}</div>
                    </div>
                    <button class="copy-btn" onclick="copyToClipboard('${input}')">Copy</button>
                </div>

                ${
                  input !== ip
                    ? `
                <div class="result-item fade-in">
                    <div class="result-info">
                        <div class="result-label">Resolved IP</div>
                        <div class="result-value">${ip}</div>
                    </div>
                    <button class="copy-btn" onclick="copyToClipboard('${ip}')">Copy</button>
                </div>
                `
                    : ""
                }

                <div class="result-item fade-in">
                    <div class="result-info">
                        <div class="result-label">RGBA Color</div>
                        <div class="result-value">${colorData.rgba}</div>
                    </div>
                    <div class="color-preview" style="background-color: ${colorData.rgba}"></div>
                    <button class="copy-btn" onclick="copyToClipboard('${colorData.rgba}')">Copy</button>
                </div>

                <div class="result-item fade-in">
                    <div class="result-info">
                        <div class="result-label">Hex Color</div>
                        <div class="result-value">${colorData.hex}</div>
                    </div>
                    <div class="color-preview" style="background-color: ${colorData.hex}"></div>
                    <button class="copy-btn" onclick="copyToClipboard('${colorData.hex}')">Copy</button>
                </div>

                <div class="result-item fade-in">
                    <div class="result-info">
                        <div class="result-label">RGB Values</div>
                        <div class="result-value">R: ${colorData.r}, G: ${colorData.g}, B: ${colorData.b}</div>
                    </div>
                    <button class="copy-btn" onclick="copyToClipboard('rgb(${colorData.r}, ${colorData.g}, ${colorData.b})')">Copy</button>
                </div>

                <div class="result-item fade-in">
                    <div class="result-info">
                        <div class="result-label">Alpha Value</div>
                        <div class="result-value">${colorData.a}</div>
                    </div>
                    <button class="copy-btn" onclick="copyToClipboard('${colorData.a}')">Copy</button>
                </div>
            `;

  resultsSection.classList.add("active");
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Visual feedback for successful copy
    const event = new CustomEvent("copied");
    document.dispatchEvent(event);
  });
}

// Handle Enter key press
document
  .getElementById("inputField")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      convertInput();
    }
  });

// Simple notification for copy success
document.addEventListener("copied", function () {
  const notification = document.createElement("div");
  notification.textContent = "Copied to clipboard!";
  notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4a9eff;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-weight: 600;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;

  const style = document.createElement("style");
  style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
    style.remove();
  }, 2000);
});

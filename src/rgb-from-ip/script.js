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
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

  // If already IP, return directly
  if (ipv4Regex.test(input) || ipv6Regex.test(input)) {
    return input;
  }

  try {
    // First try IPv4 (A record)
    let response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${input}&type=A`,
      { headers: { Accept: "application/dns-json" } },
    );
    let data = await response.json();
    if (data.Answer && data.Answer.length > 0) {
      return data.Answer[0].data;
    }

    // Then try IPv6 (AAAA record)
    response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${input}&type=AAAA`,
      { headers: { Accept: "application/dns-json" } },
    );
    data = await response.json();
    if (data.Answer && data.Answer.length > 0) {
      return data.Answer[0].data;
    }

    throw new Error("Domain not found");
  } catch (error) {
    throw new Error("Unable to resolve domain to IP address");
  }
}

function ipToRGBA(ip) {
  if (ip.includes(".")) {
    // IPv4
    const parts = ip.split(".").map(Number);
    const r = parts[0] ?? 0;
    const g = parts[1] ?? 0;
    const b = parts[2] ?? 0;
    const a = parts[3] !== undefined ? parts[3] / 255 : 1;
    return {
      r,
      g,
      b,
      a,
      rgba: `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`,
      hex: `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`,
    };
  } else {
    // IPv6
    let expanded = expandIPv6(ip);
    const groups = expanded.split(":").map((h) => parseInt(h, 16));
    const r = Math.round((groups[0] / 65535) * 255);
    const g = Math.round((groups[1] / 65535) * 255);
    const b = Math.round((groups[2] / 65535) * 255);
    const a = groups[3] ? groups[3] / 65535 : 1;
    return {
      r,
      g,
      b,
      a,
      rgba: `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`,
      hex: `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`,
    };
  }
}

function expandIPv6(ip) {
  const parts = ip.split("::");
  let head = parts[0] ? parts[0].split(":") : [];
  let tail = parts[1] ? parts[1].split(":") : [];
  const missing = 8 - (head.length + tail.length);
  const zeros = Array(missing).fill("0000");
  const full = [...head, ...zeros, ...tail].map((part) =>
    part.padStart(4, "0"),
  );
  return full.join(":");
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

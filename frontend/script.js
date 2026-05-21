const promptInput =
  document.getElementById("prompt");

const contentType =
  document.getElementById("contentType");

const tone =
  document.getElementById("tone");

const wordCount =
  document.getElementById("wordCount");

const generateBtn =
  document.getElementById("generateBtn");

const responseOutput =
  document.getElementById("responseOutput");

const copyBtn =
  document.getElementById("copyBtn");

const historyList =
  document.getElementById("historyList");

const themeBtn =
  document.getElementById("themeBtn");

// Load history on page load
loadHistory();

// Generate Content
generateBtn.addEventListener(
  "click",
  generateContent
);

async function generateContent() {

  const prompt =
    promptInput.value.trim();

  if (!prompt) {

    alert("Please enter a prompt");

    return;
  }

  try {

    generateBtn.disabled = true;

    generateBtn.innerText =
      "Generating...";

    responseOutput.innerText =
      "Generating content...";

    const response = await fetch(
      "http://localhost:5000/generate",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          prompt,
          type: contentType.value,
          tone: tone.value,
          wordCount: wordCount.value,
        }),
      }
    );

    const data =
      await response.json();

    if (data.success) {

      responseOutput.innerText =
        data.response;

      saveToHistory(
        prompt,
        contentType.value
      );

    } else {

      responseOutput.innerText =
        data.message ||
        "Something went wrong";
    }

  } catch (error) {

    console.error(error);

    responseOutput.innerText =
      "Failed to connect to backend";

  } finally {

    generateBtn.disabled = false;

    generateBtn.innerText =
      "Generate Content";
  }
}

// Copy Response
copyBtn.addEventListener(
  "click",
  () => {

    navigator.clipboard.writeText(
      responseOutput.innerText
    );

    copyBtn.innerText = "Copied!";

    setTimeout(() => {

      copyBtn.innerText = "Copy";

    }, 2000);
  }
);

// Save History
function saveToHistory(prompt, type) {

  const history =
    JSON.parse(
      localStorage.getItem(
        "promptHistory"
      )
    ) || [];

  history.unshift({
    prompt,
    type,
    timestamp:
      new Date().toLocaleString(),
  });

  localStorage.setItem(
    "promptHistory",
    JSON.stringify(history.slice(0, 10))
  );

  loadHistory();
}

// Load History
function loadHistory() {

  const history =
    JSON.parse(
      localStorage.getItem(
        "promptHistory"
      )
    ) || [];

  historyList.innerHTML = "";

  history.forEach((item, index) => {

    const div =
      document.createElement("div");

    div.classList.add("history-item");

    div.innerHTML = `
      <p><strong>Prompt:</strong> ${item.prompt}</p>

      <p><strong>Type:</strong> ${item.type}</p>

      <p><strong>Time:</strong> ${item.timestamp}</p>

      <div class="history-buttons">

        <button onclick="reusePrompt('${item.prompt}')">
          Reuse
        </button>

        <button onclick="deleteHistory(${index})">
          Delete
        </button>

      </div>
    `;

    historyList.appendChild(div);
  });
}

// Reuse Prompt
function reusePrompt(prompt) {

  promptInput.value = prompt;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Delete History
function deleteHistory(index) {

  const history =
    JSON.parse(
      localStorage.getItem(
        "promptHistory"
      )
    ) || [];

  history.splice(index, 1);

  localStorage.setItem(
    "promptHistory",
    JSON.stringify(history)
  );

  loadHistory();
}
// Theme Toggle

themeBtn.addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "light-mode"
    );

    // Save Theme
    if (
      document.body.classList.contains(
        "light-mode"
      )
    ) {

      localStorage.setItem(
        "theme",
        "light"
      );

    } else {

      localStorage.setItem(
        "theme",
        "dark"
      );
    }
  }
);

// Load Saved Theme

const savedTheme =
  localStorage.getItem("theme");

if (savedTheme === "light") {

  document.body.classList.add(
    "light-mode"
  );
}
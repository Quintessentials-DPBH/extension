const endpoint = "http:/127.0.0.1:5000/";
const descriptions = {
  Sneaking:
    "Coerces users to act in ways that they would not normally act by obscuring information.",
  Urgency: "Places deadlines on things to make them appear more desirable",
  Misdirection:
    "Aims to deceptively incline a user towards one choice over the other.",
  "Social Proof":
    "Gives the perception that a given action or product has been approved by other people.",
  Scarcity:
    "Tries to increase the value of something by making it appear to be limited in availability.",
  Obstruction:
    "Tries to make an action more difficult so that a user is less likely to do that action.",
  "Forced Action":
    "Forces a user to complete extra, unrelated tasks to do something that should be simple.",
};

function scrape() {
  // website has already been analyzed
  console.log("hello world 2");
  if (document.getElementById("style_count")) {
    return;
  }

  // aggregate all DOM elements on the page
  let elements = segments(document.body);
  let filtered_elements = [];

  for (let i = 0; i < elements.length; i++) {
    let text = elements[i].innerText?.trim().replace(/\t/g, " ");
    if (text && text.length == 0) {
      continue;
    }
    filtered_elements.push(text);
  }
  console.log("Hello again");
  // post to the web server
  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tokens: filtered_elements }),
  })
    .then((resp) => resp.json())
    .then((data) => {
      data = data["result"];
      // data = data.replace(/'/g, '"');
      // json = JSON.parse(data);
      let dp_count = 0;
      let element_index = 0;
      const regex = /^.{0,2}\d+(,\d{2,3})*$/g;
      for (let i = 0; i < elements.length; i++) {
        let text = elements[i].innerText?.trim().replace(/\t/g, " ");
        if (text && text.length == 0) {
          continue;
        }
        for (const marked_text of data) {
          if (regex.test(marked_text)) continue;
          console.log(marked_text, text, marked_text == text);
          if (marked_text == text) {
            highlight(elements[element_index], "Sneaking");
          }
        }
        // if (json.result[i] !== "Not Dark") {
        //   highlight(elements[element_index], json.result[i]);
        //   dp_count++;
        // }
        element_index++;
      }
      dp_count = data.length;
      // store number of d  ark patterns
      let g = document.createElement("div");
      g.id = "style_count";
      g.value = dp_count;
      g.style.opacity = 0;
      g.style.position = "fixed";
      document.body.appendChild(g);
      sendDarkPatterns(g.value);
    })
    .catch((error) => {
      alert(error);
      alert(error.stack);
    });
}

function highlight(element, type) {
  element.classList.add("style-highlight");

  let body = document.createElement("span");
  body.classList.add("style-highlight-body");

  /* header */
  let header = document.createElement("div");
  header.classList.add("modal-header");
  let headerText = document.createElement("h1");
  headerText.innerHTML = type + " Pattern";
  header.appendChild(headerText);
  body.appendChild(header);

  /* content */
  let content = document.createElement("div");
  content.classList.add("modal-content");
  content.innerHTML = descriptions[type];
  body.appendChild(content);

  element.appendChild(body);
}

function sendDarkPatterns(number) {
  chrome.runtime.sendMessage({
    message: "update_current_count",
    count: number,
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "analyze_site") {
    console.log("Tummy had bad day");
    scrape();
  } else if (request.message === "popup_open") {
    console.log(":Hellofreiod");
    let element = document.getElementById("style_count");
    if (element) {
      sendDarkPatterns(element.value);
    }
  }
});

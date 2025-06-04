document.addEventListener("DOMContentLoaded", function () {
  const butt = document.getElementById("start-server");
  const status = document.getElementById("status");
  const playercount = document.getElementById("player-count");
  const version = document.getElementById("version");
  const description = document.getElementById("description");
  const maxplayers = document.getElementById("max-players");
  const latency = document.getElementById("latency");
  const playerlist = document.getElementById("player-list");

  butt.addEventListener("click", start_server);

  function start_server() {
    if (status.textContent === "Offline") {
      const request = new XMLHttpRequest();
      request.open("POST", "/start", true);
      request.send();
      status.textContent = "Launching...";
      butt.style.display = "none";
    }
  }

  function update_info() {
    fetch("/api/stats")
      .then((response) => response.json())
      .then((data) => {
        status.textContent = data["state"];
        if (data["state"] !== "Offline") {
          playercount.textContent = data["players"];
          version.textContent = data["version"];
          description.textContent = data["description"];
          maxplayers.textContent = data["max_players"];
          latency.textContent = data["latency"] + "ms";
          playerlist.innerHTML = Object.keys(data["player_names"])
            .map(
              (name) =>
                `<li>
              <img src="https://crafatar.com/avatars/${
                data["player_names"][name]
              }?overlay&size=80" alt="${name} avatar">
              <div>
              ${name.trim()}<input type="hidden" value="${
                  data["player_names"][name]
                }">
              </div></li>`
            )
            .join("");
          if (playerlist.innerHTML === ""){
            playerlist.style.visibility = "none";
          } else {
            playerlist.style.display = "block";
          }
          butt.style.display = "none";
        } else {
          playercount.textContent = "";
          version.textContent = "";
          description.textContent = "";
          maxplayers.textContent = "";
          latency.textContent = "";
          butt.style.display = "block";
          playerlist.style.display = "none";
        }
        if (status.textContent === "Launching...")
        {
          butt.style.display = "none";
        }
      });
  }
  update_info();
  setInterval(update_info, 10000);
});

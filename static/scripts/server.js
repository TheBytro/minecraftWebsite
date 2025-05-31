document.addEventListener("DOMContentLoaded", function() {
    const butt = document.getElementById("start-server")
    const status = document.getElementById("status")
    const playercount = document.getElementById("player-count")
    const version = document.getElementById("version")
    const description = document.getElementById("description")
    const maxplayers = document.getElementById("max-players")
    const latency = document.getElementById("latency")
    const playerlist = document.getElementById("player-list")

    butt.addEventListener("click", start_server)

    function start_server() {
        if (status.innerText === "Offline") {
            const request = new XMLHttpRequest()
            request.open("POST", "/start", true)
            request.send()
            status.innerText = "Launching..."
        }
    }

    function update_info(){
        fetch('/api/stats')
        .then(response => response.json())
        .then(data => {
            status.innerText = data['state'];
            if (data['state'] !== "Offline") {
                playercount.innerText = data['players'];
                version.innerText = data['version'];
                description.innerText = data['description'];
                maxplayers.innerText = data['max_players'];
                latency.innerText = data['latency'] + "ms";
                playerlist.innerText = data['player_names'];
            } else {
                playercount.innerText = "";
                version.innerText = "";
                description.innerText = "";
                maxplayers.innerText = "";
                latency.innerText = "";
                playerlist.innerText = "";
            }
            console.log(data)
        })
    }
    update_info()
    setInterval(update_info, 10000)
})
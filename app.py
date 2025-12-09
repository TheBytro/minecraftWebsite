"""
Khymari Sandy
"""
import subprocess

import requests
from mcstatus import JavaServer
import pygetwindow as gw
from flask import Flask, render_template, jsonify

app = Flask(__name__)

serverinfo = ["Server_IP", 25565]

@app.route('/')
def index():
    """Will render the homepage"""
    return render_template("index.html",info=serverinfo)

def get_server_info() -> dict:
    """Gets all the information needed about the server"""
    try:
        server = JavaServer(serverinfo[0], serverinfo[1])
        status = server.status()
        return {
            "state": "Running",
            "players": status.players.online,
            "max_players": status.players.max,
            "latency": str(round(status.latency, 2)),
            "version": status.version.name,
            "player_names": get_player_uuids(server.query().players.list),
            "description": status.raw["description"]["text"]
        }
    except Exception as e:
        print(e)
        return {
            "state": "Launching..." if is_minecraft_running() else "Offline",
            "error": str(e)
        }

def is_minecraft_running() -> bool:
    """Checks if the minecraft server CMD is running since it starts before the javac program"""
    if "Minecraft Server CMD" in gw.getAllTitles():
        return True
    return False

def get_player_uuids(players: list) -> dict:
    """Gets the uuids of all the players"""
    info = {}
    if players == []:
        return info
    players_info = requests.post("https://api.mojang.com/profiles/minecraft", json=players).json()
    for player in players_info:
        info[player["name"]] = player["id"]
    return info

@app.route('/start/', methods=['POST'])
def start() -> None:
    """Starts the minecraft server if the state is offline"""
    if get_server_info()["state"] == "Offline":
        subprocess.run(r"Path/To/Server/Start/.bat", shell=True,
                   cwd=r"Path/To/Server/Start")
    return None

@app.route('/api/stats')
def stats():
    """Gets the json object of the server info"""
    return jsonify(get_server_info())

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8475)

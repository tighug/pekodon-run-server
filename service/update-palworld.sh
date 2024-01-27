#!/bin/sh

# Paths
Steamcmd="/usr/games/steamcmd"
service_name="palworld-server.service"

echo "# Environment Check"
date

# Retrieve the current Build ID
OLD_Build=`$Steamcmd +login anonymous +app_status 2394010 +quit | grep -e "BuildID" | awk '{print $8}'`
echo "Current BuildID: $OLD_Build"

# Attempt to fetch the New Build ID using curl
NEW_Build=$(curl -s https://api.steamcmd.net/v1/info/2394010 | jq -r '.data["2394010"].depots.branches.public.buildid')

# Fallback to SteamCMD method if curl fails to retrieve data
if [ -z "$NEW_Build" ] || [ "$NEW_Build" = "null" ]; then
    echo "Failed to fetch New BuildID with curl. Resorting to SteamCMD."
    $Steamcmd +login anonymous +app_update 2394010 validate +quit > /dev/null
    NEW_Build=`$Steamcmd +login anonymous +app_status 2394010 +quit | grep -e "BuildID" | awk '{print $8}'`
fi

echo "Fetched New BuildID: $NEW_Build"

# Update the server if the Build IDs do not match
if [ "$OLD_Build" = "$NEW_Build" ]; then
    echo "No update required. Build numbers are identical."
else
    echo "# Updating the game server..."
    $Steamcmd +login anonymous +app_update 2394010 validate +quit > /dev/null
    echo "Game server updated successfully to BuildID: $NEW_Build"
    
    echo "Restart palworld-server.service because an game update exists."
    sudo systemctl restart palworld-server.service
    systemctl status palworld-server.service
fi

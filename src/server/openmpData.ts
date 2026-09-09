import { CompletionItem, CompletionItemKind } from "vscode-languageserver";

export interface OpenMpDocEntry {
  name: string;
  kind: "native" | "callback" | "constant" | "macro";
  signature: string;
  description: string;
  parameters?: { name: string; description: string }[];
  returns?: string;
  example?: string;
}

export const OPENMP_DOCS: OpenMpDocEntry[] = [
  // --- Core Player Natives ---
  {
    name: "SetPlayerPos",
    kind: "native",
    signature: "SetPlayerPos(playerid, Float:x, Float:y, Float:z)",
    description: "Sets the world coordinates of a player character.",
    parameters: [
      { name: "playerid", description: "The ID of the player to set position for." },
      { name: "Float:x", description: "The X coordinate." },
      { name: "Float:y", description: "The Y coordinate." },
      { name: "Float:z", description: "The Z coordinate." }
    ],
    returns: "1 on success, 0 on failure.",
    example: "SetPlayerPos(playerid, 1958.3783, 1343.1572, 15.3746);"
  },
  {
    name: "GetPlayerPos",
    kind: "native",
    signature: "GetPlayerPos(playerid, &Float:x, &Float:y, &Float:z)",
    description: "Retrieves the current world coordinates of a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player to get position from." },
      { name: "&Float:x", description: "Variable to store the X coordinate." },
      { name: "&Float:y", description: "Variable to store the Y coordinate." },
      { name: "&Float:z", description: "Variable to store the Z coordinate." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetPlayerFacingAngle",
    kind: "native",
    signature: "SetPlayerFacingAngle(playerid, Float:angle)",
    description: "Sets the facing angle (compass rotation) of a player character.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "Float:angle", description: "The rotation angle in degrees (0.0 - 360.0, 0 is North)." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerFacingAngle",
    kind: "native",
    signature: "GetPlayerFacingAngle(playerid, &Float:angle)",
    description: "Gets the facing angle (compass direction) of a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "&Float:angle", description: "Variable to store the angle." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetPlayerHealth",
    kind: "native",
    signature: "SetPlayerHealth(playerid, Float:health)",
    description: "Sets the health points of a player (0.0 to 100.0).",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "Float:health", description: "The new health value." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerHealth",
    kind: "native",
    signature: "GetPlayerHealth(playerid, &Float:health)",
    description: "Retrieves the current health points of a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "&Float:health", description: "Variable to store the health value." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetPlayerArmour",
    kind: "native",
    signature: "SetPlayerArmour(playerid, Float:armour)",
    description: "Sets the armour points of a player (0.0 to 100.0).",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "Float:armour", description: "The new armour value." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerArmour",
    kind: "native",
    signature: "GetPlayerArmour(playerid, &Float:armour)",
    description: "Retrieves the current armour points of a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "&Float:armour", description: "Variable to store the armour value." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetPlayerName",
    kind: "native",
    signature: "SetPlayerName(playerid, const name[])",
    description: "Changes the nickname of a connected player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "const name[]", description: "The new nickname (1 to MAX_PLAYER_NAME characters)." }
    ],
    returns: "1 on success, 0 on invalid name, -1 on failure."
  },
  {
    name: "GetPlayerName",
    kind: "native",
    signature: "GetPlayerName(playerid, const name[], max_len = sizeof(name))",
    description: "Gets the nickname of a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "const name[]", description: "Destination array to store the name." },
      { name: "max_len", description: "Maximum buffer size." }
    ],
    returns: "The length of the player's name."
  },
  {
    name: "SetPlayerColor",
    kind: "native",
    signature: "SetPlayerColor(playerid, color)",
    description: "Sets the RGBA color of a player's nametag and radar blip.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "color", description: "The color in RGBA hex format (e.g. 0xFF0000FF)." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerColor",
    kind: "native",
    signature: "GetPlayerColor(playerid)",
    description: "Gets the RGBA color of a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "The player's color as an integer, or 0 if not set."
  },
  {
    name: "SetPlayerSkin",
    kind: "native",
    signature: "SetPlayerSkin(playerid, skinid)",
    description: "Changes the character skin (model) of a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "skinid", description: "The GTA skin ID (0 - 311)." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerSkin",
    kind: "native",
    signature: "GetPlayerSkin(playerid)",
    description: "Returns the skin ID of a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "The skin ID."
  },
  {
    name: "GivePlayerMoney",
    kind: "native",
    signature: "GivePlayerMoney(playerid, money)",
    description: "Gives or takes money from a player's wallet.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "money", description: "Amount of cash to add (negative to subtract)." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerMoney",
    kind: "native",
    signature: "GetPlayerMoney(playerid)",
    description: "Returns the amount of money a player has.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "The player's money."
  },
  {
    name: "ResetPlayerMoney",
    kind: "native",
    signature: "ResetPlayerMoney(playerid)",
    description: "Resets the player's cash to $0.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetPlayerScore",
    kind: "native",
    signature: "SetPlayerScore(playerid, score)",
    description: "Sets the scoreboard score for a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "score", description: "The score value." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerScore",
    kind: "native",
    signature: "GetPlayerScore(playerid)",
    description: "Gets the scoreboard score of a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "The player's score."
  },
  {
    name: "SpawnPlayer",
    kind: "native",
    signature: "SpawnPlayer(playerid)",
    description: "Spawns a player into the game world based on their spawn info.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetSpawnInfo",
    kind: "native",
    signature: "SetSpawnInfo(playerid, team, skin, Float:x, Float:y, Float:z, Float:rotation, weapon1, weapon1_ammo, weapon2, weapon2_ammo, weapon3, weapon3_ammo)",
    description: "Configures spawn position, skin, team, and starting weapons for a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "team", description: "Team ID (NO_TEAM for none)." },
      { name: "skin", description: "Character skin ID." },
      { name: "Float:x", description: "Spawn X position." },
      { name: "Float:y", description: "Spawn Y position." },
      { name: "Float:z", description: "Spawn Z position." },
      { name: "Float:rotation", description: "Facing angle." },
      { name: "weapon1", description: "First weapon ID." },
      { name: "weapon1_ammo", description: "First weapon ammo." },
      { name: "weapon2", description: "Second weapon ID." },
      { name: "weapon2_ammo", description: "Second weapon ammo." },
      { name: "weapon3", description: "Third weapon ID." },
      { name: "weapon3_ammo", description: "Third weapon ammo." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "IsPlayerConnected",
    kind: "native",
    signature: "IsPlayerConnected(playerid)",
    description: "Checks if a given player ID is currently connected to the server.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "1 if connected, 0 otherwise."
  },
  {
    name: "IsPlayerSpawned",
    kind: "native",
    signature: "IsPlayerSpawned(playerid)",
    description: "Checks whether a player has completed spawn into the world (open.mp native).",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "true if spawned, false otherwise."
  },
  {
    name: "IsPlayerAdmin",
    kind: "native",
    signature: "IsPlayerAdmin(playerid)",
    description: "Checks if the player is logged in as an RCON administrator.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "1 if admin, 0 otherwise."
  },
  {
    name: "Kick",
    kind: "native",
    signature: "Kick(playerid)",
    description: "Kicks a player from the server immediately.",
    parameters: [
      { name: "playerid", description: "The ID of the player to kick." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "Ban",
    kind: "native",
    signature: "Ban(playerid)",
    description: "Bans a player from the server, preventing their IP from rejoining.",
    parameters: [
      { name: "playerid", description: "The ID of the player to ban." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "BanEx",
    kind: "native",
    signature: "BanEx(playerid, const reason[])",
    description: "Bans a player with a specified reason string logged to samp.ban.",
    parameters: [
      { name: "playerid", description: "The ID of the player to ban." },
      { name: "const reason[]", description: "Reason for the ban." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerIp",
    kind: "native",
    signature: "GetPlayerIp(playerid, const ip[], max_len = sizeof(ip))",
    description: "Retrieves the IP address of a connected player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "const ip[]", description: "Destination array." },
      { name: "max_len", description: "Buffer capacity." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerPing",
    kind: "native",
    signature: "GetPlayerPing(playerid)",
    description: "Returns the network ping of a player in milliseconds.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "Ping in milliseconds."
  },
  {
    name: "GetPlayerState",
    kind: "native",
    signature: "GetPlayerState(playerid)",
    description: "Returns the current state of a player (PLAYER_STATE_ONFOOT, PLAYER_STATE_DRIVER, etc.).",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "PLAYER_STATE_* constant."
  },
  {
    name: "SetPlayerInterior",
    kind: "native",
    signature: "SetPlayerInterior(playerid, interiorid)",
    description: "Sets the GTA interior world ID for a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "interiorid", description: "Interior ID (0 for outside world)." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerInterior",
    kind: "native",
    signature: "GetPlayerInterior(playerid)",
    description: "Gets the current interior ID of a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "Interior ID."
  },
  {
    name: "SetPlayerVirtualWorld",
    kind: "native",
    signature: "SetPlayerVirtualWorld(playerid, worldid)",
    description: "Sets the virtual world ID of a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "worldid", description: "Virtual world ID (0 is default)." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerVirtualWorld",
    kind: "native",
    signature: "GetPlayerVirtualWorld(playerid)",
    description: "Gets the virtual world ID of a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "Virtual world ID."
  },
  {
    name: "SetPlayerSpecialAction",
    kind: "native",
    signature: "SetPlayerSpecialAction(playerid, actionid)",
    description: "Applies a special action to a player (SPECIAL_ACTION_DUCK, SPECIAL_ACTION_USEJETPACK, etc.).",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "actionid", description: "SPECIAL_ACTION_* constant." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerSpecialAction",
    kind: "native",
    signature: "GetPlayerSpecialAction(playerid)",
    description: "Gets the active special action of a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "SPECIAL_ACTION_* constant."
  },
  {
    name: "TogglePlayerControllable",
    kind: "native",
    signature: "TogglePlayerControllable(playerid, toggle)",
    description: "Freezes or unfreezes a player's movement and controls.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "toggle", description: "0 to freeze, 1 to unfreeze." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetPlayerVelocity",
    kind: "native",
    signature: "SetPlayerVelocity(playerid, Float:x, Float:y, Float:z)",
    description: "Sets the physics velocity vector of a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "Float:x", description: "X velocity." },
      { name: "Float:y", description: "Y velocity." },
      { name: "Float:z", description: "Z velocity." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerVelocity",
    kind: "native",
    signature: "GetPlayerVelocity(playerid, &Float:x, &Float:y, &Float:z)",
    description: "Gets the physics velocity vector of a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "&Float:x", description: "Variable for X velocity." },
      { name: "&Float:y", description: "Variable for Y velocity." },
      { name: "&Float:z", description: "Variable for Z velocity." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetPlayerTime",
    kind: "native",
    signature: "SetPlayerTime(playerid, hour, minute)",
    description: "Sets the game clock time for an individual player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "hour", description: "Hour (0 - 23)." },
      { name: "minute", description: "Minute (0 - 59)." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerTime",
    kind: "native",
    signature: "GetPlayerTime(playerid, &hour, &minute)",
    description: "Gets the game clock time of a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "&hour", description: "Variable to store hour." },
      { name: "&minute", description: "Variable to store minute." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetPlayerWeather",
    kind: "native",
    signature: "SetPlayerWeather(playerid, weather)",
    description: "Sets the game weather ID for a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "weather", description: "Weather ID (0 - 45)." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetPlayerWantedLevel",
    kind: "native",
    signature: "SetPlayerWantedLevel(playerid, level)",
    description: "Sets the wanted star level of a player (0 to 6).",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "level", description: "Wanted level stars." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerWantedLevel",
    kind: "native",
    signature: "GetPlayerWantedLevel(playerid)",
    description: "Gets the wanted star level of a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "Wanted star level (0 - 6)."
  },
  {
    name: "SetPlayerChatBubble",
    kind: "native",
    signature: "SetPlayerChatBubble(playerid, const text[], color, Float:drawdistance, expiretime)",
    description: "Displays a floating text bubble above a player's character.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "const text[]", description: "The message to display." },
      { name: "color", description: "RGBA color." },
      { name: "Float:drawdistance", description: "Maximum view distance." },
      { name: "expiretime", description: "Duration in milliseconds." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "ApplyAnimation",
    kind: "native",
    signature: "ApplyAnimation(playerid, const animlib[], const animname[], Float:fDelta, loop, lockx, locky, freeze, time, forcesync = 0)",
    description: "Plays a GTA San Andreas animation on a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "const animlib[]", description: "Animation library name (e.g. 'PED')." },
      { name: "const animname[]", description: "Animation name (e.g. 'WALK_civi')." },
      { name: "Float:fDelta", description: "Animation speed/blend delta (usually 4.1)." },
      { name: "loop", description: "1 to loop continuously, 0 otherwise." },
      { name: "lockx", description: "1 to lock X position, 0 to allow forward motion." },
      { name: "locky", description: "1 to lock Y position." },
      { name: "freeze", description: "1 to freeze on the last animation frame." },
      { name: "time", description: "Duration in milliseconds (0 for infinite/loop)." },
      { name: "forcesync", description: "1 to force sync to other clients, 0 otherwise." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "ClearAnimations",
    kind: "native",
    signature: "ClearAnimations(playerid, forcesync = 0)",
    description: "Stops any animations currently executing on a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "forcesync", description: "1 to force sync to all players." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerAnimationIndex",
    kind: "native",
    signature: "GetPlayerAnimationIndex(playerid)",
    description: "Gets the animation index currently playing on the player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "Animation index, or 0 if none."
  },
  {
    name: "GetPlayerKeys",
    kind: "native",
    signature: "GetPlayerKeys(playerid, &keys, &updown, &leftright)",
    description: "Retrieves the currently pressed keys and movement axes.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "&keys", description: "Bitmask of active KEY_* constants." },
      { name: "&updown", description: "Up/Down analogue key status." },
      { name: "&leftright", description: "Left/Right analogue key status." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerPoolSize",
    kind: "native",
    signature: "GetPlayerPoolSize()",
    description: "Returns the highest active player ID on the server (recommended for looping over players).",
    returns: "Highest connected player ID, or -1 if no players are online.",
    example: "for (new i = 0, j = GetPlayerPoolSize(); i <= j; ++i)\n{\n    if (IsPlayerConnected(i)) { /* ... */ }\n}"
  },

  // --- Players: Weapons & Camera ---
  {
    name: "GivePlayerWeapon",
    kind: "native",
    signature: "GivePlayerWeapon(playerid, weaponid, ammo)",
    description: "Gives a weapon with ammo to a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "weaponid", description: "WEAPON_* constant (0 - 46)." },
      { name: "ammo", description: "Ammunition count." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "ResetPlayerWeapons",
    kind: "native",
    signature: "ResetPlayerWeapons(playerid)",
    description: "Removes all weapons and ammunition from a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetPlayerArmedWeapon",
    kind: "native",
    signature: "SetPlayerArmedWeapon(playerid, weaponid)",
    description: "Sets the currently held weapon for a player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "weaponid", description: "Weapon ID to hold." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerArmedWeapon",
    kind: "native",
    signature: "GetPlayerArmedWeapon(playerid)",
    description: "Gets the ID of the weapon currently held by the player.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "Weapon ID."
  },
  {
    name: "GetPlayerWeaponData",
    kind: "native",
    signature: "GetPlayerWeaponData(playerid, slot, &weapon, &ammo)",
    description: "Retrieves weapon ID and ammo for a given weapon slot.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "slot", description: "Weapon slot (0 - 12)." },
      { name: "&weapon", description: "Variable to store weapon ID." },
      { name: "&ammo", description: "Variable to store ammunition." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetPlayerCameraPos",
    kind: "native",
    signature: "SetPlayerCameraPos(playerid, Float:x, Float:y, Float:z)",
    description: "Sets the position of a player's camera in the game world.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "Float:x", description: "X coordinate." },
      { name: "Float:y", description: "Y coordinate." },
      { name: "Float:z", description: "Z coordinate." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetPlayerCameraLookAt",
    kind: "native",
    signature: "SetPlayerCameraLookAt(playerid, Float:x, Float:y, Float:z, cut = CAMERA_CUT)",
    description: "Directs the player's camera towards specific coordinates.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "Float:x", description: "Target X coordinate." },
      { name: "Float:y", description: "Target Y coordinate." },
      { name: "Float:z", description: "Target Z coordinate." },
      { name: "cut", description: "CAMERA_CUT or CAMERA_MOVE." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetCameraBehindPlayer",
    kind: "native",
    signature: "SetCameraBehindPlayer(playerid)",
    description: "Restores the camera view behind the player's character.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "InterpolateCameraPos",
    kind: "native",
    signature: "InterpolateCameraPos(playerid, Float:FromX, Float:FromY, Float:FromZ, Float:ToX, Float:ToY, Float:ToZ, time, cut = CAMERA_CUT)",
    description: "Smoothly interpolates camera position over time.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "Float:FromX", description: "Start X." },
      { name: "Float:FromY", description: "Start Y." },
      { name: "Float:FromZ", description: "Start Z." },
      { name: "Float:ToX", description: "Destination X." },
      { name: "Float:ToY", description: "Destination Y." },
      { name: "Float:ToZ", description: "Destination Z." },
      { name: "time", description: "Duration in milliseconds." },
      { name: "cut", description: "CAMERA_CUT or CAMERA_MOVE." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "InterpolateCameraLookAt",
    kind: "native",
    signature: "InterpolateCameraLookAt(playerid, Float:FromX, Float:FromY, Float:FromZ, Float:ToX, Float:ToY, Float:ToZ, time, cut = CAMERA_CUT)",
    description: "Smoothly rotates camera focus point over time.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "Float:FromX", description: "Start target X." },
      { name: "Float:FromY", description: "Start target Y." },
      { name: "Float:FromZ", description: "Start target Z." },
      { name: "Float:ToX", description: "Destination target X." },
      { name: "Float:ToY", description: "Destination target Y." },
      { name: "Float:ToZ", description: "Destination target Z." },
      { name: "time", description: "Duration in milliseconds." },
      { name: "cut", description: "CAMERA_CUT or CAMERA_MOVE." }
    ],
    returns: "1 on success, 0 on failure."
  },

  // --- Vehicles ---
  {
    name: "CreateVehicle",
    kind: "native",
    signature: "CreateVehicle(vehicletype, Float:x, Float:y, Float:z, Float:rotation, color1, color2, respawn_delay, addsiren = 0)",
    description: "Spawns a new vehicle in the game world.",
    parameters: [
      { name: "vehicletype", description: "Vehicle model ID (400 - 611)." },
      { name: "Float:x", description: "Spawn X position." },
      { name: "Float:y", description: "Spawn Y position." },
      { name: "Float:z", description: "Spawn Z position." },
      { name: "Float:rotation", description: "Facing rotation angle." },
      { name: "color1", description: "Primary color (-1 for random)." },
      { name: "color2", description: "Secondary color (-1 for random)." },
      { name: "respawn_delay", description: "Respawn delay in seconds when abandoned (-1 for none)." },
      { name: "addsiren", description: "1 to attach a siren to any vehicle." }
    ],
    returns: "The vehicle ID created (1 - MAX_VEHICLES), or INVALID_VEHICLE_ID on failure."
  },
  {
    name: "DestroyVehicle",
    kind: "native",
    signature: "DestroyVehicle(vehicleid)",
    description: "Destroys a spawned vehicle.",
    parameters: [
      { name: "vehicleid", description: "The ID of the vehicle to destroy." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetVehiclePos",
    kind: "native",
    signature: "GetVehiclePos(vehicleid, &Float:x, &Float:y, &Float:z)",
    description: "Gets the current coordinates of a vehicle.",
    parameters: [
      { name: "vehicleid", description: "The ID of the vehicle." },
      { name: "&Float:x", description: "Variable for X." },
      { name: "&Float:y", description: "Variable for Y." },
      { name: "&Float:z", description: "Variable for Z." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetVehiclePos",
    kind: "native",
    signature: "SetVehiclePos(vehicleid, Float:x, Float:y, Float:z)",
    description: "Sets the coordinates of a vehicle.",
    parameters: [
      { name: "vehicleid", description: "The ID of the vehicle." },
      { name: "Float:x", description: "X coordinate." },
      { name: "Float:y", description: "Y coordinate." },
      { name: "Float:z", description: "Z coordinate." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetVehicleZAngle",
    kind: "native",
    signature: "GetVehicleZAngle(vehicleid, &Float:z_angle)",
    description: "Gets the rotation angle of a vehicle.",
    parameters: [
      { name: "vehicleid", description: "The ID of the vehicle." },
      { name: "&Float:z_angle", description: "Variable to store angle." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetVehicleZAngle",
    kind: "native",
    signature: "SetVehicleZAngle(vehicleid, Float:z_angle)",
    description: "Sets the rotation angle of a vehicle.",
    parameters: [
      { name: "vehicleid", description: "The ID of the vehicle." },
      { name: "Float:z_angle", description: "Angle in degrees." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetVehicleParamsEx",
    kind: "native",
    signature: "SetVehicleParamsEx(vehicleid, engine, lights, alarm, doors, bonnet, boot, objective)",
    description: "Sets manual vehicle parameters (engine running, headlights, alarms, locked doors, opened trunk/bonnet).",
    parameters: [
      { name: "vehicleid", description: "The ID of the vehicle." },
      { name: "engine", description: "VEHICLE_PARAMS_OFF, ON, or UNSET." },
      { name: "lights", description: "Headlights status." },
      { name: "alarm", description: "Alarm status." },
      { name: "doors", description: "Door locks status." },
      { name: "bonnet", description: "Hood status." },
      { name: "boot", description: "Trunk status." },
      { name: "objective", description: "Objective status." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetVehicleParamsEx",
    kind: "native",
    signature: "GetVehicleParamsEx(vehicleid, &engine, &lights, &alarm, &doors, &bonnet, &boot, &objective)",
    description: "Gets manual vehicle parameters.",
    parameters: [
      { name: "vehicleid", description: "The ID of the vehicle." },
      { name: "&engine", description: "Engine status." },
      { name: "&lights", description: "Lights status." },
      { name: "&alarm", description: "Alarm status." },
      { name: "&doors", description: "Doors status." },
      { name: "&bonnet", description: "Bonnet status." },
      { name: "&boot", description: "Boot status." },
      { name: "&objective", description: "Objective status." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetVehicleHealth",
    kind: "native",
    signature: "SetVehicleHealth(vehicleid, Float:health)",
    description: "Sets the health points of a vehicle (1000.0 is full health, <= 250.0 is on fire).",
    parameters: [
      { name: "vehicleid", description: "The ID of the vehicle." },
      { name: "Float:health", description: "Health points." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetVehicleHealth",
    kind: "native",
    signature: "GetVehicleHealth(vehicleid, &Float:health)",
    description: "Gets the health points of a vehicle.",
    parameters: [
      { name: "vehicleid", description: "The ID of the vehicle." },
      { name: "&Float:health", description: "Variable to store health." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "RepairVehicle",
    kind: "native",
    signature: "RepairVehicle(vehicleid)",
    description: "Fully repairs visual vehicle damage and resets health to 1000.0.",
    parameters: [
      { name: "vehicleid", description: "The ID of the vehicle." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "PutPlayerInVehicle",
    kind: "native",
    signature: "PutPlayerInVehicle(playerid, vehicleid, seatid)",
    description: "Puts a player directly into a vehicle seat without entering animation.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "vehicleid", description: "The ID of the vehicle." },
      { name: "seatid", description: "Seat index (0 = driver, 1 = front passenger, 2 = back left, 3 = back right)." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "RemovePlayerFromVehicle",
    kind: "native",
    signature: "RemovePlayerFromVehicle(playerid)",
    description: "Removes a player from their vehicle immediately.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerVehicleID",
    kind: "native",
    signature: "GetPlayerVehicleID(playerid)",
    description: "Returns the ID of the vehicle the player is currently inside.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "Vehicle ID, or 0 if player is on foot."
  },
  {
    name: "GetPlayerVehicleSeat",
    kind: "native",
    signature: "GetPlayerVehicleSeat(playerid)",
    description: "Returns the seat index the player occupies in a vehicle.",
    parameters: [
      { name: "playerid", description: "The ID of the player." }
    ],
    returns: "Seat ID (0 for driver, 1+ for passenger), or -1 if not in a vehicle."
  },
  {
    name: "GetVehicleModel",
    kind: "native",
    signature: "GetVehicleModel(vehicleid)",
    description: "Gets the model ID (400 - 611) of a vehicle.",
    parameters: [
      { name: "vehicleid", description: "The ID of the vehicle." }
    ],
    returns: "Vehicle model ID, or 0 if vehicle does not exist."
  },
  {
    name: "IsValidVehicle",
    kind: "native",
    signature: "IsValidVehicle(vehicleid)",
    description: "Checks if a vehicle ID exists and is valid (open.mp & modern pawn).",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." }
    ],
    returns: "true if valid, false otherwise."
  },
  {
    name: "GetVehiclePoolSize",
    kind: "native",
    signature: "GetVehiclePoolSize()",
    description: "Returns the highest active vehicle ID created on the server.",
    returns: "Highest vehicle ID, or 0 if no vehicles exist."
  },

  // --- Objects ---
  {
    name: "CreateObject",
    kind: "native",
    signature: "CreateObject(modelid, Float:x, Float:y, Float:z, Float:rx, Float:ry, Float:rz, Float:DrawDistance = 0.0)",
    description: "Creates an object in the game world visible to all players.",
    parameters: [
      { name: "modelid", description: "GTA object model ID." },
      { name: "Float:x", description: "X coordinate." },
      { name: "Float:y", description: "Y coordinate." },
      { name: "Float:z", description: "Z coordinate." },
      { name: "Float:rx", description: "X rotation." },
      { name: "Float:ry", description: "Y rotation." },
      { name: "Float:rz", description: "Z rotation." },
      { name: "Float:DrawDistance", description: "Custom stream distance (0.0 for default)." }
    ],
    returns: "Object ID, or INVALID_OBJECT_ID on failure."
  },
  {
    name: "DestroyObject",
    kind: "native",
    signature: "DestroyObject(objectid)",
    description: "Destroys a global object.",
    parameters: [
      { name: "objectid", description: "The ID of the object." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "MoveObject",
    kind: "native",
    signature: "MoveObject(objectid, Float:X, Float:Y, Float:Z, Float:Speed, Float:RotX = -1000.0, Float:RotY = -1000.0, Float:RotZ = -1000.0)",
    description: "Moves an object towards target coordinates at a given speed.",
    parameters: [
      { name: "objectid", description: "The ID of the object." },
      { name: "Float:X", description: "Destination X." },
      { name: "Float:Y", description: "Destination Y." },
      { name: "Float:Z", description: "Destination Z." },
      { name: "Float:Speed", description: "Movement speed units/sec." },
      { name: "Float:RotX", description: "Target X rotation." },
      { name: "Float:RotY", description: "Target Y rotation." },
      { name: "Float:RotZ", description: "Target Z rotation." }
    ],
    returns: "Time taken in milliseconds to complete movement."
  },
  {
    name: "StopObject",
    kind: "native",
    signature: "StopObject(objectid)",
    description: "Stops an object that is currently moving.",
    parameters: [
      { name: "objectid", description: "The ID of the object." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetObjectMaterial",
    kind: "native",
    signature: "SetObjectMaterial(objectid, materialindex, modelid, const txdname[], const texturename[], materialcolor = 0)",
    description: "Replaces a texture on an object with another texture or tint color.",
    parameters: [
      { name: "objectid", description: "The ID of the object." },
      { name: "materialindex", description: "Material slot index (0 - 15)." },
      { name: "modelid", description: "Model ID providing the replacement texture." },
      { name: "const txdname[]", description: "TXD archive name." },
      { name: "const texturename[]", description: "Texture name." },
      { name: "materialcolor", description: "ARGB tint color (0 for no tint)." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetObjectMaterialText",
    kind: "native",
    signature: "SetObjectMaterialText(objectid, const text[], materialindex = 0, materialsize = OBJECT_MATERIAL_SIZE_256x128, const fontface[] = 'Arial', fontsize = 24, bold = 1, fontcolor = 0xFFFFFFFF, backcolor = 0, textalignment = 0)",
    description: "Renders custom dynamic text onto an object material surface.",
    parameters: [
      { name: "objectid", description: "The ID of the object." },
      { name: "const text[]", description: "The text string to render." },
      { name: "materialindex", description: "Material slot index (0 - 15)." },
      { name: "materialsize", description: "OBJECT_MATERIAL_SIZE_* constant." },
      { name: "const fontface[]", description: "Font name." },
      { name: "fontsize", description: "Font size in pixels." },
      { name: "bold", description: "1 for bold font." },
      { name: "fontcolor", description: "ARGB font color." },
      { name: "backcolor", description: "ARGB background color." },
      { name: "textalignment", description: "Text alignment (0=left, 1=center, 2=right)." }
    ],
    returns: "1 on success, 0 on failure."
  },

  // --- Actors (NPCs) ---
  {
    name: "CreateActor",
    kind: "native",
    signature: "CreateActor(modelid, Float:x, Float:y, Float:z, Float:rotation)",
    description: "Creates a static actor NPC.",
    parameters: [
      { name: "modelid", description: "Skin ID (0 - 311)." },
      { name: "Float:x", description: "X coordinate." },
      { name: "Float:y", description: "Y coordinate." },
      { name: "Float:z", description: "Z coordinate." },
      { name: "Float:rotation", description: "Facing angle." }
    ],
    returns: "Actor ID, or INVALID_ACTOR_ID on failure."
  },
  {
    name: "DestroyActor",
    kind: "native",
    signature: "DestroyActor(actorid)",
    description: "Destroys a spawned actor NPC.",
    parameters: [
      { name: "actorid", description: "The actor ID." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "ApplyActorAnimation",
    kind: "native",
    signature: "ApplyActorAnimation(actorid, const animlib[], const animname[], Float:fDelta, loop, lockx, locky, freeze, time)",
    description: "Plays an animation on an actor NPC.",
    parameters: [
      { name: "actorid", description: "The actor ID." },
      { name: "const animlib[]", description: "Animation library." },
      { name: "const animname[]", description: "Animation name." },
      { name: "Float:fDelta", description: "Animation speed." },
      { name: "loop", description: "1 to loop animation." },
      { name: "lockx", description: "1 to lock X axis." },
      { name: "locky", description: "1 to lock Y axis." },
      { name: "freeze", description: "1 to freeze on end." },
      { name: "time", description: "Time in ms (0 for infinite)." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "ClearActorAnimations",
    kind: "native",
    signature: "ClearActorAnimations(actorid)",
    description: "Stops playing animations on an actor.",
    parameters: [
      { name: "actorid", description: "The actor ID." }
    ],
    returns: "1 on success, 0 on failure."
  },

  // --- TextDraws & PlayerTextDraws ---
  {
    name: "TextDrawCreate",
    kind: "native",
    signature: "TextDrawCreate(Float:x, Float:y, const text[])",
    description: "Creates a global TextDraw visible to all players.",
    parameters: [
      { name: "Float:x", description: "X screen position (0.0 - 640.0)." },
      { name: "Float:y", description: "Y screen position (0.0 - 480.0)." },
      { name: "const text[]", description: "Text string to display." }
    ],
    returns: "TextDraw ID (Text:id), or Text:INVALID_TEXT_DRAW on failure."
  },
  {
    name: "TextDrawDestroy",
    kind: "native",
    signature: "TextDrawDestroy(Text:text)",
    description: "Destroys a global TextDraw.",
    parameters: [
      { name: "Text:text", description: "The TextDraw ID." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "TextDrawShowForPlayer",
    kind: "native",
    signature: "TextDrawShowForPlayer(playerid, Text:text)",
    description: "Shows a global TextDraw to a specific player.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "Text:text", description: "The TextDraw ID." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "TextDrawHideForPlayer",
    kind: "native",
    signature: "TextDrawHideForPlayer(playerid, Text:text)",
    description: "Hides a global TextDraw from a specific player.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "Text:text", description: "The TextDraw ID." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "TextDrawSetString",
    kind: "native",
    signature: "TextDrawSetString(Text:text, const string[])",
    description: "Updates the text content of a global TextDraw.",
    parameters: [
      { name: "Text:text", description: "The TextDraw ID." },
      { name: "const string[]", description: "The new text string." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "CreatePlayerTextDraw",
    kind: "native",
    signature: "CreatePlayerTextDraw(playerid, Float:x, Float:y, const text[])",
    description: "Creates a player-specific TextDraw with per-player memory.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "Float:x", description: "X screen coordinate." },
      { name: "Float:y", description: "Y screen coordinate." },
      { name: "const text[]", description: "Text content." }
    ],
    returns: "PlayerTextDraw ID (PlayerText:id)."
  },
  {
    name: "PlayerTextDrawDestroy",
    kind: "native",
    signature: "PlayerTextDrawDestroy(playerid, PlayerText:text)",
    description: "Destroys a player-specific TextDraw.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "PlayerText:text", description: "The player TextDraw ID." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "PlayerTextDrawShow",
    kind: "native",
    signature: "PlayerTextDrawShow(playerid, PlayerText:text)",
    description: "Displays a player-specific TextDraw to the player.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "PlayerText:text", description: "The player TextDraw ID." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "PlayerTextDrawHide",
    kind: "native",
    signature: "PlayerTextDrawHide(playerid, PlayerText:text)",
    description: "Hides a player-specific TextDraw from the player.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "PlayerText:text", description: "The player TextDraw ID." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "PlayerTextDrawSetString",
    kind: "native",
    signature: "PlayerTextDrawSetString(playerid, PlayerText:text, const string[])",
    description: "Updates the text content of a player-specific TextDraw.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "PlayerText:text", description: "The player TextDraw ID." },
      { name: "const string[]", description: "New text string." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SelectTextDraw",
    kind: "native",
    signature: "SelectTextDraw(playerid, hovercolor)",
    description: "Enables clickable mouse cursor for selecting TextDraws.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "hovercolor", description: "RGBA highlight color when hovering over selectable textdraws." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "CancelSelectTextDraw",
    kind: "native",
    signature: "CancelSelectTextDraw(playerid)",
    description: "Cancels TextDraw mouse selection mode.",
    parameters: [
      { name: "playerid", description: "The player ID." }
    ],
    returns: "1 on success, 0 on failure."
  },

  // --- Dialogs & Messages ---
  {
    name: "ShowPlayerDialog",
    kind: "native",
    signature: "ShowPlayerDialog(playerid, dialogid, style, const caption[], const info[], const button1[], const button2[])",
    description: "Displays a GUI modal dialog to the player.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "dialogid", description: "Unique dialog ID." },
      { name: "style", description: "DIALOG_STYLE_MSGBOX, INPUT, LIST, PASSWORD, TABLIST, etc." },
      { name: "const caption[]", description: "Dialog title." },
      { name: "const info[]", description: "Dialog body content." },
      { name: "const button1[]", description: "Primary button label." },
      { name: "const button2[]", description: "Secondary cancel button label." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetPlayerDialogID",
    kind: "native",
    signature: "GetPlayerDialogID(playerid)",
    description: "Gets the ID of the dialog currently active on the player screen (open.mp native).",
    parameters: [
      { name: "playerid", description: "The player ID." }
    ],
    returns: "Active dialog ID, or -1 if no dialog is open."
  },
  {
    name: "HidePlayerDialog",
    kind: "native",
    signature: "HidePlayerDialog(playerid)",
    description: "Hides and closes any dialog currently open on the player screen (open.mp native).",
    parameters: [
      { name: "playerid", description: "The player ID." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SendClientMessage",
    kind: "native",
    signature: "SendClientMessage(playerid, color, const message[])",
    description: "Sends a colored message in the chat box to an individual player.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "color", description: "RGBA color." },
      { name: "const message[]", description: "Message string (max 144 characters)." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SendClientMessageToAll",
    kind: "native",
    signature: "SendClientMessageToAll(color, const message[])",
    description: "Broadcasts a colored message in the chat box to all connected players.",
    parameters: [
      { name: "color", description: "RGBA color." },
      { name: "const message[]", description: "Message string." }
    ],
    returns: "1 on success, 0 on failure."
  },

  // --- 3D Text Labels & GangZones ---
  {
    name: "Create3DTextLabel",
    kind: "native",
    signature: "Create3DTextLabel(const text[], color, Float:x, Float:y, Float:z, Float:DrawDistance, virtualworld, testLOS = 0)",
    description: "Creates floating 3D text in the game world.",
    parameters: [
      { name: "const text[]", description: "The text to display." },
      { name: "color", description: "RGBA color." },
      { name: "Float:x", description: "X coordinate." },
      { name: "Float:y", description: "Y coordinate." },
      { name: "Float:z", description: "Z coordinate." },
      { name: "Float:DrawDistance", description: "View distance." },
      { name: "virtualworld", description: "Virtual world ID (-1 for all)." },
      { name: "testLOS", description: "1 to test line-of-sight against walls." }
    ],
    returns: "Text3D:id, or Text3D:INVALID_3DTEXT_ID on failure."
  },
  {
    name: "Delete3DTextLabel",
    kind: "native",
    signature: "Delete3DTextLabel(Text3D:id)",
    description: "Deletes a 3D text label.",
    parameters: [
      { name: "Text3D:id", description: "The label ID." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GangZoneCreate",
    kind: "native",
    signature: "GangZoneCreate(Float:minx, Float:miny, Float:maxx, Float:maxy)",
    description: "Creates a colored rectangular gangzone on the radar.",
    parameters: [
      { name: "Float:minx", description: "South-West X." },
      { name: "Float:miny", description: "South-West Y." },
      { name: "Float:maxx", description: "North-East X." },
      { name: "Float:maxy", description: "North-East Y." }
    ],
    returns: "Gangzone ID, or INVALID_GANG_ZONE on failure."
  },
  {
    name: "GangZoneShowForPlayer",
    kind: "native",
    signature: "GangZoneShowForPlayer(playerid, zone, color)",
    description: "Displays a gangzone on the map for a player.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "zone", description: "Gangzone ID." },
      { name: "color", description: "RGBA color." }
    ],
    returns: "1 on success, 0 on failure."
  },

  // --- Timers & Core ---
  {
    name: "SetTimer",
    kind: "native",
    signature: "SetTimer(const funcname[], interval, repeating)",
    description: "Sets a recurring or one-shot timer to call a public function.",
    parameters: [
      { name: "const funcname[]", description: "Name of the public callback." },
      { name: "interval", description: "Time interval in milliseconds." },
      { name: "repeating", description: "1 to repeat, 0 for single trigger." }
    ],
    returns: "Timer ID (can be cancelled with KillTimer)."
  },
  {
    name: "SetTimerEx",
    kind: "native",
    signature: "SetTimerEx(const funcname[], interval, repeating, const format[], {Float,_}:...)",
    description: "Sets a timer passing typed arguments to the callback.",
    parameters: [
      { name: "const funcname[]", description: "Name of the public callback." },
      { name: "interval", description: "Time interval in milliseconds." },
      { name: "repeating", description: "1 to repeat, 0 for single execution." },
      { name: "const format[]", description: "Format specifiers: 'i'/'d'=int, 'f'=float, 's'=string, 'b'=bool." },
      { name: "...", description: "Arguments matching the format string." }
    ],
    returns: "Timer ID."
  },
  {
    name: "KillTimer",
    kind: "native",
    signature: "KillTimer(timerid)",
    description: "Stops and removes a running timer.",
    parameters: [
      { name: "timerid", description: "The ID of the timer to stop." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetTickCount",
    kind: "native",
    signature: "GetTickCount()",
    description: "Returns the uptime in milliseconds since the machine started.",
    returns: "Millisecond tick count."
  },

  // --- Standard Callbacks ---
  {
    name: "OnGameModeInit",
    kind: "callback",
    signature: "public OnGameModeInit()",
    description: "Called when the gamemode script begins loading.",
    returns: "1 to acknowledge initialization."
  },
  {
    name: "OnGameModeExit",
    kind: "callback",
    signature: "public OnGameModeExit()",
    description: "Called when the gamemode shuts down or server restarts.",
    returns: "1 to acknowledge."
  },
  {
    name: "OnFilterScriptInit",
    kind: "callback",
    signature: "public OnFilterScriptInit()",
    description: "Called when a filterscript is loaded.",
    returns: "1 to acknowledge."
  },
  {
    name: "OnFilterScriptExit",
    kind: "callback",
    signature: "public OnFilterScriptExit()",
    description: "Called when a filterscript is unloaded.",
    returns: "1 to acknowledge."
  },
  {
    name: "OnPlayerConnect",
    kind: "callback",
    signature: "public OnPlayerConnect(playerid)",
    description: "Called when a player joins the server.",
    parameters: [
      { name: "playerid", description: "The ID of the player who connected." }
    ],
    returns: "1 to allow connection."
  },
  {
    name: "OnPlayerDisconnect",
    kind: "callback",
    signature: "public OnPlayerDisconnect(playerid, reason)",
    description: "Called when a player leaves the server.",
    parameters: [
      { name: "playerid", description: "The ID of the disconnected player." },
      { name: "reason", description: "0 = Timeout/Crash, 1 = Quit, 2 = Kick/Ban." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnPlayerSpawn",
    kind: "callback",
    signature: "public OnPlayerSpawn(playerid)",
    description: "Called when a player spawns into the game world.",
    parameters: [
      { name: "playerid", description: "The ID of the spawned player." }
    ],
    returns: "1 to spawn normally."
  },
  {
    name: "OnPlayerDeath",
    kind: "callback",
    signature: "public OnPlayerDeath(playerid, killerid, reason)",
    description: "Called when a player dies or is killed.",
    parameters: [
      { name: "playerid", description: "The ID of the player who died." },
      { name: "killerid", description: "The ID of the killer, or INVALID_PLAYER_ID." },
      { name: "reason", description: "Death weapon or damage reason ID." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnPlayerText",
    kind: "callback",
    signature: "public OnPlayerText(playerid, text[])",
    description: "Called when a player sends a chat message.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "text[]", description: "The chat message string." }
    ],
    returns: "1 to allow message broadcast, 0 to suppress standard chat."
  },
  {
    name: "OnPlayerCommandText",
    kind: "callback",
    signature: "public OnPlayerCommandText(playerid, cmdtext[])",
    description: "Called when a player enters a slash command (/command).",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "cmdtext[]", description: "The command string typed." }
    ],
    returns: "1 if the command was processed, 0 for unknown command message."
  },
  {
    name: "OnDialogResponse",
    kind: "callback",
    signature: "public OnDialogResponse(playerid, dialogid, response, listitem, inputtext[])",
    description: "Called when a player interacts with or closes a dialog.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "dialogid", description: "The ID of the dialog shown." },
      { name: "response", description: "1 for Button 1 (Submit), 0 for Button 2 (Cancel/ESC)." },
      { name: "listitem", description: "Index of selected item in lists (0-indexed)." },
      { name: "inputtext[]", description: "String entered in text box or selected row label." }
    ],
    returns: "1 to acknowledge dialog event."
  },
  {
    name: "OnPlayerEnterVehicle",
    kind: "callback",
    signature: "public OnPlayerEnterVehicle(playerid, vehicleid, ispassenger)",
    description: "Called when a player starts entering a vehicle.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "vehicleid", description: "The ID of the vehicle being entered." },
      { name: "ispassenger", description: "0 if entering as driver, 1 if passenger." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnPlayerExitVehicle",
    kind: "callback",
    signature: "public OnPlayerExitVehicle(playerid, vehicleid)",
    description: "Called when a player begins exiting a vehicle.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "vehicleid", description: "The ID of the vehicle being exited." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnPlayerStateChange",
    kind: "callback",
    signature: "public OnPlayerStateChange(playerid, PLAYER_STATE:newstate, PLAYER_STATE:oldstate)",
    description: "Called when a player changes state (e.g. onfoot to driver).",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "PLAYER_STATE:newstate", description: "The newly entered state." },
      { name: "PLAYER_STATE:oldstate", description: "The previous state." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnPlayerKeyStateChange",
    kind: "callback",
    signature: "public OnPlayerKeyStateChange(playerid, KEY:newkeys, KEY:oldkeys)",
    description: "Called when a player presses or releases a game key.",
    parameters: [
      { name: "playerid", description: "The ID of the player." },
      { name: "KEY:newkeys", description: "Bitmask of keys currently held." },
      { name: "KEY:oldkeys", description: "Bitmask of keys previously held." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnPlayerTakeDamage",
    kind: "callback",
    signature: "public OnPlayerTakeDamage(playerid, issuerid, Float:amount, WEAPON:weaponid, bodypart)",
    description: "Called when a player takes damage (calculated by damaged player's client).",
    parameters: [
      { name: "playerid", description: "The ID of the player who received damage." },
      { name: "issuerid", description: "The ID of the player who caused the damage, or INVALID_PLAYER_ID." },
      { name: "Float:amount", description: "Amount of damage received." },
      { name: "WEAPON:weaponid", description: "Weapon used." },
      { name: "bodypart", description: "BODY_PART_* hit." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnPlayerGiveDamage",
    kind: "callback",
    signature: "public OnPlayerGiveDamage(playerid, damagedid, Float:amount, WEAPON:weaponid, bodypart)",
    description: "Called when a player inflicts damage on another player (calculated by attacker).",
    parameters: [
      { name: "playerid", description: "The ID of the attacker." },
      { name: "damagedid", description: "The ID of the damaged player." },
      { name: "Float:amount", description: "Amount of damage dealt." },
      { name: "WEAPON:weaponid", description: "Weapon used." },
      { name: "bodypart", description: "BODY_PART_* hit." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnPlayerWeaponShot",
    kind: "callback",
    signature: "public OnPlayerWeaponShot(playerid, weaponid, hittype, hitid, Float:fX, Float:fY, Float:fZ)",
    description: "Called when a player fires a bullet from a firearm.",
    parameters: [
      { name: "playerid", description: "The ID of the player firing." },
      { name: "weaponid", description: "Weapon ID fired." },
      { name: "hittype", description: "BULLET_HIT_TYPE_NONE, PLAYER, VEHICLE, OBJECT." },
      { name: "hitid", description: "Target ID." },
      { name: "Float:fX", description: "Impact X offset." },
      { name: "Float:fY", description: "Impact Y offset." },
      { name: "Float:fZ", description: "Impact Z offset." }
    ],
    returns: "0 to prevent the bullet from dealing damage, 1 to allow."
  },
  {
    name: "OnPlayerClickPlayerTextDraw",
    kind: "callback",
    signature: "public OnPlayerClickPlayerTextDraw(playerid, PlayerText:playertextid)",
    description: "Called when a player clicks on a player-specific TextDraw with mouse cursor.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "PlayerText:playertextid", description: "The clicked player TextDraw ID." }
    ],
    returns: "1 if handled."
  },
  {
    name: "OnPlayerClickTextDraw",
    kind: "callback",
    signature: "public OnPlayerClickTextDraw(playerid, Text:clickedid)",
    description: "Called when a player clicks a global TextDraw or presses ESC (INVALID_TEXT_DRAW).",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "Text:clickedid", description: "Clicked TextDraw ID, or INVALID_TEXT_DRAW if ESC pressed." }
    ],
    returns: "1 if handled."
  },
  {
    name: "OnIncomingConnection",
    kind: "callback",
    signature: "public OnIncomingConnection(playerid, ip_address[], port)",
    description: "Called when an IP address attempts to connect to the server before player slot allocation.",
    parameters: [
      { name: "playerid", description: "Allocated connecting ID." },
      { name: "ip_address[]", description: "IP address of connector." },
      { name: "port", description: "Connection port." }
    ],
    returns: "1 to allow connection, 0 to reject."
  },

  // --- Common Constants ---
  {
    name: "MAX_PLAYERS",
    kind: "constant",
    signature: "#define MAX_PLAYERS (1000)",
    description: "Maximum number of player slots supported by the server."
  },
  {
    name: "MAX_VEHICLES",
    kind: "constant",
    signature: "#define MAX_VEHICLES (2000)",
    description: "Maximum number of vehicles that can exist simultaneously."
  },
  {
    name: "MAX_ACTORS",
    kind: "constant",
    signature: "#define MAX_ACTORS (1000)",
    description: "Maximum number of actor NPCs that can exist simultaneously."
  },
  {
    name: "MAX_OBJECTS",
    kind: "constant",
    signature: "#define MAX_OBJECTS (1000)",
    description: "Maximum number of global objects."
  },
  {
    name: "MAX_PLAYER_NAME",
    kind: "constant",
    signature: "#define MAX_PLAYER_NAME (24)",
    description: "Maximum character length of a player's nickname."
  },
  {
    name: "INVALID_PLAYER_ID",
    kind: "constant",
    signature: "#define INVALID_PLAYER_ID (0xFFFF)",
    description: "Represents an invalid or non-existent player ID (65535)."
  },
  {
    name: "INVALID_VEHICLE_ID",
    kind: "constant",
    signature: "#define INVALID_VEHICLE_ID (0xFFFF)",
    description: "Represents an invalid vehicle ID (65535)."
  },
  {
    name: "INVALID_ACTOR_ID",
    kind: "constant",
    signature: "#define INVALID_ACTOR_ID (0xFFFF)",
    description: "Represents an invalid actor ID (65535)."
  },
  {
    name: "INVALID_OBJECT_ID",
    kind: "constant",
    signature: "#define INVALID_OBJECT_ID (0xFFFF)",
    description: "Represents an invalid object ID."
  },
  {
    name: "INVALID_3DTEXT_ID",
    kind: "constant",
    signature: "#define INVALID_3DTEXT_ID (0xFFFF)",
    description: "Represents an invalid 3D text label ID."
  },
  {
    name: "INVALID_TEXT_DRAW",
    kind: "constant",
    signature: "#define INVALID_TEXT_DRAW (Text:0xFFFF)",
    description: "Returned when a player closes textdraw selection mode with ESC."
  },
  {
    name: "NO_TEAM",
    kind: "constant",
    signature: "#define NO_TEAM (255)",
    description: "Constant representing no team affiliation."
  },
  {
    name: "DIALOG_STYLE_MSGBOX",
    kind: "constant",
    signature: "#define DIALOG_STYLE_MSGBOX (0)",
    description: "Modal dialog style displaying text and up to two buttons."
  },
  {
    name: "DIALOG_STYLE_INPUT",
    kind: "constant",
    signature: "#define DIALOG_STYLE_INPUT (1)",
    description: "Modal dialog style with a single-line text input field."
  },
  {
    name: "DIALOG_STYLE_LIST",
    kind: "constant",
    signature: "#define DIALOG_STYLE_LIST (2)",
    description: "Modal dialog style with a scrollable list of items."
  },
  {
    name: "DIALOG_STYLE_PASSWORD",
    kind: "constant",
    signature: "#define DIALOG_STYLE_PASSWORD (3)",
    description: "Modal dialog style with a masked password input field."
  },
  {
    name: "DIALOG_STYLE_TABLIST",
    kind: "constant",
    signature: "#define DIALOG_STYLE_TABLIST (4)",
    description: "Modal dialog style with tab-separated column list."
  },
  {
    name: "DIALOG_STYLE_TABLIST_HEADERS",
    kind: "constant",
    signature: "#define DIALOG_STYLE_TABLIST_HEADERS (5)",
    description: "Modal dialog style with column headers and rows."
  },
  // --- Checkpoints ---
  {
    name: "SetPlayerCheckpoint",
    kind: "native",
    signature: "SetPlayerCheckpoint(playerid, Float:x, Float:y, Float:z, Float:size)",
    description: "Sets a red checkpoint marker on the map and world for a player.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "Float:x", description: "X position." },
      { name: "Float:y", description: "Y position." },
      { name: "Float:z", description: "Z position." },
      { name: "Float:size", description: "Checkpoint radius." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "DisablePlayerCheckpoint",
    kind: "native",
    signature: "DisablePlayerCheckpoint(playerid)",
    description: "Removes the active checkpoint from a player's screen.",
    parameters: [
      { name: "playerid", description: "The player ID." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "IsPlayerInCheckpoint",
    kind: "native",
    signature: "IsPlayerInCheckpoint(playerid)",
    description: "Checks if a player is currently standing inside their active checkpoint.",
    parameters: [
      { name: "playerid", description: "The player ID." }
    ],
    returns: "1 if inside, 0 otherwise."
  },
  {
    name: "SetPlayerRaceCheckpoint",
    kind: "native",
    signature: "SetPlayerRaceCheckpoint(playerid, type, Float:x, Float:y, Float:z, Float:nextx, Float:nexty, Float:nextz, Float:size)",
    description: "Sets a race checkpoint marker (normal, finish, air) with direction arrow to next point.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "type", description: "0=Normal, 1=Finish, 2=Nothing, 3=Air normal, 4=Air finish." },
      { name: "Float:x", description: "X coordinate." },
      { name: "Float:y", description: "Y coordinate." },
      { name: "Float:z", description: "Z coordinate." },
      { name: "Float:nextx", description: "Next point X." },
      { name: "Float:nexty", description: "Next point Y." },
      { name: "Float:nextz", description: "Next point Z." },
      { name: "Float:size", description: "Checkpoint diameter." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "DisablePlayerRaceCheckpoint",
    kind: "native",
    signature: "DisablePlayerRaceCheckpoint(playerid)",
    description: "Removes the active race checkpoint from a player's screen.",
    parameters: [
      { name: "playerid", description: "The player ID." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "IsPlayerInRaceCheckpoint",
    kind: "native",
    signature: "IsPlayerInRaceCheckpoint(playerid)",
    description: "Checks if a player is inside their active race checkpoint.",
    parameters: [
      { name: "playerid", description: "The player ID." }
    ],
    returns: "1 if inside, 0 otherwise."
  },

  // --- Vehicle Modding & Extensions ---
  {
    name: "AddVehicleComponent",
    kind: "native",
    signature: "AddVehicleComponent(vehicleid, componentid)",
    description: "Adds a tuning component (spoiler, hood, wheels, nitro, etc.) to a vehicle.",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." },
      { name: "componentid", description: "Component model ID (1000 - 1193)." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "RemoveVehicleComponent",
    kind: "native",
    signature: "RemoveVehicleComponent(vehicleid, componentid)",
    description: "Removes a tuning component from a vehicle.",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." },
      { name: "componentid", description: "Component model ID." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "ChangeVehicleColor",
    kind: "native",
    signature: "ChangeVehicleColor(vehicleid, color1, color2)",
    description: "Changes the primary and secondary colors of a vehicle.",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." },
      { name: "color1", description: "Primary color ID." },
      { name: "color2", description: "Secondary color ID." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "ChangeVehiclePaintjob",
    kind: "native",
    signature: "ChangeVehiclePaintjob(vehicleid, paintjobid)",
    description: "Applies a paintjob decal to a vehicle (0 - 2, or 3 to remove).",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." },
      { name: "paintjobid", description: "Paintjob ID." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "AttachTrailerToVehicle",
    kind: "native",
    signature: "AttachTrailerToVehicle(trailerid, vehicleid)",
    description: "Attaches a trailer vehicle to a cabin/truck vehicle.",
    parameters: [
      { name: "trailerid", description: "Trailer vehicle ID." },
      { name: "vehicleid", description: "Towing vehicle ID." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "DetachTrailerFromVehicle",
    kind: "native",
    signature: "DetachTrailerFromVehicle(vehicleid)",
    description: "Detaches any attached trailer from a vehicle.",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "IsTrailerAttachedToVehicle",
    kind: "native",
    signature: "IsTrailerAttachedToVehicle(vehicleid)",
    description: "Checks if a trailer is currently hitched to a vehicle.",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." }
    ],
    returns: "1 if attached, 0 otherwise."
  },
  {
    name: "GetVehicleTrailer",
    kind: "native",
    signature: "GetVehicleTrailer(vehicleid)",
    description: "Returns the ID of the trailer attached to a vehicle.",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." }
    ],
    returns: "Trailer vehicle ID, or 0 if none."
  },
  {
    name: "SetVehicleNumberPlate",
    kind: "native",
    signature: "SetVehicleNumberPlate(vehicleid, const numberplate[])",
    description: "Sets custom license plate text for a vehicle.",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." },
      { name: "const numberplate[]", description: "Plate text (max 32 characters)." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetVehicleVelocity",
    kind: "native",
    signature: "SetVehicleVelocity(vehicleid, Float:X, Float:Y, Float:Z)",
    description: "Sets the linear velocity vector of a vehicle.",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." },
      { name: "Float:X", description: "X velocity." },
      { name: "Float:Y", description: "Y velocity." },
      { name: "Float:Z", description: "Z velocity." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetVehicleVelocity",
    kind: "native",
    signature: "GetVehicleVelocity(vehicleid, &Float:X, &Float:Y, &Float:Z)",
    description: "Gets the linear velocity vector of a vehicle.",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." },
      { name: "&Float:X", description: "Variable for X velocity." },
      { name: "&Float:Y", description: "Variable for Y velocity." },
      { name: "&Float:Z", description: "Variable for Z velocity." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetVehicleAngularVelocity",
    kind: "native",
    signature: "SetVehicleAngularVelocity(vehicleid, Float:X, Float:Y, Float:Z)",
    description: "Sets the rotational angular velocity vector of a vehicle.",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." },
      { name: "Float:X", description: "X angular speed." },
      { name: "Float:Y", description: "Y angular speed." },
      { name: "Float:Z", description: "Z angular speed." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "SetVehicleToRespawn",
    kind: "native",
    signature: "SetVehicleToRespawn(vehicleid)",
    description: "Respawns a vehicle at its original creation spawn position.",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." }
    ],
    returns: "1 on success, 0 on failure."
  },

  // --- SQLite Database ---
  {
    name: "db_open",
    kind: "native",
    signature: "DB:db_open(const name[])",
    description: "Opens an SQLite database file located in the scriptfiles directory.",
    parameters: [
      { name: "const name[]", description: "Database filename." }
    ],
    returns: "DB handle, or DB:0 on failure."
  },
  {
    name: "db_close",
    kind: "native",
    signature: "db_close(DB:db)",
    description: "Closes an open SQLite database connection.",
    parameters: [
      { name: "DB:db", description: "Database handle." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "db_query",
    kind: "native",
    signature: "DBResult:db_query(DB:db, const query[])",
    description: "Executes an SQL query on an open SQLite database.",
    parameters: [
      { name: "DB:db", description: "Database handle." },
      { name: "const query[]", description: "SQL query string." }
    ],
    returns: "DBResult:result handle, or DBResult:0 on failure."
  },
  {
    name: "db_free_result",
    kind: "native",
    signature: "db_free_result(DBResult:result)",
    description: "Frees the allocated memory of an SQL query result.",
    parameters: [
      { name: "DBResult:result", description: "Query result handle." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "db_num_rows",
    kind: "native",
    signature: "db_num_rows(DBResult:result)",
    description: "Returns the number of rows returned by an SQL query.",
    parameters: [
      { name: "DBResult:result", description: "Query result handle." }
    ],
    returns: "Row count."
  },
  {
    name: "db_next_row",
    kind: "native",
    signature: "db_next_row(DBResult:result)",
    description: "Advances the result cursor to the next row in the result set.",
    parameters: [
      { name: "DBResult:result", description: "Query result handle." }
    ],
    returns: "1 if there is a next row, 0 when at the end."
  },
  {
    name: "db_get_field",
    kind: "native",
    signature: "db_get_field(DBResult:result, field, result_dest[], max_len = sizeof(result_dest))",
    description: "Retrieves column string by numeric column index from the current row.",
    parameters: [
      { name: "DBResult:result", description: "Query result handle." },
      { name: "field", description: "Column index (0-indexed)." },
      { name: "result_dest[]", description: "Destination string buffer." },
      { name: "max_len", description: "Buffer size." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "db_get_field_assoc",
    kind: "native",
    signature: "db_get_field_assoc(DBResult:result, const field[], result_dest[], max_len = sizeof(result_dest))",
    description: "Retrieves column string by column name from the current row.",
    parameters: [
      { name: "DBResult:result", description: "Query result handle." },
      { name: "const field[]", description: "Column name." },
      { name: "result_dest[]", description: "Destination string buffer." },
      { name: "max_len", description: "Buffer size." }
    ],
    returns: "1 on success, 0 on failure."
  },

  // --- General Core / String ---
  {
    name: "format",
    kind: "native",
    signature: "format(output[], len = sizeof(output), const format[], {Float,_}:...)",
    description: "Formats a string with specifiers (%d, %s, %f, %x, %b, %c) into an output array.",
    parameters: [
      { name: "output[]", description: "Destination character buffer." },
      { name: "len", description: "Maximum capacity." },
      { name: "const format[]", description: "Format string." },
      { name: "...", description: "Variable arguments." }
    ],
    returns: "The length of the formatted string."
  },
  {
    name: "print",
    kind: "native",
    signature: "print(const string[])",
    description: "Prints a plain text string to the server console and log file.",
    parameters: [
      { name: "const string[]", description: "String to print." }
    ],
    returns: "1 on success."
  },
  {
    name: "printf",
    kind: "native",
    signature: "printf(const format[], {Float,_}:...)",
    description: "Prints a formatted string to the server console and log file.",
    parameters: [
      { name: "const format[]", description: "Format string." },
      { name: "...", description: "Format arguments." }
    ],
    returns: "1 on success."
  },
  {
    name: "SendRconCommand",
    kind: "native",
    signature: "SendRconCommand(const command[])",
    description: "Sends an administrative command to the server console.",
    parameters: [
      { name: "const command[]", description: "RCON command string." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetMaxPlayers",
    kind: "native",
    signature: "GetMaxPlayers()",
    description: "Returns the maximum number of player slots configured in server config.",
    returns: "Maximum players limit."
  },

  // --- Extended Callbacks ---
  {
    name: "OnVehicleSpawn",
    kind: "callback",
    signature: "public OnVehicleSpawn(vehicleid)",
    description: "Called when a vehicle spawns or respawns at its home location.",
    parameters: [
      { name: "vehicleid", description: "The ID of the spawned vehicle." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnVehicleDeath",
    kind: "callback",
    signature: "public OnVehicleDeath(vehicleid, killerid)",
    description: "Called when a vehicle is destroyed or explodes.",
    parameters: [
      { name: "vehicleid", description: "The ID of the destroyed vehicle." },
      { name: "killerid", description: "The player ID who destroyed it, or INVALID_PLAYER_ID." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnPlayerRequestClass",
    kind: "callback",
    signature: "public OnPlayerRequestClass(playerid, classid)",
    description: "Called when a player selects or previews a skin on class selection.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "classid", description: "The skin/class index." }
    ],
    returns: "1 to allow class, 0 to reject."
  },
  {
    name: "OnPlayerRequestSpawn",
    kind: "callback",
    signature: "public OnPlayerRequestSpawn(playerid)",
    description: "Called when a player attempts to spawn by pressing the Spawn button.",
    parameters: [
      { name: "playerid", description: "The player ID." }
    ],
    returns: "1 to permit spawning, 0 to block."
  },
  {
    name: "OnPlayerEnterCheckpoint",
    kind: "callback",
    signature: "public OnPlayerEnterCheckpoint(playerid)",
    description: "Called when a player walks or drives into their active checkpoint.",
    parameters: [
      { name: "playerid", description: "The player ID." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnPlayerLeaveCheckpoint",
    kind: "callback",
    signature: "public OnPlayerLeaveCheckpoint(playerid)",
    description: "Called when a player exits their active checkpoint.",
    parameters: [
      { name: "playerid", description: "The player ID." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnPlayerEnterRaceCheckpoint",
    kind: "callback",
    signature: "public OnPlayerEnterRaceCheckpoint(playerid)",
    description: "Called when a player enters their active race checkpoint.",
    parameters: [
      { name: "playerid", description: "The player ID." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnPlayerLeaveRaceCheckpoint",
    kind: "callback",
    signature: "public OnPlayerLeaveRaceCheckpoint(playerid)",
    description: "Called when a player leaves their active race checkpoint.",
    parameters: [
      { name: "playerid", description: "The player ID." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnRconCommand",
    kind: "callback",
    signature: "public OnRconCommand(cmd[])",
    description: "Called when an RCON command is entered from the server console or in-game /rcon.",
    parameters: [
      { name: "cmd[]", description: "Command string entered." }
    ],
    returns: "1 if handled, 0 otherwise."
  },
  {
    name: "OnRconLoginAttempt",
    kind: "callback",
    signature: "public OnRconLoginAttempt(ip[], password[], success)",
    description: "Called when an IP attempts to log in as RCON administrator.",
    parameters: [
      { name: "ip[]", description: "IP of client." },
      { name: "password[]", description: "Password entered." },
      { name: "success", description: "1 if successful, 0 if incorrect password." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnObjectMoved",
    kind: "callback",
    signature: "public OnObjectMoved(objectid)",
    description: "Called when a global object finishes its MoveObject movement.",
    parameters: [
      { name: "objectid", description: "The object ID." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnPlayerObjectMoved",
    kind: "callback",
    signature: "public OnPlayerObjectMoved(playerid, objectid)",
    description: "Called when a player-object finishes its MovePlayerObject movement.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "objectid", description: "The player-object ID." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnPlayerPickUpPickup",
    kind: "callback",
    signature: "public OnPlayerPickUpPickup(playerid, pickupid)",
    description: "Called when a player walks over a pickup icon.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "pickupid", description: "The pickup ID." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnVehicleMod",
    kind: "callback",
    signature: "public OnVehicleMod(playerid, vehicleid, componentid)",
    description: "Called when a vehicle is tuned at a mod shop.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "vehicleid", description: "The vehicle ID." },
      { name: "componentid", description: "The component ID added." }
    ],
    returns: "1 to allow modification, 0 to reject and desync."
  },
  {
    name: "OnVehiclePaintjob",
    kind: "callback",
    signature: "public OnVehiclePaintjob(playerid, vehicleid, paintjobid)",
    description: "Called when a player changes their vehicle's paintjob decal at a mod shop.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "vehicleid", description: "The vehicle ID." },
      { name: "paintjobid", description: "Paintjob ID." }
    ],
    returns: "1 to allow, 0 to block."
  },
  {
    name: "OnVehicleRespray",
    kind: "callback",
    signature: "public OnVehicleRespray(playerid, vehicleid, color1, color2)",
    description: "Called when a player resprays their vehicle at Pay 'n' Spray or mod shop.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "vehicleid", description: "The vehicle ID." },
      { name: "color1", description: "Primary color ID." },
      { name: "color2", description: "Secondary color ID." }
    ],
    returns: "1 to allow, 0 to block."
  },
  {
    name: "OnPlayerClickMap",
    kind: "callback",
    signature: "public OnPlayerClickMap(playerid, Float:fX, Float:fY, Float:fZ)",
    description: "Called when a player places a target waypoint marker on the pause menu ESC map.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "Float:fX", description: "Marker X." },
      { name: "Float:fY", description: "Marker Y." },
      { name: "Float:fZ", description: "Estimated ground Z." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnPlayerClickPlayer",
    kind: "callback",
    signature: "public OnPlayerClickPlayer(playerid, clickedplayerid, source)",
    description: "Called when a player double-clicks on another player's row on the scoreboard (TAB).",
    parameters: [
      { name: "playerid", description: "The clicking player ID." },
      { name: "clickedplayerid", description: "The targeted player ID." },
      { name: "source", description: "CLICK_SOURCE_SCOREBOARD." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnTrailerUpdate",
    kind: "callback",
    signature: "public OnTrailerUpdate(playerid, vehicleid)",
    description: "Called when a player syncs updates for an attached trailer vehicle.",
    parameters: [
      { name: "playerid", description: "The driver player ID." },
      { name: "vehicleid", description: "The trailer vehicle ID." }
    ],
    returns: "1 to allow sync, 0 to cancel sync."
  },
  {
    name: "OnPlayerUpdate",
    kind: "callback",
    signature: "public OnPlayerUpdate(playerid)",
    description: "Called on every client network tick update (frequent, high-rate).",
    parameters: [
      { name: "playerid", description: "The player ID." }
    ],
    returns: "1 to sync update to other players, 0 to block sync."
  },
  {
    name: "OnPlayerStreamIn",
    kind: "callback",
    signature: "public OnPlayerStreamIn(playerid, forplayerid)",
    description: "Called when playerid streams into the visual range of forplayerid.",
    parameters: [
      { name: "playerid", description: "The player entering range." },
      { name: "forplayerid", description: "The player who now sees playerid." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnPlayerStreamOut",
    kind: "callback",
    signature: "public OnPlayerStreamOut(playerid, forplayerid)",
    description: "Called when playerid streams out of range of forplayerid.",
    parameters: [
      { name: "playerid", description: "The player leaving range." },
      { name: "forplayerid", description: "The player who no longer sees playerid." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnVehicleStreamIn",
    kind: "callback",
    signature: "public OnVehicleStreamIn(vehicleid, forplayerid)",
    description: "Called when a vehicle streams into range for a player.",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." },
      { name: "forplayerid", description: "The player ID." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnVehicleStreamOut",
    kind: "callback",
    signature: "public OnVehicleStreamOut(vehicleid, forplayerid)",
    description: "Called when a vehicle streams out of range for a player.",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." },
      { name: "forplayerid", description: "The player ID." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnActorStreamIn",
    kind: "callback",
    signature: "public OnActorStreamIn(actorid, forplayerid)",
    description: "Called when an actor NPC streams in for a player.",
    parameters: [
      { name: "actorid", description: "The actor ID." },
      { name: "forplayerid", description: "The player ID." }
    ],
    returns: "1 to acknowledge."
  },
  {
    name: "OnActorStreamOut",
    kind: "callback",
    signature: "public OnActorStreamOut(actorid, forplayerid)",
    description: "Called when an actor NPC streams out of range for a player.",
    parameters: [
      { name: "actorid", description: "The actor ID." },
      { name: "forplayerid", description: "The player ID." }
    ],
    returns: "1 to acknowledge."
  },

  // --- Extended open.mp Natives ---
  {
    name: "GetVehicleDriver",
    kind: "native",
    signature: "GetVehicleDriver(vehicleid)",
    description: "Gets the player ID of the driver in a vehicle (open.mp native).",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." }
    ],
    returns: "Driver player ID, or INVALID_PLAYER_ID if unoccupied."
  },
  {
    name: "GetVehiclePassenger",
    kind: "native",
    signature: "GetVehiclePassenger(vehicleid, seatid)",
    description: "Gets the player ID of a passenger occupying seatid (open.mp native).",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." },
      { name: "seatid", description: "Seat index (1 - max seats)." }
    ],
    returns: "Passenger player ID, or INVALID_PLAYER_ID."
  },
  {
    name: "GetVehicleColour",
    kind: "native",
    signature: "GetVehicleColour(vehicleid, &color1, &color2)",
    description: "Gets the primary and secondary colors of a vehicle (open.mp native).",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." },
      { name: "&color1", description: "Variable for primary color." },
      { name: "&color2", description: "Variable for secondary color." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "GetVehiclePaintjob",
    kind: "native",
    signature: "GetVehiclePaintjob(vehicleid)",
    description: "Gets the active paintjob decal ID of a vehicle (open.mp native).",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." }
    ],
    returns: "Paintjob ID, or 3 if none."
  },
  {
    name: "GetVehicleInterior",
    kind: "native",
    signature: "GetVehicleInterior(vehicleid)",
    description: "Gets the interior world ID a vehicle is linked to (open.mp native).",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." }
    ],
    returns: "Interior ID."
  },
  {
    name: "GetVehicleNumberPlate",
    kind: "native",
    signature: "GetVehicleNumberPlate(vehicleid, output[], max_len = sizeof(output))",
    description: "Gets the current license plate text of a vehicle (open.mp native).",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." },
      { name: "output[]", description: "Destination buffer." },
      { name: "max_len", description: "Buffer length." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "IsVehicleDead",
    kind: "native",
    signature: "IsVehicleDead(vehicleid)",
    description: "Checks if a vehicle has been destroyed and is waiting for respawn (open.mp native).",
    parameters: [
      { name: "vehicleid", description: "The vehicle ID." }
    ],
    returns: "true if destroyed, false otherwise."
  },
  {
    name: "GetPlayerCustomSkin",
    kind: "native",
    signature: "GetPlayerCustomSkin(playerid)",
    description: "Returns the custom skin ID assigned to a player in open.mp (open.mp native).",
    parameters: [
      { name: "playerid", description: "The player ID." }
    ],
    returns: "Custom skin ID."
  },
  {
    name: "SetPlayerCustomSkin",
    kind: "native",
    signature: "SetPlayerCustomSkin(playerid, skinid)",
    description: "Sets a custom server-side skin ID for open.mp clients (open.mp native).",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "skinid", description: "Custom skin model ID." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "IsPlayerUsingOfficialClient",
    kind: "native",
    signature: "IsPlayerUsingOfficialClient(playerid)",
    description: "Checks if the connected player is using the official open.mp client (open.mp native).",
    parameters: [
      { name: "playerid", description: "The player ID." }
    ],
    returns: "true if official client, false otherwise."
  },
  {
    name: "GetPlayerVersion",
    kind: "native",
    signature: "GetPlayerVersion(playerid, version[], max_len = sizeof(version))",
    description: "Retrieves the game client version string of a connected player.",
    parameters: [
      { name: "playerid", description: "The player ID." },
      { name: "version[]", description: "Destination array." },
      { name: "max_len", description: "Buffer length." }
    ],
    returns: "1 on success, 0 on failure."
  },

  // --- Weapon and Key Constants ---
  {
    name: "KEY_ACTION",
    kind: "constant",
    signature: "#define KEY_ACTION (1)",
    description: "Action key (Tab on PC foot, or Fire in vehicle)."
  },
  {
    name: "KEY_CROUCH",
    kind: "constant",
    signature: "#define KEY_CROUCH (2)",
    description: "Crouch key (C on foot, Horn in vehicle)."
  },
  {
    name: "KEY_FIRE",
    kind: "constant",
    signature: "#define KEY_FIRE (4)",
    description: "Fire key (Left Mouse Button on foot / Ctrl in vehicle)."
  },
  {
    name: "KEY_SPRINT",
    kind: "constant",
    signature: "#define KEY_SPRINT (8)",
    description: "Sprint key (Space on foot)."
  },
  {
    name: "KEY_SECONDARY_ATTACK",
    kind: "constant",
    signature: "#define KEY_SECONDARY_ATTACK (16)",
    description: "Secondary attack / enter vehicle key (Enter / F)."
  },
  {
    name: "KEY_JUMP",
    kind: "constant",
    signature: "#define KEY_JUMP (32)",
    description: "Jump key (Left Shift)."
  },
  {
    name: "KEY_LOOK_RIGHT",
    kind: "constant",
    signature: "#define KEY_LOOK_RIGHT (64)",
    description: "Look right key in vehicle (E)."
  },
  {
    name: "KEY_HANDBRAKE",
    kind: "constant",
    signature: "#define KEY_HANDBRAKE (128)",
    description: "Handbrake in vehicle / Aim weapon on foot (Space / RMB)."
  },
  {
    name: "KEY_LOOK_LEFT",
    kind: "constant",
    signature: "#define KEY_LOOK_LEFT (256)",
    description: "Look left key in vehicle (Q)."
  },
  {
    name: "KEY_SUBMISSION",
    kind: "constant",
    signature: "#define KEY_SUBMISSION (512)",
    description: "Submission / Horn / 2 key."
  },
  {
    name: "KEY_LOOK_BEHIND",
    kind: "constant",
    signature: "#define KEY_LOOK_BEHIND (512)",
    description: "Look behind key on foot (Middle Mouse Button)."
  },
  {
    name: "KEY_WALK",
    kind: "constant",
    signature: "#define KEY_WALK (1024)",
    description: "Slow walk key (Left Alt)."
  },
  {
    name: "KEY_YES",
    kind: "constant",
    signature: "#define KEY_YES (65536)",
    description: "Conversation Yes key (Y)."
  },
  {
    name: "KEY_NO",
    kind: "constant",
    signature: "#define KEY_NO (131072)",
    description: "Conversation No key (N)."
  },
  {
    name: "KEY_CTRL_BACK",
    kind: "constant",
    signature: "#define KEY_CTRL_BACK (262144)",
    description: "Conversation Cancel / H key."
  },
  {
    name: "PLAYER_STATE_NONE",
    kind: "constant",
    signature: "#define PLAYER_STATE_NONE (0)",
    description: "Player is not yet connected or spawned."
  },
  {
    name: "PLAYER_STATE_ONFOOT",
    kind: "constant",
    signature: "#define PLAYER_STATE_ONFOOT (1)",
    description: "Player is on foot."
  },
  {
    name: "PLAYER_STATE_DRIVER",
    kind: "constant",
    signature: "#define PLAYER_STATE_DRIVER (2)",
    description: "Player is driving a vehicle."
  },
  {
    name: "PLAYER_STATE_PASSENGER",
    kind: "constant",
    signature: "#define PLAYER_STATE_PASSENGER (3)",
    description: "Player is a passenger inside a vehicle."
  },
  {
    name: "PLAYER_STATE_WASTED",
    kind: "constant",
    signature: "#define PLAYER_STATE_WASTED (7)",
    description: "Player is dead / wasted."
  },
  {
    name: "PLAYER_STATE_SPAWNED",
    kind: "constant",
    signature: "#define PLAYER_STATE_SPAWNED (8)",
    description: "Player has spawned."
  },
  {
    name: "PLAYER_STATE_SPECTATING",
    kind: "constant",
    signature: "#define PLAYER_STATE_SPECTATING (9)",
    description: "Player is spectating."
  },
  {
    name: "BODY_PART_TORSO",
    kind: "constant",
    signature: "#define BODY_PART_TORSO (3)",
    description: "Body hit part: Torso / Chest."
  },
  {
    name: "BODY_PART_GROIN",
    kind: "constant",
    signature: "#define BODY_PART_GROIN (4)",
    description: "Body hit part: Groin."
  },
  {
    name: "BODY_PART_LEFT_ARM",
    kind: "constant",
    signature: "#define BODY_PART_LEFT_ARM (5)",
    description: "Body hit part: Left arm."
  },
  {
    name: "BODY_PART_RIGHT_ARM",
    kind: "constant",
    signature: "#define BODY_PART_RIGHT_ARM (6)",
    description: "Body hit part: Right arm."
  },
  {
    name: "BODY_PART_LEFT_LEG",
    kind: "constant",
    signature: "#define BODY_PART_LEFT_LEG (7)",
    description: "Body hit part: Left leg."
  },
  {
    name: "BODY_PART_RIGHT_LEG",
    kind: "constant",
    signature: "#define BODY_PART_RIGHT_LEG (8)",
    description: "Body hit part: Right leg."
  },
  {
    name: "BODY_PART_HEAD",
    kind: "constant",
    signature: "#define BODY_PART_HEAD (9)",
    description: "Body hit part: Head."
  }
];

// Pre-computed maps and completion list
const openmpDocMap: Map<string, OpenMpDocEntry> = new Map();
const openmpDocMapLower: Map<string, OpenMpDocEntry> = new Map();
const openmpCompletions: CompletionItem[] = [];

for (const entry of OPENMP_DOCS) {
  openmpDocMap.set(entry.name, entry);
  openmpDocMapLower.set(entry.name.toLowerCase(), entry);

  let completionKind: CompletionItemKind = CompletionItemKind.Function;
  if (entry.kind === "callback") {
    completionKind = CompletionItemKind.Interface;
  } else if (entry.kind === "constant") {
    completionKind = CompletionItemKind.Constant;
  } else if (entry.kind === "macro") {
    completionKind = CompletionItemKind.Snippet;
  }

  const item: CompletionItem = {
    label: entry.name,
    kind: completionKind,
    detail: entry.signature,
    documentation: {
      kind: "markdown",
      value: [
        "```pawn",
        entry.signature,
        "```",
        "---",
        entry.description,
        ...(entry.parameters && entry.parameters.length > 0
          ? ["\n**Parameters:**", ...entry.parameters.map((p) => `- \`${p.name}\`: ${p.description}`)]
          : []),
        ...(entry.returns ? [`\n**Returns:** ${entry.returns}`] : []),
        ...(entry.example ? [`\n**Example:**\n\`\`\`pawn\n${entry.example}\n\`\`\``] : [])
      ].join("\n")
    },
    insertText: entry.name
  };

  openmpCompletions.push(item);
}

export function getOpenMpDoc(name: string): OpenMpDocEntry | undefined {
  return openmpDocMap.get(name) || openmpDocMapLower.get(name.toLowerCase());
}

export function getOpenMpCompletionItems(): CompletionItem[] {
  return openmpCompletions;
}

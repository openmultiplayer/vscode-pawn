import { CompletionItem, CompletionItemKind } from "vscode-languageserver";

export interface YsiDocEntry {
  name: string;
  package: "y_ini" | "y_hooks" | "y_users" | "y_messages" | "y_timers" | "y_commands" | "y_iterate" | "y_groups" | "y_va" | "y_core";
  kind: "function" | "macro" | "callback" | "constant" | "keyword";
  signature: string;
  description: string;
  parameters?: { name: string; description: string }[];
  returns?: string;
  example?: string;
}

export const YSI_DOCS: YsiDocEntry[] = [
  // ==========================================
  // y_ini (Advanced INI configuration & storage)
  // ==========================================
  {
    name: "INI_Open",
    package: "y_ini",
    kind: "function",
    signature: "INI_Open(const filename[])",
    description: "Opens an INI file for reading or writing. Returns an INI file handle.",
    parameters: [
      { name: "const filename[]", description: "Path to the INI file relative to scriptfiles." }
    ],
    returns: "INI tag handle (INI:handle) or INI_NO_FILE on error.",
    example: "new INI:file = INI_Open(\"users/player.ini\");\nif (file != INI_NO_FILE) {\n    INI_WriteString(file, \"password\", \"secret\");\n    INI_Close(file);\n}"
  },
  {
    name: "INI_Close",
    package: "y_ini",
    kind: "function",
    signature: "INI_Close(INI:file)",
    description: "Closes an open INI file and flushes any pending writes to disk.",
    parameters: [
      { name: "INI:file", description: "The INI handle returned by INI_Open." }
    ],
    returns: "1 on success, 0 on failure.",
    example: "INI_Close(file);"
  },
  {
    name: "INI_ParseFile",
    package: "y_ini",
    kind: "function",
    signature: "INI_ParseFile(const filename[], const remoteFunction[], bool:loadTags = false, bool:passExtra = false, extra = 0, bool:bFile = true, bool:bPassTag = false)",
    description: "Parses an entire INI file and dispatches key-value pairs to named handler functions.",
    parameters: [
      { name: "const filename[]", description: "Path to the INI file to parse." },
      { name: "const remoteFunction[]", description: "Name prefix of the handler callback (e.g. 'load_data_%s')." },
      { name: "bool:loadTags", description: "Whether to parse specific tags/sections." },
      { name: "bool:passExtra", description: "Whether to pass the extra argument to the parser." },
      { name: "extra", description: "Optional extra integer data passed to the callback (e.g. playerid)." }
    ],
    returns: "1 if parsed successfully, 0 if file could not be opened.",
    example: "INI_ParseFile(\"settings.ini\", \"LoadSettings_%s\");"
  },
  {
    name: "INI_String",
    package: "y_ini",
    kind: "function",
    signature: "INI_String(const name[], dest[], size = sizeof (dest))",
    description: "Reads a string value from the current INI tag block into destination buffer.",
    parameters: [
      { name: "const name[]", description: "Name of the key to parse." },
      { name: "dest[]", description: "Destination string array." },
      { name: "size", description: "Maximum buffer length (defaults to sizeof dest)." }
    ],
    returns: "1 on match, 0 otherwise.",
    example: "INI_String(\"username\", PlayerData[playerid][pName], MAX_PLAYER_NAME);"
  },
  {
    name: "INI_Int",
    package: "y_ini",
    kind: "function",
    signature: "INI_Int(const name[], &dest)",
    description: "Reads an integer value from the current INI tag block into destination variable.",
    parameters: [
      { name: "const name[]", description: "Name of the key to parse." },
      { name: "&dest", description: "Destination integer variable (passed by reference)." }
    ],
    returns: "1 on match, 0 otherwise.",
    example: "INI_Int(\"score\", PlayerData[playerid][pScore]);"
  },
  {
    name: "INI_Float",
    package: "y_ini",
    kind: "function",
    signature: "INI_Float(const name[], &Float:dest)",
    description: "Reads a floating-point value from current INI tag into destination variable.",
    parameters: [
      { name: "const name[]", description: "Name of the key to parse." },
      { name: "&Float:dest", description: "Destination Float variable (passed by reference)." }
    ],
    returns: "1 on match, 0 otherwise.",
    example: "INI_Float(\"health\", PlayerData[playerid][pHealth]);"
  },
  {
    name: "INI_Hex",
    package: "y_ini",
    kind: "function",
    signature: "INI_Hex(const name[], &dest)",
    description: "Reads a hexadecimal value from current INI tag into destination integer variable.",
    parameters: [
      { name: "const name[]", description: "Name of the key to parse." },
      { name: "&dest", description: "Destination variable for parsed hex value." }
    ],
    returns: "1 on match, 0 otherwise."
  },
  {
    name: "INI_Bin",
    package: "y_ini",
    kind: "function",
    signature: "INI_Bin(const name[], &dest)",
    description: "Reads a binary literal value from current INI tag into destination variable.",
    parameters: [
      { name: "const name[]", description: "Name of the key to parse." },
      { name: "&dest", description: "Destination variable for binary value." }
    ],
    returns: "1 on match, 0 otherwise."
  },
  {
    name: "INI_Bool",
    package: "y_ini",
    kind: "function",
    signature: "INI_Bool(const name[], &bool:dest)",
    description: "Reads a boolean value ('true', 'false', '1', '0') from current INI tag.",
    parameters: [
      { name: "const name[]", description: "Name of the key to parse." },
      { name: "&bool:dest", description: "Destination boolean variable." }
    ],
    returns: "1 on match, 0 otherwise.",
    example: "INI_Bool(\"admin\", PlayerData[playerid][pIsAdmin]);"
  },
  {
    name: "INI_WriteString",
    package: "y_ini",
    kind: "function",
    signature: "INI_WriteString(INI:file, const name[], const value[])",
    description: "Writes a string key-value pair to the open INI file.",
    parameters: [
      { name: "INI:file", description: "Open INI file handle." },
      { name: "const name[]", description: "Key name." },
      { name: "const value[]", description: "String value to write." }
    ],
    returns: "1 on success, 0 on failure.",
    example: "INI_WriteString(file, \"name\", \"JohnDoe\");"
  },
  {
    name: "INI_WriteInt",
    package: "y_ini",
    kind: "function",
    signature: "INI_WriteInt(INI:file, const name[], value)",
    description: "Writes an integer key-value pair to the open INI file.",
    parameters: [
      { name: "INI:file", description: "Open INI file handle." },
      { name: "const name[]", description: "Key name." },
      { name: "value", description: "Integer value to write." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "INI_WriteFloat",
    package: "y_ini",
    kind: "function",
    signature: "INI_WriteFloat(INI:file, const name[], Float:value)",
    description: "Writes a floating-point key-value pair to the open INI file.",
    parameters: [
      { name: "INI:file", description: "Open INI file handle." },
      { name: "const name[]", description: "Key name." },
      { name: "Float:value", description: "Float value to write." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "INI_SetTag",
    package: "y_ini",
    kind: "function",
    signature: "INI_SetTag(INI:file, const tag[])",
    description: "Sets the active section tag `[section]` in the open INI file for subsequent writes.",
    parameters: [
      { name: "INI:file", description: "Open INI file handle." },
      { name: "const tag[]", description: "Section name header." }
    ],
    returns: "1 on success, 0 on failure.",
    example: "INI_SetTag(file, \"Account\");"
  },
  {
    name: "INI_RemoveEntry",
    package: "y_ini",
    kind: "function",
    signature: "INI_RemoveEntry(INI:file, const name[])",
    description: "Removes a key-value entry from the current section of an INI file.",
    parameters: [
      { name: "INI:file", description: "Open INI file handle." },
      { name: "const name[]", description: "Key name to remove." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "INI_Load",
    package: "y_ini",
    kind: "macro",
    signature: "INI_Load:tag(playerid, name[], value[])",
    description: "y_ini section loader macro declaration for parsing specific INI section tags.",
    parameters: [
      { name: "tag", description: "The section identifier name to listen for." }
    ],
    example: "INI_Load:User[data](playerid, name[], value[]) {\n    INI_Int(\"score\", PlayerScore[playerid]);\n    return 1;\n}"
  },

  // ==========================================
  // y_hooks (Modular callback hook system)
  // ==========================================
  {
    name: "hook",
    package: "y_hooks",
    kind: "keyword",
    signature: "hook CallbackName(parameters)",
    description: "Hooks an existing Pawn callback or function modularly without overriding or chaining conflicts.",
    parameters: [
      { name: "CallbackName", description: "The standard callback to hook (e.g. OnPlayerConnect, OnGameModeInit)." }
    ],
    example: "hook OnPlayerConnect(playerid) {\n    SendClientMessage(playerid, -1, \"Welcome to the server!\");\n    return 1;\n}"
  },
  {
    name: "HOOK__",
    package: "y_hooks",
    kind: "macro",
    signature: "HOOK__[priority] CallbackName(parameters)",
    description: "Internal hook macro with explicit priority ordering.",
    parameters: [
      { name: "priority", description: "Numeric priority level determining execution order." }
    ]
  },
  {
    name: "HOOK_METHOD",
    package: "y_hooks",
    kind: "macro",
    signature: "HOOK_METHOD",
    description: "Specifies hook dispatch method (inline, stub, or direct call table).",
    parameters: []
  },
  {
    name: "HOOK_GLOBAL",
    package: "y_hooks",
    kind: "macro",
    signature: "HOOK_GLOBAL",
    description: "Hooks a global function across all included libraries."
  },

  // ==========================================
  // y_users (Advanced user account management)
  // ==========================================
  {
    name: "User_Set",
    package: "y_users",
    kind: "function",
    signature: "User_Set(playerid, const key[], value)",
    description: "Stores an integer data field into player's active y_users profile.",
    parameters: [
      { name: "playerid", description: "ID of the target player." },
      { name: "const key[]", description: "Field identifier key." },
      { name: "value", description: "Integer value to store." }
    ],
    returns: "1 on success, 0 on failure.",
    example: "User_Set(playerid, \"level\", 5);"
  },
  {
    name: "User_Get",
    package: "y_users",
    kind: "function",
    signature: "User_Get(playerid, const key[])",
    description: "Retrieves an integer data field from player's active y_users profile.",
    parameters: [
      { name: "playerid", description: "ID of the target player." },
      { name: "const key[]", description: "Field identifier key." }
    ],
    returns: "The stored integer value, or 0 if not found.",
    example: "new level = User_Get(playerid, \"level\");"
  },
  {
    name: "User_SetString",
    package: "y_users",
    kind: "function",
    signature: "User_SetString(playerid, const key[], const value[])",
    description: "Stores a string property in the player's y_users profile.",
    parameters: [
      { name: "playerid", description: "ID of target player." },
      { name: "const key[]", description: "Property name." },
      { name: "const value[]", description: "String value to store." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "User_GetString",
    package: "y_users",
    kind: "function",
    signature: "User_GetString(playerid, const key[], dest[], size = sizeof (dest))",
    description: "Retrieves a stored string property from player's y_users profile.",
    parameters: [
      { name: "playerid", description: "ID of target player." },
      { name: "const key[]", description: "Property name." },
      { name: "dest[]", description: "Buffer to receive the string." },
      { name: "size", description: "Maximum buffer capacity." }
    ],
    returns: "Length of string copied."
  },
  {
    name: "User_Login",
    package: "y_users",
    kind: "function",
    signature: "User_Login(playerid, const password[])",
    description: "Validates player's credentials and authenticates session in y_users.",
    parameters: [
      { name: "playerid", description: "Target player ID." },
      { name: "const password[]", description: "Input password to verify." }
    ],
    returns: "User_Success, User_BadPassword, or User_NoSuchUser.",
    example: "if (User_Login(playerid, \"password123\") == User_Success) {\n    SendClientMessage(playerid, -1, \"Logged in successfully!\");\n}"
  },
  {
    name: "User_Register",
    package: "y_users",
    kind: "function",
    signature: "User_Register(playerid, const password[])",
    description: "Creates a new user profile record with encrypted password hash.",
    parameters: [
      { name: "playerid", description: "Target player ID." },
      { name: "const password[]", description: "Password to store." }
    ],
    returns: "1 on success, 0 on failure."
  },
  {
    name: "User_IsLoggedIn",
    package: "y_users",
    kind: "function",
    signature: "User_IsLoggedIn(playerid)",
    description: "Checks whether a player has completed authentication via y_users.",
    parameters: [
      { name: "playerid", description: "Player ID to verify." }
    ],
    returns: "true if logged in, false otherwise.",
    example: "if (!User_IsLoggedIn(playerid)) return SendClientMessage(playerid, -1, \"Please log in first!\");"
  },
  {
    name: "User_Save",
    package: "y_users",
    kind: "function",
    signature: "User_Save(playerid)",
    description: "Forces immediate disk persistence of player's profile data.",
    parameters: [
      { name: "playerid", description: "Player ID whose data to flush." }
    ],
    returns: "1 on success, 0 on failure."
  },

  // ==========================================
  // y_messages & text localization
  // ==========================================
  {
    name: "Text_Send",
    package: "y_messages",
    kind: "function",
    signature: "Text_Send(playerid, const message[], GLOBAL_TAG_TYPES:...)",
    description: "Sends a formatted, multi-lingual, or color-coded message using YSI message engine.",
    parameters: [
      { name: "playerid", description: "Target player ID or ALL_PLAYERS." },
      { name: "const message[]", description: "Text identifier or format string." },
      { name: "...", description: "Optional format arguments." }
    ],
    returns: "1 on success, 0 on failure.",
    example: "Text_Send(playerid, $WELCOME_MSG, playerid);"
  },
  {
    name: "Message_Format",
    package: "y_messages",
    kind: "function",
    signature: "Message_Format(dest[], size = sizeof (dest), Language:lang, const message[], GLOBAL_TAG_TYPES:...)",
    description: "Formats a multi-lingual message for a given language into destination buffer.",
    parameters: [
      { name: "dest[]", description: "Destination buffer." },
      { name: "size", description: "Buffer size." },
      { name: "Language:lang", description: "Target language tag." },
      { name: "const message[]", description: "Message identifier or template." }
    ]
  },
  {
    name: "YSI_SendClientMessage",
    package: "y_messages",
    kind: "function",
    signature: "YSI_SendClientMessage(playerid, color, const message[])",
    description: "Extended SendClientMessage supporting inline color tokens ($HEX) and automatic wrapping.",
    parameters: [
      { name: "playerid", description: "Target player ID." },
      { name: "color", description: "Base text color." },
      { name: "const message[]", description: "Text content." }
    ]
  },
  {
    name: "Text_Add",
    package: "y_messages",
    kind: "function",
    signature: "Text_Add(const name[], const text[], Language:lang = NO_LANGUAGE)",
    description: "Registers a multi-lingual translation string in y_messages dictionary.",
    parameters: [
      { name: "const name[]", description: "Unique message identifier key." },
      { name: "const text[]", description: "Translated string content." },
      { name: "Language:lang", description: "Associated language." }
    ]
  },

  // ==========================================
  // y_timers (Tasks, repeaters & deferred timers)
  // ==========================================
  {
    name: "task",
    package: "y_timers",
    kind: "keyword",
    signature: "task TaskName[interval]()",
    description: "Declares a recurring background server task that runs every `interval` milliseconds automatically.",
    parameters: [
      { name: "TaskName", description: "Name of the task." },
      { name: "interval", description: "Timer frequency in milliseconds." }
    ],
    example: "task ServerPing[1000]() {\n    // Runs once every second\n    printf(\"Server tick...\");\n}"
  },
  {
    name: "ptask",
    package: "y_timers",
    kind: "keyword",
    signature: "ptask PlayerTaskName[interval](playerid)",
    description: "Declares a recurring per-player task running every `interval` milliseconds for connected players.",
    parameters: [
      { name: "PlayerTaskName", description: "Name of player task." },
      { name: "interval", description: "Timer frequency in milliseconds." },
      { name: "playerid", description: "Iterator variable containing connected player ID." }
    ],
    example: "ptask UpdateRadar[500](playerid) {\n    // Executes every 500ms for each active player\n}"
  },
  {
    name: "timer",
    package: "y_timers",
    kind: "keyword",
    signature: "timer TimerName[interval](parameters)",
    description: "Declares a standard YSI timer callback function to be called via `defer` or `repeat`.",
    parameters: [
      { name: "TimerName", description: "Name of the timer callback function." },
      { name: "interval", description: "Default timer interval in milliseconds." },
      { name: "parameters", description: "Arguments passed to timer." }
    ],
    example: "timer RespawnVehicle[5000](vehicleid) {\n    SetVehicleToRespawn(vehicleid);\n}"
  },
  {
    name: "defer",
    package: "y_timers",
    kind: "keyword",
    signature: "defer TimerName(arguments)",
    description: "Schedules a one-shot execution of a `timer` callback after its declared interval.",
    parameters: [
      { name: "TimerName", description: "Timer function declared with `timer`." },
      { name: "arguments", description: "Values matching timer function parameters." }
    ],
    example: "defer RespawnVehicle(myVehicleId);"
  },
  {
    name: "repeat",
    package: "y_timers",
    kind: "keyword",
    signature: "repeat TimerName(arguments)",
    description: "Schedules an indefinite recurring execution of a `timer` callback. Returns a Timer handle.",
    parameters: [
      { name: "TimerName", description: "Timer callback to repeat." },
      { name: "arguments", description: "Values matching timer function parameters." }
    ],
    returns: "Timer:handle to stop via `stop handle;`.",
    example: "new Timer:t = repeat CheckZone(playerid);"
  },
  {
    name: "stop",
    package: "y_timers",
    kind: "keyword",
    signature: "stop timer_handle",
    description: "Stops an actively running recurring timer handle.",
    parameters: [
      { name: "timer_handle", description: "Timer handle returned by `repeat`." }
    ],
    example: "stop myTimerHandle;"
  },

  // ==========================================
  // y_commands (High-speed command processor)
  // ==========================================
  {
    name: "YCMD",
    package: "y_commands",
    kind: "macro",
    signature: "YCMD:commandname(playerid, params[], help)",
    description: "Declares a command handler in YSI's high-speed command dispatch system.",
    parameters: [
      { name: "commandname", description: "Name of the command." },
      { name: "playerid", description: "Player who entered the command." },
      { name: "params[]", description: "Remainder of arguments passed as string." },
      { name: "help", description: "1 if invoked via /help commandname, 0 otherwise." }
    ],
    returns: "1 on success, 0 on failure.",
    example: "YCMD:teleport(playerid, params[], help) {\n    if (help) return SendClientMessage(playerid, -1, \"Teleports to spawn.\");\n    SetPlayerPos(playerid, 0.0, 0.0, 3.0);\n    return 1;\n}"
  },
  {
    name: "Command_Add",
    package: "y_commands",
    kind: "function",
    signature: "Command_Add(const command[], const functionName[])",
    description: "Dynamically registers an alternate command alias pointing to a handler function.",
    parameters: [
      { name: "const command[]", description: "Command alias name." },
      { name: "const functionName[]", description: "Destination function name." }
    ]
  },
  {
    name: "Command_SetDeniedReturn",
    package: "y_commands",
    kind: "function",
    signature: "Command_SetDeniedReturn(bool:returnVal)",
    description: "Configures the return value sent to the client when a command is rejected by permissions.",
    parameters: [
      { name: "bool:returnVal", description: "Return value (usually 0 or 1)." }
    ]
  },

  // ==========================================
  // y_iterate (High-performance Foreach iteration)
  // ==========================================
  {
    name: "foreach",
    package: "y_iterate",
    kind: "macro",
    signature: "foreach (new var : IteratorName)",
    description: "Iterates rapidly through active entities without scanning empty array slots.",
    parameters: [
      { name: "var", description: "New variable declared for iteration index." },
      { name: "IteratorName", description: "Iterator collection (e.g. Player, Bot, Vehicle, CustomIterator)." }
    ],
    example: "foreach (new i : Player) {\n    SendClientMessage(i, -1, \"Hello everyone!\");\n}"
  },
  {
    name: "Iter_Add",
    package: "y_iterate",
    kind: "function",
    signature: "Iter_Add(Iterator:name, value)",
    description: "Adds an index or entity value to an active Iterator collection.",
    parameters: [
      { name: "Iterator:name", description: "Iterator array name." },
      { name: "value", description: "Value/index to add to iterator." }
    ]
  },
  {
    name: "Iter_Remove",
    package: "y_iterate",
    kind: "function",
    signature: "Iter_Remove(Iterator:name, value)",
    description: "Removes an item from an active Iterator collection.",
    parameters: [
      { name: "Iterator:name", description: "Iterator array name." },
      { name: "value", description: "Value/index to remove." }
    ]
  },
  {
    name: "Iter_Contains",
    package: "y_iterate",
    kind: "function",
    signature: "Iter_Contains(Iterator:name, value)",
    description: "Checks whether a value is currently in an Iterator collection.",
    parameters: [
      { name: "Iterator:name", description: "Iterator array name." },
      { name: "value", description: "Value to check." }
    ],
    returns: "true if present, false otherwise."
  },
  {
    name: "Iter_Count",
    package: "y_iterate",
    kind: "function",
    signature: "Iter_Count(Iterator:name)",
    description: "Returns the current number of elements registered inside an Iterator.",
    parameters: [
      { name: "Iterator:name", description: "Iterator array name." }
    ],
    returns: "Element count as integer."
  },
  {
    name: "Iter_Clear",
    package: "y_iterate",
    kind: "function",
    signature: "Iter_Clear(IteratorArray:name[])",
    description: "Empties and resets an Iterator collection.",
    parameters: [
      { name: "IteratorArray:name[]", description: "Iterator to empty." }
    ]
  },

  // ==========================================
  // y_groups (Permissions & group access)
  // ==========================================
  {
    name: "Group_Create",
    package: "y_groups",
    kind: "function",
    signature: "Group_Create(const name[] = \"\")",
    description: "Creates a new player permission group.",
    parameters: [
      { name: "const name[]", description: "Optional name label for group." }
    ],
    returns: "Group:groupid handle.",
    example: "new Group:gAdmin = Group_Create(\"Admins\");"
  },
  {
    name: "Group_AddPlayer",
    package: "y_groups",
    kind: "function",
    signature: "Group_AddPlayer(Group:g, playerid)",
    description: "Adds a player to a permission group.",
    parameters: [
      { name: "Group:g", description: "Group handle." },
      { name: "playerid", description: "Target player ID." }
    ]
  },
  {
    name: "Group_RemovePlayer",
    package: "y_groups",
    kind: "function",
    signature: "Group_RemovePlayer(Group:g, playerid)",
    description: "Removes a player from a permission group.",
    parameters: [
      { name: "Group:g", description: "Group handle." },
      { name: "playerid", description: "Target player ID." }
    ]
  },
  {
    name: "Group_SetGlobal",
    package: "y_groups",
    kind: "function",
    signature: "Group_SetGlobal(Group:g, bool:status)",
    description: "Toggles whether an entire group has global access permissions by default.",
    parameters: [
      { name: "Group:g", description: "Group handle." },
      { name: "bool:status", description: "true for allow, false for deny." }
    ]
  },

  // ==========================================
  // y_va (Variable argument utilities)
  // ==========================================
  {
    name: "va_SendClientMessage",
    package: "y_va",
    kind: "function",
    signature: "va_SendClientMessage(playerid, color, const fmat[], GLOBAL_TAG_TYPES:...)",
    description: "Sends a formatted client message directly using variable arguments (like printf).",
    parameters: [
      { name: "playerid", description: "Target player ID." },
      { name: "color", description: "Hex color." },
      { name: "const fmat[]", description: "Format string specifier." },
      { name: "...", description: "Format values." }
    ],
    example: "va_SendClientMessage(playerid, -1, \"Player %s scored %d points!\", name, score);"
  },
  {
    name: "va_SendClientMessageToAll",
    package: "y_va",
    kind: "function",
    signature: "va_SendClientMessageToAll(color, const fmat[], GLOBAL_TAG_TYPES:...)",
    description: "Broadcasts a formatted message to all connected players.",
    parameters: [
      { name: "color", description: "Hex color." },
      { name: "const fmat[]", description: "Format string specifier." },
      { name: "...", description: "Format values." }
    ]
  },
  {
    name: "va_format",
    package: "y_va",
    kind: "function",
    signature: "va_format(dest[], size = sizeof (dest), const fmat[], va_args<>)",
    description: "Formats a string using variable arguments received by an enclosing function.",
    parameters: [
      { name: "dest[]", description: "Destination string buffer." },
      { name: "size", description: "Buffer size." },
      { name: "const fmat[]", description: "Format template string." },
      { name: "va_args<>", description: "Variable argument offset position." }
    ]
  },
  {
    name: "va_return",
    package: "y_va",
    kind: "macro",
    signature: "va_return(const fmat[], GLOBAL_TAG_TYPES:...)",
    description: "Directly returns a formatted string from a function without declaring a temporary buffer.",
    parameters: [
      { name: "const fmat[]", description: "Format template." },
      { name: "...", description: "Format parameters." }
    ]
  }
];

// Pre-index dictionaries
const ysiDocMap = new Map<string, YsiDocEntry>();
const ysiDocMapLower = new Map<string, YsiDocEntry>();
const ysiCompletions: CompletionItem[] = [];

for (const entry of YSI_DOCS) {
  ysiDocMap.set(entry.name, entry);
  ysiDocMapLower.set(entry.name.toLowerCase(), entry);

  let kind: CompletionItemKind = CompletionItemKind.Function;
  if (entry.kind === "macro") kind = CompletionItemKind.Snippet;
  else if (entry.kind === "keyword") kind = CompletionItemKind.Keyword;
  else if (entry.kind === "constant") kind = CompletionItemKind.Constant;

  const item: CompletionItem = {
    label: entry.name,
    kind,
    detail: `[YSI ${entry.package}] ${entry.signature}`,
    documentation: {
      kind: "markdown",
      value: [
        `**YSI Library:** \`${entry.package}\``,
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

  ysiCompletions.push(item);
}

export function getYsiDoc(name: string): YsiDocEntry | undefined {
  return ysiDocMap.get(name) || ysiDocMapLower.get(name.toLowerCase());
}

export function getYsiCompletionItems(): CompletionItem[] {
  return ysiCompletions;
}

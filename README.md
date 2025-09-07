[![](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/samp)  [![](https://img.shields.io/badge/website-000000?style=for-the-badge&logo=About.me&logoColor=white)](https://open.mp)

# pawn-development

VS-Code extension for Pawn language  
Originally created by [Indian Ocean Roleplay™ (samarmeena)](https://github.com/samarmeena)


# Features
- Go To Definition
- Hover Definition
- Parameter Helper
- Syntax Highlighting
- Auto Code Completion
- Custom Inline Snippets
- Format Document
- Format Selection
- VSCode Regions
- Generate Numbers


# Define Custom Snippet Anywhere
You can define two types of snippet  
\*Note: second type support autocompletion of parameters.

```
//#snippet new_cmd CMD:cmd_name(playerid, const params[]) {\n\treturn 1;\n}

//#function CreateCar(vehicleid, Float:posX, Float:posY, Float:posZ);
```

![](https://github.com/openmultiplayer/vscode-pawn/blob/master/assets/snippet.gif)

# Usage of .pawnignore
Right click on on your files to add to .pawnignore, this way you'll tell extension not to parse these files for auto-complete and intellisense.  
\*Note: syntax works exactly like `.gitignore`.

![](https://github.com/openmultiplayer/vscode-pawn/blob/master/assets/pawnignore.gif)

# Installation
Search for "Pawn Development" in the vscode extensions section and install it.  
Alternatively, you can check out the source code or view the marketplace page:

- [GitHub Page](https://github.com/openmultiplayer/vscode-pawn)
- [Marketplace Page](https://marketplace.visualstudio.com/items?itemName=openmp.pawn-development)


## Creating `tasks.json`
Press `Ctrl + Shift + P` or F1 and then type **>Initialize Pawn Build Task**


## Explanation
- `"command": "${workspaceRoot}/pawno/pawncc.exe",` is the important part here,
this is the path to your Pawn compiler and I've assumed most of you have a
left-over `pawno` folder from that long dead text editor! This folder not only
contains Pawno but also the Pawn code compiler (`pawncc.exe`). You can safely
delete `pawno.exe` forever.

- `"args": [...],` is also important, this is where you define the arguments
passed to the compiler. Pawno also did this but you might not have known. The
defaults have always been `-;+` to force semicolon usage and `-(+` to force
brackets in statements.  
If you store your Pawn compiler elsewhere, just replace the entire `command`
setting with the full path to your compiler.  
Also, if you want to disable debug symbols (you won't be able to use
crashdetect) just remove `-d3` from `"args"`.

- `problemMatcher` is the part that allows recognising the Pawn compiler output
and presenting it in the `problems` panel of the editor. This doesn't work well
with external includes because the paths change from relative to absolute.


## Define single gamemode file that always compile on build task
1. goto .vscode/tasks.json
2. replace `${relativeFile}` with `${workspaceRoot}\\gamemodes\\mygamemode.pwn`
3. all done


## Compiling Pawn Code
To actually compile after you've set up the `tasks.json` below, press
`CTRL + Shift + B` (Windows) or `CMD + Shift + B` (Mac), or alternatively open up the
command palette with `CTRL + Shift + P` (Windows) or `CMD + Shift + P` (Mac) and type
`Run Task`, hit enter and select `build-normal`.

export const task = `{
	"version": "2.0.0",
	"tasks": [
		{
			"label": "build-normal",
			"type": "shell",
			"command": "pawncc",
			"runOptions": {
				"instanceLimit": 1
			},
			"args": [
				"\${file}",
				"-D\${fileDirname}",
				"'-;+'",
				"'-(+'",
				"'-d3'"
			],
			"group": {
				"kind": "build",
				"isDefault": true
			},
			"isBackground": false,
			"presentation": {
				"reveal": "always",
				"panel": "dedicated"
			},
			"problemMatcher": "$pawncc"
		}
	]
}`;

export const task = `{
	"version": "2.0.0",
	"tasks": [
		{
			"label": "build-normal",
			"type": "shell",
			"command": "pawncc",
			"runOptions": {
				"instanceLimit": 1,
			},
			"args": [
				"\${relativeFile}",
				"-Dgamemodes",
				"\"-;+\"",
				"\"-(+\"",
				"\"-d3\""
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
			"problemMatcher": {
				"owner": "pawn",
				"fileLocation": [
					"relative",
					"\${workspaceRoot}"
				],
				"pattern": {
					"regexp": "^(.*?)\\\\(([0-9]*)[- 0-9]*\\\\) \\\\: (fatal error|error|warning) [0-9]*\\\\: (.*)$",
					"file": 1,
					"location": 2,
					"severity": 3,
					"message": 4
				}
			}
		}
	],
}`;

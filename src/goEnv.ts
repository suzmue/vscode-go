/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------*/

'use strict';

import path = require('path');
import vscode = require('vscode');
import { getGoConfig } from './config';
import { getCurrentGoPath, getToolsGopath, resolvePath } from './util';

// toolInstallationEnvironment returns the environment in which tools should
// be installed. It always returns a new object.
export function toolInstallationEnvironment(): NodeJS.Dict<string> {
	const env = newEnvironment();

	// If the go.toolsGopath is set, use its value as the GOPATH for `go` processes.
	// Else use the Current Gopath
	let toolsGopath = getToolsGopath();
	if (toolsGopath) {
		// User has explicitly chosen to use toolsGopath, so ignore GOBIN.
		env['GOBIN'] = '';
	} else {
		toolsGopath = getCurrentGoPath();
	}
	if (!toolsGopath) {
		const msg = 'Cannot install Go tools. Set either go.gopath or go.toolsGopath in settings.';
		vscode.window.showInformationMessage(msg, 'Open User Settings', 'Open Workspace Settings').then((selected) => {
			switch (selected) {
				case 'Open User Settings':
					vscode.commands.executeCommand('workbench.action.openGlobalSettings');
					break;
				case 'Open Workspace Settings':
					vscode.commands.executeCommand('workbench.action.openWorkspaceSettings');
					break;
			}
		});
		return;
	}
	env['GOPATH'] = toolsGopath;

	// Unset env vars that would affect tool build process: 'GOROOT', 'GOOS', 'GOARCH', ...
	// Tool installation should be done for the host OS/ARCH (GOHOSTOS/GOHOSTARCH) with
	// the default setup.
	delete env['GOOS'];
	delete env['GOARCH'];
	delete env['GOROOT'];
	delete env['GOFLAGS'];
	delete env['GOENV'];

	return env;
}

// toolExecutionEnvironment returns the environment in which tools should
// be executed. It always returns a new object.
export function toolExecutionEnvironment(uri?: vscode.Uri): NodeJS.Dict<string> {
	const env = newEnvironment();
	const gopath = getCurrentGoPath(uri);
	if (gopath) {
		env['GOPATH'] = gopath;
	}
	return env;
}

function newEnvironment(): NodeJS.Dict<string> {
	const toolsEnvVars = getGoConfig()['toolsEnvVars'];
	const env = Object.assign({}, process.env, toolsEnvVars);
	if (toolsEnvVars && typeof toolsEnvVars === 'object') {
		Object.keys(toolsEnvVars).forEach(
			(key) =>
				(env[key] =
					typeof toolsEnvVars[key] === 'string' ? resolvePath(toolsEnvVars[key]) : toolsEnvVars[key])
		);
	}

	// The http.proxy setting takes precedence over environment variables.
	const httpProxy = vscode.workspace.getConfiguration('http', null).get('proxy');
	if (httpProxy && typeof httpProxy === 'string') {
		env['http_proxy'] = httpProxy;
		env['HTTP_PROXY'] = httpProxy;
		env['https_proxy'] = httpProxy;
		env['HTTPS_PROXY'] = httpProxy;
	}
	return env;
}

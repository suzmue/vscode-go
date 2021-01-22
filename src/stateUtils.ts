/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------*/

import vscode = require('vscode');
import { logError } from './goLogging';

let globalState: vscode.Memento;
let workspaceState: vscode.Memento;

export function getFromGlobalState(key: string, defaultValue?: any): any {
	if (!globalState) {
		return defaultValue;
	}
	return globalState.get(key, defaultValue);
}

export function updateGlobalState(key: string, value: any) {
	if (!globalState) {
		return;
	}
	return globalState.update(key, value);
}

export function setGlobalState(state: vscode.Memento) {
	globalState = state;
}

export function getGlobalState() {
	return globalState;
}

export function getFromWorkspaceState(key: string, defaultValue?: any) {
	if (!workspaceState) {
		return defaultValue;
	}
	return workspaceState.get(key, defaultValue);
}

export function updateWorkspaceState(key: string, value: any) {
	if (!workspaceState) {
		return;
	}
	return workspaceState.update(key, value);
}

export function setWorkspaceState(state: vscode.Memento) {
	workspaceState = state;
}

export function getWorkspaceState(): vscode.Memento {
	return workspaceState;
}

export function getAllKeys(state: vscode.Memento): string[] {
	try {
		// tslint:disable-next-line: no-any
		if ((state as any)._value) {
			// tslint:disable-next-line: no-any
			const keys = Object.keys((state as any)._value);
			return keys;
		}
	} catch (e) {
		logError('Error getting global keys', e);
	}
	return [];
}

export async function resetGlobalKey() {
	const keys = getAllKeys(globalState);

	vscode.window.showQuickPick(keys).then((item) => {
		if (!!item) {
			updateGlobalState(item, undefined);
		}
	});

}

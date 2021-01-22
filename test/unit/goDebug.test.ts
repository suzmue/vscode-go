/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------*/

import * as assert from 'assert';
import { normalizeSeparators } from '../../src/debugAdapter/goDebug';

suite('NormalizeSeparators Tests', () => {
	test('fix separator', () => {
		const tt = [
			{
				input: 'path/to/file',
				want: 'path/to/file',
			},
			{
				input: '\\path\\to\\file',
				want: '/path/to/file',
			},
			{
				input: '/path/to\\file',
				want: '/path/to/file',
			},
		];

		for (const tc of tt) {
			const got = normalizeSeparators(tc.input);
			assert.strictEqual(got, tc.want);
		}
	});
	test('fix drive casing', () => {
		const tt = [
			{
				input: 'C:/path/to/file',
				want: 'C:/path/to/file',
			},
			{
				input: 'c:/path/to/file',
				want: 'C:/path/to/file',
			},
			{
				input: 'C:/path/to/file',
				want: 'C:/path/to/file',
			},
			{
				input: 'C:\\path\\to\\file',
				want: 'C:/path/to/file',
			},
			{
				input: 'c:\\path\\to\\file',
				want: 'C:/path/to/file',
			},
			{
				input: 'c:\\path\\to\\file',
				want: 'C:/path/to/file',
			}
		];

		for (const tc of tt) {
			const got = normalizeSeparators(tc.input);
			assert.strictEqual(got, tc.want);
		}
	});
	test('relative paths', () => {
		const tt = [
			{
				input: '../path/to/file',
				want: '../path/to/file',
			},
			{
				input: './path/to/file',
				want: './path/to/file',
			},
			{
				input: '..\\path\\to\\file',
				want: '../path/to/file',
			},
			{
				input: '.\\path\\to\\file',
				want: './path/to/file',
			},
			{
				input: '/path/to/../file',
				want: '/path/to/../file',
			},
			{
				input: 'c:\\path\\to\\..\\file',
				want: 'C:/path/to/../file',
			}
		];

		for (const tc of tt) {
			const got = normalizeSeparators(tc.input);
			assert.strictEqual(got, tc.want);
		}
	});

});

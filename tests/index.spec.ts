import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'ava';
import * as TJS from 'typescript-json-schema';
import { Schema } from 'ajv/lib/types';
import { Ajv } from 'ajv';
import { VFile } from 'vfile';
import type { Issue } from '../src/types.d.ts';
import gitlabCodeQualityFormatter from '../src/index.js';

// Get the directory name from the URL of the current module
const DIRNAME = dirname(fileURLToPath(import.meta.url));

// Mock VFile results
const mockResults: VFile[] = [
    new VFile({
        cwd: 'path/to',
        path: 'README.md',
        data: { unifiedEngineGiven: true },
        history: ['README.md'],
        value: '',
        messages: [
            {
                ancestors: [],
                cause: undefined,
                column: 3,
                fatal: false,
                line: 16,
                place: {
                    start: { line: 16, column: 3, offset: 332 },
                    end: { line: 16, column: 6, offset: 335 },
                },
                reason: 'Unexpected reference to undefined definition, expected corresponding definition (``) for a link or escaped opening bracket (`\\[`) for regular text',
                ruleId: 'no-undefined-references',
                source: 'remark-lint',
                file: 'README.md',
                url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-undefined-references#readme',
            },
        ],
    }),
    new VFile({
        cwd: 'path/to',
        path: 'README.md',
        data: { unifiedEngineGiven: true },
        history: ['README.md'],
        value: '',
        messages: [
            {
                ancestors: [],
                cause: undefined,
                column: 1,
                fatal: true,
                line: 10,
                place: { line: 10, column: 1 },
                reason: 'Unexpected reference',
                ruleId: undefined,
                source: 'remark-lint',
                file: 'README.md',
                url: undefined,
            },
        ],
    }),
];

const mockOptions = {};

const expectedReport: Issue[] = [
    {
        type: 'issue',
        check_name: 'no-undefined-references',
        description:
            'Unexpected reference to undefined definition, expected corresponding definition (``) for a link or escaped opening bracket (`\\[`) for regular text',
        content: {
            body: 'Error found in no-undefined-references. See https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-undefined-references#readme for more details.',
        },
        categories: ['Style'],
        location: {
            path: 'README.md',
            lines: {
                begin: 16,
                end: 16,
            },
            positions: {
                begin: {
                    line: 16,
                    column: 3,
                },
                end: {
                    line: 16,
                    column: 6,
                },
            },
        },
        severity: 'minor',
        fingerprint: 'e2a76405959e5bc34b5a22fda2832b16',
    },
    {
        type: 'issue',
        check_name: 'Unknown Rule',
        description: 'Unexpected reference',
        content: {
            body: 'Error found in Unknown Rule.',
        },
        categories: ['Style'],
        location: {
            path: 'README.md',
            lines: {
                begin: 10,
                end: 10,
            },
            positions: {
                begin: {
                    line: 10,
                    column: 1,
                },
                end: {
                    line: 10,
                    column: 1,
                },
            },
        },
        severity: 'major',
        fingerprint: 'eb0941373f3f5c719a5317317d06df2a',
    },
];

test('gitlabCodeQualityFormatter returns correct report', (t) => {
    const generatedReport = gitlabCodeQualityFormatter(mockResults, mockOptions);
    t.is(generatedReport, JSON.stringify(expectedReport));

    // Validate result with schema
    const program = TJS.getProgramFromFiles([join(DIRNAME, '../src/types.d.ts')]);
    const schema = TJS.generateSchema(program, 'Issue', {}) as Schema;
    const ajv = new Ajv({ strict: false });
    const validate = ajv.compile(schema);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const messages = JSON.parse(generatedReport);

    // eslint-disable-next-line
    const allValid = messages.every((message: any) => {
        const valid = validate(message);
        if (!valid) {
            // eslint-disable-next-line no-console
            console.log(validate.errors);
        }
        return valid;
    });

    t.true(allValid, 'JSON data is valid according to the schema');
});

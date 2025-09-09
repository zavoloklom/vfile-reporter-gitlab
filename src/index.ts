import { generateFingerprint, getPosition } from './functions.js';

import type { Issue } from './types.d.ts';
import type { VFile } from 'vfile';

const gitlabCodeQualityFormatter = (files: VFile | VFile[], options: object | null | undefined): string => {
  const hashes = new Set<string>();
  const results = Array.isArray(files) ? files : [files];
  const issues: Issue[] = results.flatMap((result) =>
    result.messages.map((message) => {
      const messagePosition = getPosition(message);
      const messageRule = message.ruleId ?? 'Unknown Rule';
      const messageUrl = message.url ? ` See ${message.url} for more details.` : '';
      return {
        type: 'issue',
        // eslint-disable-next-line camelcase
        check_name: messageRule,
        description: message.reason,
        content: {
          body: `Error found in ${messageRule}.${messageUrl}`,
        },
        categories: ['Style'],
        location: {
          path: result.path,
          lines: {
            begin: messagePosition.start.line,
            end: messagePosition.end.line,
          },
          positions: {
            begin: {
              line: messagePosition.start.line,
              column: messagePosition.start.column,
            },
            end: {
              line: messagePosition.end.line,
              column: messagePosition.end.column,
            },
          },
        },
        severity: message.fatal ? 'major' : 'minor',
        fingerprint: generateFingerprint(
          [
            result.path,
            messageRule,
            message.reason,
            `${messagePosition.start.line}`,
            `${messagePosition.start.column}`,
          ],
          hashes,
        ),
      };
    }),
  );

  return JSON.stringify(issues);
};

// eslint-disable-next-line import/no-default-export
export default gitlabCodeQualityFormatter;

import { createHash } from 'node:crypto';

import type { Position } from 'unist';
import type { VFileMessage } from 'vfile-message';

export const getPosition = (message: VFileMessage): Position => {
  let startLine = message.line ?? 0;
  let startColumn = message.column ?? 0;
  let endLine = startLine;
  let endColumn = startColumn;
  if (message.place) {
    if ('start' in message.place) {
      startLine = message.place.start.line;
      startColumn = message.place.start.column;
    } else {
      startLine = message.place.line;
      startColumn = message.place.column;
    }
    if ('end' in message.place) {
      endLine = message.place.end.line;
      endColumn = message.place.end.column;
    } else {
      endLine = message.place.line;
      endColumn = message.place.column;
    }
  }
  return { start: { line: startLine, column: startColumn }, end: { line: endLine, column: endColumn } };
};

export const generateFingerprint = (data: (string | undefined)[], hashes: Set<string>): string => {
  // eslint-disable-next-line sonarjs/hashing
  const hash = createHash('md5');

  for (const part of data) {
    if (part) {
      hash.update(part.toString());
    }
  }

  // Hash collisions should not happen, but if they do, a random hash will be generated.
  const hashCopy = hash.copy();
  let digest = hash.digest('hex');
  if (hashes.has(digest)) {
    // eslint-disable-next-line sonarjs/pseudo-random
    hashCopy.update(Math.random().toString());
    digest = hashCopy.digest('hex');
  }

  hashes.add(digest);

  return digest;
};

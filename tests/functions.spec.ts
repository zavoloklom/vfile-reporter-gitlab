import test from 'ava';
import { VFileMessage } from 'vfile-message';

import { generateFingerprint, getPosition } from '../src/functions.js';

// Test generateFingerprint
test('generateFingerprint generates unique fingerprint', (t) => {
  // eslint-disable-next-line no-undefined
  const data = ['path/to/file.scss', undefined, 'Unused variable "y"', '10', '5'];
  const hashes: Set<string> = new Set();
  const fingerprint = generateFingerprint(data, hashes);
  const FP_LENGTH = 32;
  t.is(hashes.has(fingerprint), true);
  t.is(fingerprint.length, FP_LENGTH);
  // Should be always the same
  t.is(fingerprint, 'd071a3fe67d469d450f53b464fbf7d3e');
});

test('generateFingerprint handles hash collisions by generating a new unique hash', (t) => {
  const data = ['path/to/file.css', 'no-unused-vars', 'Unused variable "x"', '10', '5'];
  const hashes: Set<string> = new Set();
  const initialFingerprint = generateFingerprint(data, hashes);

  hashes.add(initialFingerprint);

  const dataForCollision = ['path/to/file.css', 'no-unused-vars', 'Unused variable "x"', '10', '5'];

  const newFingerprint = generateFingerprint(dataForCollision, hashes);
  t.not(initialFingerprint, newFingerprint, 'New hash should be different from the initial to avoid collision');
  t.is(hashes.has(newFingerprint), true, 'New hash should be added to the set');
  t.is(hashes.size, 2, 'There should be two unique hashes in the set now');
});

// Test getPosition
test('getPosition returns correct error location for Position', (t) => {
  const message = new VFileMessage(new Error('Error'), {
    start: { line: 16, column: 3, offset: 332 },
    end: { line: 16, column: 6, offset: 335 },
  });
  const location = getPosition(message);
  t.deepEqual(location, {
    start: { line: 16, column: 3 },
    end: { line: 16, column: 6 },
  });
});
test('getPosition returns correct error location for Point', (t) => {
  const message = new VFileMessage(new Error('Error'), { line: 16, column: 3, offset: 332 });
  const location = getPosition(message);
  t.deepEqual(location, {
    start: { line: 16, column: 3 },
    end: { line: 16, column: 3 },
  });
});

test('getPosition returns correct error location for Undefined', (t) => {
  const message = new VFileMessage(new Error('Error'));
  const location = getPosition(message);
  t.deepEqual(location, {
    start: { line: 0, column: 0 },
    end: { line: 0, column: 0 },
  });
});

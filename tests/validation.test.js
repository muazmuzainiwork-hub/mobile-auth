const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validate } = require('../src/validation');
test('signup requires all fields', () => assert.deepEqual(Object.keys(validate({}, true)), ['name','email','password']));
test('rejects malformed email and short password', () => assert.deepEqual(Object.keys(validate({ email: 'bad@', password: '123' })), ['email','password']));
test('accepts six character password and trimmed email', () => assert.deepEqual(validate({ name:' Alex ',email:' alex@example.com ',password:'123456' },true), {}));
test('login does not require a name', () => assert.deepEqual(validate({email:'alex@example.com',password:'123456'}), {}));

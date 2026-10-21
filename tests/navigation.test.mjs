import test from 'node:test';
import assert from 'node:assert/strict';
import { durableDestination } from '../src/nav/destinations.ts';
test('durable deep links preserve tabs, settings, journeys and valid foundation days', () => {
  for (const target of ['hub:home', 'hub:journal', 'profile:preferences', 'manifest:goal', 'manifest:water', 'manifest:vision', 'manifest:foundation:0', 'manifest:foundation:6', 'tool:breathe']) assert.equal(durableDestination(target), target);
});
test('reload rejects invalid routes and never resumes transient audio state', () => {
  for (const target of [null, '', 'profile:unknown', 'hub:unknown', 'manifest:foundation:-1', 'manifest:foundation:7', 'tool:unknown']) assert.equal(durableDestination(target), null);
  for (const target of ['session', 'sleep', 'flow', 'programme']) assert.equal(durableDestination(target), 'hub:library');
});

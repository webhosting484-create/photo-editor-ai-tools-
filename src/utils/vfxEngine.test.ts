import test from 'node:test';
import assert from 'node:assert/strict';
import {
  updateRaindrop,
  updateRipple,
  calculateCameraTransform,
  calculateImageCropBounds,
  getPresetMoodById,
  PRESET_MOODS,
  FlashGuard,
  calculateThunderDelaySec,
  kelvinToRgb,
  dbToGain,
} from './vfxEngine.ts';

test('FlashGuard enforces WCAG 2.3.1 max 3 flashes in 1000ms', () => {
  const guard = new FlashGuard();
  assert.equal(guard.canFlash(1.0, false), true);
  assert.equal(guard.canFlash(1.2, false), true);
  assert.equal(guard.canFlash(1.4, false), true);
  // 4th flash within the same 1-second window MUST be rejected
  assert.equal(guard.canFlash(1.6, false), false);
  // After window expires (>1.0s later), next flash should be permitted
  assert.equal(guard.canFlash(2.1, false), true);
});

test('FlashGuard in Photosensitive Safe Mode enforces >= 2s between flashes', () => {
  const guard = new FlashGuard();
  assert.equal(guard.canFlash(1.0, true), true);
  // Second flash 1.0s later should be blocked in safe mode
  assert.equal(guard.canFlash(2.0, true), false);
  // After 2.0s elapsed (> 3.0s), permitted
  assert.equal(guard.canFlash(3.1, true), true);
});

test('calculateThunderDelaySec calculates physical sound delay', () => {
  const delay1km = calculateThunderDelaySec(1.0);
  assert.ok(Math.abs(delay1km - (1.0 / 0.343)) < 0.05);

  const delay5km = calculateThunderDelaySec(5.0);
  assert.ok(Math.abs(delay5km - (5.0 / 0.343)) < 0.05);
});

test('kelvinToRgb converts color temperatures reliably', () => {
  const warmRgb = kelvinToRgb(2400); // Bonfire / Candle
  assert.ok(warmRgb[0] > warmRgb[2], 'Warm Kelvin should have higher Red than Blue');

  const coolRgb = kelvinToRgb(6500); // Daylight
  assert.ok(coolRgb[0] >= 0.9);
  assert.ok(coolRgb[2] >= 0.9);
});

test('dbToGain converts decibels accurately', () => {
  assert.equal(dbToGain(0), 1.0);
  assert.ok(Math.abs(dbToGain(-6) - 0.501) < 0.02);
  assert.equal(dbToGain(-60), 0);
});

test('all 12 presets from settings-reference table exist with valid keys', () => {
  assert.equal(PRESET_MOODS.length, 12);
  const ids = PRESET_MOODS.map((p) => p.id);
  assert.ok(ids.includes('midnight-solitude'));
  assert.ok(ids.includes('thunderstorm-downpour'));
  assert.ok(ids.includes('golden-hour-memory'));
  assert.ok(ids.includes('neon-alley-rain'));
  assert.ok(ids.includes('magnetic-tape-95'));
  assert.ok(ids.includes('sakura-dusk-drift'));
  assert.ok(ids.includes('first-snow-platform'));
  assert.ok(ids.includes('firefly-summer-field'));
  assert.ok(ids.includes('misty-dawn-pass'));
  assert.ok(ids.includes('aurora-overpass'));
  assert.ok(ids.includes('rooftop-starfall'));
  assert.ok(ids.includes('ember-festival-night'));
});

test('calculateCameraTransform handles shake and orbit modes', () => {
  const orbit = calculateCameraTransform(1.0, 'orbit', 1.0, 2);
  assert.ok(orbit.scale >= 1.0);
  assert.ok(typeof orbit.translateX === 'number');

  const shake = calculateCameraTransform(2.0, 'handheld-shake', 1.0, 5);
  assert.ok(typeof shake.translateX === 'number');
  assert.ok(typeof shake.translateY === 'number');
});

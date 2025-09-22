const test = require('node:test');
const assert = require('node:assert/strict');

const {
    DEFAULT_CONFIG,
    resetDifficulty,
    applyDifficultyProgression,
    willHitHorizontalBounds,
} = require('../js/gameLogic');

test('difficulty progression increases challenge gradually', () => {
    const customConfig = {
        ...DEFAULT_CONFIG,
        verticalIncrement: 20,
        horizontalIncrement: 20,
        delayDecrement: 600,
        minDelay: 800,
        maxVerticalSpeed: 120,
        maxHorizontalSpeed: 70,
    };

    let state = resetDifficulty(customConfig);
    assert.equal(state.waveLevel, 1);
    assert.equal(state.verticalSpeed, customConfig.initialVerticalSpeed);
    assert.equal(state.horizontalSpeed, customConfig.initialHorizontalSpeed);
    assert.equal(state.timerDelay, customConfig.initialTimerDelay);

    state = applyDifficultyProgression(state, customConfig);
    assert.equal(state.waveLevel, 2);
    assert.equal(state.verticalSpeed, customConfig.initialVerticalSpeed + customConfig.verticalIncrement);
    assert.equal(state.horizontalSpeed, customConfig.initialHorizontalSpeed + customConfig.horizontalIncrement);
    assert.equal(state.timerDelay, customConfig.initialTimerDelay - customConfig.delayDecrement);

    state = applyDifficultyProgression(state, customConfig);
    assert.equal(state.waveLevel, 3);
    assert.equal(state.verticalSpeed, customConfig.initialVerticalSpeed + customConfig.verticalIncrement * 2);
    assert.equal(state.horizontalSpeed, customConfig.maxHorizontalSpeed);
    assert.equal(state.timerDelay, customConfig.minDelay);

    state = applyDifficultyProgression(state, customConfig);
    assert.equal(state.waveLevel, 4);
    assert.equal(state.verticalSpeed, customConfig.maxVerticalSpeed);
    assert.equal(state.horizontalSpeed, customConfig.maxHorizontalSpeed);
    assert.equal(state.timerDelay, customConfig.minDelay);
});

test('horizontal bounds detection flags edges correctly', () => {
    const width = 800;
    const padding = 60;
    const positions = [width / 2, width / 2 + 50];

    assert.equal(willHitHorizontalBounds(positions, 1, 10, width, padding), false);
    assert.equal(willHitHorizontalBounds([width - padding - 5], 1, 10, width, padding), true);
    assert.equal(willHitHorizontalBounds([padding + 5], -1, 10, width, padding), true);
    assert.equal(willHitHorizontalBounds([], 1, 10, width, padding), false);
});

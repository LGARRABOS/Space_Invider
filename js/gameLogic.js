(function (global) {
    const DEFAULT_CONFIG = {
        initialVerticalSpeed: 60,
        initialHorizontalSpeed: 40,
        initialTimerDelay: 2000,
        verticalIncrement: 12,
        horizontalIncrement: 12,
        delayDecrement: 150,
        minDelay: 600,
        maxVerticalSpeed: 220,
        maxHorizontalSpeed: 180,
        boundaryPadding: 60,
    };

    Object.freeze(DEFAULT_CONFIG);

    function resetDifficulty(config = DEFAULT_CONFIG) {
        return {
            waveLevel: 1,
            verticalSpeed: config.initialVerticalSpeed,
            horizontalSpeed: config.initialHorizontalSpeed,
            timerDelay: config.initialTimerDelay,
        };
    }

    function applyDifficultyProgression(state, config = DEFAULT_CONFIG) {
        return {
            waveLevel: state.waveLevel + 1,
            verticalSpeed: Math.min(state.verticalSpeed + config.verticalIncrement, config.maxVerticalSpeed),
            horizontalSpeed: Math.min(state.horizontalSpeed + config.horizontalIncrement, config.maxHorizontalSpeed),
            timerDelay: Math.max(state.timerDelay - config.delayDecrement, config.minDelay),
        };
    }

    function willHitHorizontalBounds(positions, direction, speed, width, padding = DEFAULT_CONFIG.boundaryPadding) {
        if (!Array.isArray(positions) || positions.length === 0) {
            return false;
        }

        const minX = padding;
        const maxX = width - padding;

        return positions.some((x) => {
            const nextX = x + direction * speed;
            return nextX <= minX || nextX >= maxX;
        });
    }

    const api = {
        DEFAULT_CONFIG,
        resetDifficulty,
        applyDifficultyProgression,
        willHitHorizontalBounds,
    };

    if (global) {
        global.GameLogic = api;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this);

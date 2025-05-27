module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    root: ['./'],
                    alias: {
                        assets: './assets',
                        contexts: './app/contexts',
                        components: './app/components',
                        config: './app/config',
                        hooks: './app/hooks',
                        utils: './app/utils',
                        models: './app/models',
                        navigation: './app/navigation',
                        screen: './app/screen',
                    },
                },
            ],
            'react-native-reanimated/plugin',
        ],
    };
};

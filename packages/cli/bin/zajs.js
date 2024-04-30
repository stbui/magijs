#!/usr/bin/env node

const updater = require('../lib/updater');

// 检测版本，是否可以更新
updater.Updater()
    .then(() => {
        require('../lib');
    })
    .catch(e => {
        console.error('Update error');
        console.error(e);
    });

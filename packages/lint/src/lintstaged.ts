import { config } from '@magijs/prettier';
import lintStaged from 'lint-staged/lib/index';
// // import { config} from '@magijs/stylelint';
// // import { config } from '@magijs/eslint';

lintStaged({
  config: {
    'src/**/*.{js,jsx,tsx,ts,scss,json}': [`prettier --parser=typescript --config ${config}  --write`, 'git add'],
    // 'src/**/*.scss': ['stylelint --config --fix', 'git add'],
    // 'src/**/*.{js,jsx,tsx,ts}': ['eslint --fix', 'git add'],
  },
});

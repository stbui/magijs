import isCore from 'is-core-module';
import { isRelative } from './isRelative';

export function replaceImports(opts: { content?: any; externals?: any; prefix?: string }) {
  const depImports: any = [];
  const localImports: any = [];
  let content = opts.content;
  const externals = opts.externals || {};
  
  content = content.replace(/(import.+?from) ['"]([^'"]+)['"]/g, (a, b, c) => {
    c = c.replace(/\.js$/, '');
    // asdf is from cjs-module-lexer
    // #supports-color is from chalk
    if (['./ab', 'asdf', '...', '#supports-color'].includes(c)) {
      return `${b}('${c}')`;
    }
    if (isRelative(c)) {
      localImports.push(c);
      return `${b} '${c}'`;
    } else if (isCore(c)) {
      return `${b} '${c}'`;
    } else if (externals[c]) {
      return `${b} '${externals[c]}'`;
    } else {
      depImports.push(c);
      return `${b} '${opts.prefix}${c}'`;
    }
  });
  content = content.replace(/(import)\(['"]([^'"]+)['"]\)/g, (a, b, c) => {
    c = c.replace(/\.js$/, '');
    // ./ab, asdf is from cjs-module-lexer
    // ... is from webpack
    if (['./ab', 'asdf', '...'].includes(c)) {
      return `${b}('${c}')`;
    }
    if (isRelative(c)) {
      localImports.push(c);
      return `${b}('${c}')`;
    } else if (isCore(c)) {
      return `${b}('${c}')`;
    } else if (externals[c]) {
      return `${b}('${externals[c]}')`;
    } else {
      depImports.push(c);
      return `${b}('${opts.prefix}${c}')`;
    }
  });
  content = content.replace(/(import[^=]+?=.+?require)\(['"]([^'"]+)['"]\)/g, (a, b, c) => {
    if (['./ab', 'asdf', '...'].includes(c)) {
      return `${b}('${c}')`;
    }
    if (isRelative(c)) {
      localImports.push(c);
      return `${b}('${c}')`;
    } else if (isCore(c)) {
      return `${b}('${c}')`;
    } else if (externals[c]) {
      return `${b}('${externals[c]}')`;
    } else {
      depImports.push(c);
      return `${b}('${opts.prefix}${c}')`;
    }
  });
  // TODO: <reference />
  // ref: https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html
  return {
    content,
    depImports,
    localImports,
  };
}

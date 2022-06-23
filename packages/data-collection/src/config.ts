export class Config {
  version: string = '0.0.1';
  name: string = 'stbui';

  constructor(options) {
    for (let i in options) {
      const val = options[i];

      if (val) {
        this[i] = val;
      }
    }
  }
}

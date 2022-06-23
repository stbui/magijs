import { Config } from './config';

export class ClientDataCollect {
  private config: Config;

  constructor(options) {
    this.config = new Config(options);
  }
}

const clientDataCollect = new ClientDataCollect({
  name: 1,
  version: 2,
});

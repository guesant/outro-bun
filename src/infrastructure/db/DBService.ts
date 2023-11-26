import jetpack from "fs-jetpack";
import { inject, injectable } from "inversify";
import { Low } from "lowdb";
import { JSONPreset } from "lowdb/node";
import { dirname } from "path";
import { DITypes, type IConfig } from "../../domain";
import { type IData } from "./mod/IData";

const defaultData: IData = {
  handledMusics: [],
};

@injectable()
export class DBService {
  @inject(DITypes.ConfigService) private _configService!: IConfig;

  #db: Low<IData> | null = null;

  async setup() {
    if (this.#db === null) {
      const dbPath = this._configService.getPathDB();

      jetpack.dir(dirname(dbPath));

      this.#db = await JSONPreset(dbPath, defaultData);

      await this.#db.read();
      await this.#db.write();
    }

    return this.#db;
  }

  async getDB() {
    return this.setup();
  }
}

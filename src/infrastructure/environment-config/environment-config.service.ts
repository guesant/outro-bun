import { injectable } from "inversify";
import type { IConfig } from "../../domain";

@injectable()
export class EnvironmentConfigService implements IConfig {
  getPathBase(): string {
    const cwd = process.cwd();
    return `${cwd}/_`;
  }

  getPathFiles(): string {
    return `${this.getPathBase()}/_files`;
  }

  getPathOutputs(): string {
    return `${this.getPathFiles()}/outputs`;
  }

  getPathOutput(filename: string): string {
    return `${this.getPathOutputs()}/${filename}.flac`;
  }

  getPathTmp(): string {
    return `${this.getPathFiles()}/tmp`;
  }

  getPathDownloads(): string {
    return `${this.getPathTmp()}/downloads`;
  }

  getPathDownload(filename: string): string {
    return `${this.getPathDownloads()}/${filename}`;
  }

  getPathDB(): string {
    return `${this.getPathBase()}/db/app.json`;
  }
}

export interface IConfigPaths {
  getPathBase(): string;

  getPathOutputs(): string;

  getPathOutput(filename: string): string;

  getPathTmp(): string;

  getPathDownloads(): string;

  getPathDownload(filename: string): string;

  getPathDB(): string;
}

import { type IYTDlpJSONDump, type IYTDlpJSONDumpFormat } from "./native/IYTDlpJSONDump";

export interface IYTDlpService {
  jsonDumpByURL(url: string): Promise<IYTDlpJSONDump>;

  getBestAudioFormatByJSONDump(jsonDump: IYTDlpJSONDump): Promise<IYTDlpJSONDumpFormat>;
  getBestAudioFormatByURL(url: string): Promise<IYTDlpJSONDumpFormat>;

  download(url: string, filePath: string, formatId: string): Promise<void>;
}

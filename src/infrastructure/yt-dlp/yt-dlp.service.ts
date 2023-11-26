import jetpack from "fs-jetpack";
import { inject, injectable } from "inversify";
import path from "node:path";
import { DITypes, type ISubProcService, type IYTDlpJSONDump, type IYTDlpService } from "../../domain";

@injectable()
export class YTDlpService implements IYTDlpService {
  @inject(DITypes.SubProcService) private subProcService!: ISubProcService;

  async jsonDumpByURL(url: string): Promise<IYTDlpJSONDump> {
    const output = await this.subProcService.exec(`yt-dlp -j "${url}"`);
    const json = JSON.parse(output);
    return json;
  }

  getBestAudioFormatByJSONDump(jsonDump: IYTDlpJSONDump): Promise<any> {
    console.log("");
    console.log("[info] -- buscando o melhor formato de áudio disponível");

    const audioFormats = jsonDump.formats.filter((format) => format.audio_ext !== "none");
    const sortedFormats = audioFormats.sort((a, b) => b.abr - a.abr);

    const formato = sortedFormats[0];
    console.log(`[info] --- encontrado: ${formato.format}`);

    return formato;
  }

  async getBestAudioFormatByURL(url: string): Promise<any> {
    const jsonDump = await this.jsonDumpByURL(url);
    return this.getBestAudioFormatByJSONDump(jsonDump);
  }

  async download(url: string, filePath: string, formatId: string): Promise<void> {
    console.log("");
    console.log("[info] -- baixando o áudio da música");

    jetpack.dir(path.dirname(filePath));
    jetpack.remove(filePath);

    this.subProcService.exec(`yt-dlp -f ${formatId} -o ${filePath} ${url}`);

    console.log("[info] --- áudio da música baixado");
  }
}

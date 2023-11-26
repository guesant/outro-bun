import jetpack from "fs-jetpack";
import { inject, injectable } from "inversify";
import { isEqual } from "lodash";
import path from "node:path";
import slug from "slug";
import { DITypes, IOutroService, type IConfig, type IMusicRequest, type ISubProcService, type IYTDlpService } from "../../domain";
import { DBService } from "../db/DBService";
import { wait } from "../utils";
import { TimeMarkRepresentation } from "./TimeMarkRepresentation";

const DEFAULT_INTERVAL = 20000;

@injectable()
export class OutroService implements IOutroService {
  @inject(DITypes.ConfigService) private _configService!: IConfig;
  @inject(DITypes.YTDlpService) private _ytDlpService!: IYTDlpService;
  @inject(DITypes.SubProcService) private _subProcService!: ISubProcService;

  @inject(DBService) private dbService!: DBService;

  async processOriginalAudio(inputFile: string, outputFile: string, musicRequest: IMusicRequest) {
    console.log("");
    console.log("[info] -- processando o áudio (cortar e converter para flac)");

    // Ensure that input file exists
    jetpack.exists(inputFile);

    // Ensure that output directory exists and the output file don't exists.
    jetpack.dir(path.dirname(outputFile));
    jetpack.remove(outputFile);

    const duration = Math.max(
      TimeMarkRepresentation.getDifferenceInSeconds(musicRequest.startTime, musicRequest.endTime, 20),
      20
    );

    console.log(
      `[info] --- start time: ${musicRequest.startTime.asString()}; end time: ${musicRequest.endTime.asString()}; duration: ${duration}`
    );

    await this._subProcService.exec(
      `ffmpeg -i ${inputFile} -ss ${musicRequest.startTime.asString()} -t ${duration} -f flac -c:a flac ${outputFile}`
    );

    console.log("[info] --- fechou");
  }

  async shouldHandleMusicRequest(musicRequest: IMusicRequest) {
    const db = await this.dbService.getDB();

    const viewMusicRequest = {
      studentName: musicRequest.studentName,
      url: musicRequest.musicRequestMediaSource.asURL(),
      startTime: musicRequest.startTime.asString(),
      endTime: musicRequest.endTime.asString(),
    };

    const index = db.data.handledMusics.findIndex((i) => {
      const viewCurrentItem = {
        studentName: i.studentName,
        url: i.url,
        startTime: i.startTime,
        endTime: i.endTime,
      };

      const result = isEqual(viewCurrentItem, viewMusicRequest);

      if (viewCurrentItem.studentName === viewMusicRequest.studentName && !result) {
        console.log(JSON.stringify({ viewCurrentItem, viewMusicRequest }, null, 2));
      }

      return result;
    });

    return index === -1;
  }

  async *smartMusicRequestsToHandle(musicRequests: AsyncIterable<IMusicRequest>, interval: number = DEFAULT_INTERVAL) {
    let first = true;

    for await (const musicRequest of musicRequests) {
      const shoudlHandle = await this.shouldHandleMusicRequest(musicRequest);

      if (shoudlHandle) {
        if (!first && interval > 0) {
          console.log(`[info] aguardando intervalo de ${interval} milissegundos...`);
          await wait(interval);
        }

        yield musicRequest;

        first = false;
      }
    }
  }

  async handleMusicRequest(musicRequest: IMusicRequest) {
    console.log("=======================");

    console.log(`[info] - job: ${musicRequest.studentName}`);

    const filename = slug(musicRequest.studentName);
    const mediaURL = musicRequest.musicRequestMediaSource.asURL();

    const downloadFilePath = this._configService.getPathDownload(filename);

    const bestAudio = await this._ytDlpService.getBestAudioFormatByURL(mediaURL);
    await this._ytDlpService.download(mediaURL, downloadFilePath, bestAudio.format_id);

    const outputFilePath = this._configService.getPathOutput(filename);

    await this.processOriginalAudio(downloadFilePath, outputFilePath, musicRequest);

    const db = await this.dbService.getDB();

    db.data.handledMusics = db.data.handledMusics.filter((i) => i.studentName !== musicRequest.studentName);

    db.data.handledMusics.push({
      studentName: musicRequest.studentName,
      url: musicRequest.musicRequestMediaSource.asURL(),
      startTime: musicRequest.startTime.asString(),
      endTime: musicRequest.endTime.asString(),
    });

    await db.write();

    await this.cleanup();
  }

  async handleMusicRequests(musicRequests: AsyncIterable<IMusicRequest>, interval: number = DEFAULT_INTERVAL) {
    for await (const musicRequest of this.smartMusicRequestsToHandle(musicRequests, interval)) {
      await this.handleMusicRequest(musicRequest);
    }
  }

  async cleanup() {
    const tmp = this._configService.getPathTmp();
    jetpack.remove(tmp);
  }
}

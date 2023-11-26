import { parse } from "csv-parse";
import jetpack from "fs-jetpack";
import { injectable } from "inversify";
import { type IMusicRequest } from "../../../domain";
import { MusicRequest } from "../../core/MusicRequest";

type ICSVRecord = string[];

@injectable()
export class DriverCSV {
  async musicRequestFromRecord(record: ICSVRecord): Promise<IMusicRequest | null> {
    if (record.length >= 6) {
      const nome = record[0]?.trim();

      const url = record[2]?.trim();

      const startTime = record[4]?.trim() || "00:00";
      const endTime = record[5]?.trim() || null;

      return MusicRequest.fromParams(nome, url, startTime, endTime);
    }

    return null;
  }

  async *musicRequestsFromRecords(records: AsyncIterable<ICSVRecord>): AsyncIterable<IMusicRequest> {
    for await (const record of records) {
      const music = await this.musicRequestFromRecord(record);

      if (music) {
        yield music;
      }
    }
  }

  async *musicRequestsFromFile(path: string) {
    const csvContent = jetpack.read(path);

    if (csvContent) {
      const csvRecords = parse(csvContent);
      const driverCSV = new DriverCSV();
      yield* driverCSV.musicRequestsFromRecords(csvRecords);
    }
  }
}

import { IMusicRequest, IRawMusicRequest } from "../../domain";
import { RawMusicRequestZod } from "../zod/RawMusicRequest/RawMusicRequest.zod";
import { MusicRequestMediaSource } from "./MusicRequestMediaSource";
import { TimeMarkRepresentation } from "./TimeMarkRepresentation";

export class MusicRequest {
  static fromRawMusicRequest(payloadRawMusicRequest: unknown) {
    const check = RawMusicRequestZod.safeParse(payloadRawMusicRequest);

    if (check.success) {
      const data = check.data as IRawMusicRequest;

      const musicRequest: IMusicRequest = {
        studentName: data.studentName,
        musicRequestMediaSource: MusicRequestMediaSource.fromURL(data.url),
        startTime: TimeMarkRepresentation.fromPayload(data.startTime),
        endTime: TimeMarkRepresentation.fromPayload(data.endTime),
      };

      return musicRequest;
    }

    return null;
  }

  static fromParams(studentName: any, url: any, startTime?: any, endTime?: any) {
    return MusicRequest.fromRawMusicRequest({
      studentName,
      url,
      startTime,
      endTime,
    });
  }
}

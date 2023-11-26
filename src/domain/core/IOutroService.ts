import { IMusicRequest } from "../models/IMusicRequest";

export interface IOutroService {
  processOriginalAudio(inputFile: string, outputFile: string, musicRequest: IMusicRequest): Promise<void>;

  cleanup(): Promise<void>;

  handleMusicRequest(musicRequest: IMusicRequest): Promise<void>;

  handleMusicRequests(musicRequests: AsyncIterable<IMusicRequest>): Promise<void>;
}

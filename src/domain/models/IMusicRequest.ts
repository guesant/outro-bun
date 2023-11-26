import { IMusicRequestMediaSourceInstance } from "../core/IMusicRequestMediaSource";
import { ITimeMarkRepresentationInstance } from "../core/ITimeMarkRepresentation";

export type IMusicRequest = {
  studentName: string;

  musicRequestMediaSource: IMusicRequestMediaSourceInstance;

  startTime: ITimeMarkRepresentationInstance;
  endTime: ITimeMarkRepresentationInstance;
};

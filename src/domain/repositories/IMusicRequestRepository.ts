import { IMusicRequest } from "../models";

export type IMusicRequestRepository = {
  getAll(): AsyncIterable<IMusicRequest>;
};

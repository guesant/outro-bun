import "reflect-metadata";
import { DITypes, type IOutroService } from "../../domain";
import { container } from "../di/container";
import { DriverCSV } from "../drivers";

async function main() {
  const driverCSV = new DriverCSV();
  const musicRequests = driverCSV.musicRequestsFromFile("musicas.csv");

  const outroService = container.get<IOutroService>(DITypes.OutroService);
  outroService.handleMusicRequests(musicRequests);
}

main();

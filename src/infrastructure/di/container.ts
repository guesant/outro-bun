import { Container } from "inversify";
import { DITypes, IOutroService, type IConfig, type ISubProcService, type IYTDlpService } from "../../domain";
import { OutroService } from "../core/outro.service";
import { DBService } from "../db/DBService";
import { EnvironmentConfigService } from "../environment-config/environment-config.service";
import { SubProcService } from "../subproc/subproc.service";
import { YTDlpService } from "../yt-dlp/yt-dlp.service";

function createAppContainer() {
  const container = new Container();

  container.bind<ISubProcService>(DITypes.SubProcService).to(SubProcService);

  container.bind<IYTDlpService>(DITypes.YTDlpService).to(YTDlpService);

  container.bind<IConfig>(DITypes.ConfigService).to(EnvironmentConfigService);

  container.bind<IOutroService>(DITypes.OutroService).to(OutroService);

  container.bind<DBService>(DBService).to(DBService);

  return container;
}

const container = createAppContainer();

export { container };

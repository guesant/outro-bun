import { execSync } from "child_process";
import { injectable } from "inversify";
import { type ISubProcService } from "../../domain";

@injectable()
export class SubProcService implements ISubProcService {
  async exec(command: string): Promise<string> {
    console.log(`[debug] - command: '${command}'`);

    const output = execSync(command, { stdio: "pipe" });
    return output.toString("utf-8");
  }
}

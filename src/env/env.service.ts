import { EnvEnum } from './env.enum';

export default abstract class EnvService {
 public static get = <T = NodeJS.ProcessEnv>(variableName: EnvEnum): T => {
  const variable = process.env[variableName];
  if (!variable)
   throw Error(`Missing ${variableName} variable in .env config!`);
  try {
   return JSON.parse(variable);
  } catch {
   return variable as unknown as T;
  }
 };
}

import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import { logger } from "../libraries/log/logger";
import schema from "./config.schema";
import { z } from "zod";

interface ConfigData {
  [key: string]: any;
}

class Config {
  private static instance: Config;
  public readonly config: ConfigData;

  private constructor() {
    logger.info("Loading and validating config for the first time...");
    this.config = this.loadAndValidateConfig();
    logger.info("Config loaded and validated");
  }

  private loadAndValidateConfig(): ConfigData {
    const environment = process.env.NODE_ENV || "development";

    // 1. Load environment file
    const envFile = `.env.${environment}`;
    const envPath = path.join(__dirname, "..", envFile);
    if (!fs.existsSync(envPath)) {
      throw new Error(`Environment file not found: ${envPath}`);
    }
    dotenv.config({ path: envPath });
    // Load the environment variables

    // console.log(`Loaded environment variables from ${envPath}`);
    // 2. Load config file based on environment
    const configFile = path.join(__dirname, `config.${environment}.json`);
    if (!fs.existsSync(configFile)) {
      throw new Error(`Config file not found: ${configFile}`);
    }
    // console.log(envPath);
    // fs.writeFileSync(configFile,result.parsed??"")
    let config: ConfigData = JSON.parse(fs.readFileSync(configFile, "utf-8"));
    // console.log(config, "config");
    // 3. Load and merge shared config
    const sharedConfigFile = path.join(__dirname, "config.shared.json");
    if (fs.existsSync(sharedConfigFile)) {
      const sharedConfig: ConfigData = JSON.parse(
        fs.readFileSync(sharedConfigFile, "utf-8")
      );
      config = { ...sharedConfig, ...config };
    }

    // 4. Merge with environment variables
    const finalConfig: ConfigData = {};
    const schemaKeys = Object.keys((schema as z.ZodObject<any, any>).shape);
    for (const key of schemaKeys) {
      // console.log(key);
      if (process.env.hasOwnProperty(key)) {
        // console.log("heres");
        finalConfig[key] = process.env[key]; // Prioritize environment variables
      } else if (config.hasOwnProperty(key)) {
        finalConfig[key] = config[key]; // Fallback to config file value
      }
    }
    // console.log(finalConfig, schemaKeys);
    try {
      // 5. Validate the config
      const validatedConfig = schema.parse(finalConfig);
      console.log(finalConfig);
      return validatedConfig;

      // If we reach this point, validation was successful
      // You can now use validatedConfig, which is type-safe
    } catch (error) {
      if (error instanceof z.ZodError) {
        const missingProperties = error.issues.map((issue) =>
          issue.path.join(".")
        );
        throw new Error(
          `Config validation error: invalid properties ${missingProperties.join(
            ", "
          )}`
        );
      } else {
        // Re-throw if it's not a ZodError
        throw error;
      }
    }
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

const configInstance = Config.getInstance();
export default configInstance.config;

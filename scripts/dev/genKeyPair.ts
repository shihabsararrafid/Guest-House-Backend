import { generateKeyPairSync } from "node:crypto";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const keyPair = () => {
  return generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: "top secret",
    },
  });
};

const genKeyPair = () => {
  // Define the directory path
  const secretKeysDir = join(process.cwd(), "secretKeys");

  // Create the secretKeys directory if it doesn't exist
  if (!existsSync(secretKeysDir)) {
    try {
      mkdirSync(secretKeysDir, { recursive: true });
      console.log("\x1b[33m%s\x1b[0m", "Created secretKeys directory");
    } catch (error) {
      console.error(
        "\x1b[31m%s\x1b[0m",
        "Error creating directory:",
        error instanceof Error ? error.message : "Unknown Error Occurred"
      );
      process.exit(1);
    }
  }

  try {
    // Generate Refresh Token EC Keys
    const TokenKey = keyPair();

    // Define file paths
    const privateKeyPath = join(secretKeysDir, "tokenECPrivate.pem");
    const publicKeyPath = join(secretKeysDir, "tokenECPublic.pem");
    console.log(privateKeyPath);
    // Write the keys to files
    writeFileSync(privateKeyPath, TokenKey.privateKey, "utf8");
    writeFileSync(publicKeyPath, TokenKey.publicKey, "utf8");

    // Log success message with the generated keys
    console.log(
      "\x1b[32m%s\x1b[0m",
      "Successfully generated and saved key pair:"
    );
    console.log("\x1b[32m%s\x1b[0m", `Public Key:\n${TokenKey.publicKey}`);
    console.log("\x1b[32m%s\x1b[0m", `Private Key:\n${TokenKey.privateKey}`);
  } catch (error) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      "Error generating or saving keys:",
      error instanceof Error ? error.message : "Unknown Error Occurred"
    );
    process.exit(1);
  }
};

genKeyPair();

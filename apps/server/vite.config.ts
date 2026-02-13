import path from "path";
import fs from "fs";

const medusaPackages = fs
  .readdirSync(path.resolve(__dirname, "node_modules/@medusajs"))
  .reduce(
    (aliases, pkg) => {
      aliases[`@medusajs/${pkg}`] = path.resolve(
        __dirname,
        `node_modules/@medusajs/${pkg}`,
      );
      return aliases;
    },
    {} as Record<string, string>,
  );

export default {
  resolve: {
    alias: {
      ...medusaPackages,
    },
  },
  server: {
    fs: {
      allow: [__dirname],
    },
  },
};

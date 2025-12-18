import fs from "node:fs";
import path from "node:path";

interface BuildInfo {
  version: string;
  buildDate: string;
  buildType: "dev" | "prod";
}

export function generateBuildInfo(outDir: string, isDev: boolean): void {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8")
  );

  const buildInfo: BuildInfo = {
    version: packageJson.version,
    buildDate: new Date().toISOString(),
    buildType: isDev ? "dev" : "prod",
  };

  const outputPath = path.join(outDir, "build-info.json");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));

  console.log(`✓ Build info generated: ${outputPath}`);
}

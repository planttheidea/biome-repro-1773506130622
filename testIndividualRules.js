import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { execa } from "execa";

const schemaFile = await readFile(
  join(import.meta.dirname, "node_modules", "@biomejs", "biome", "configuration_schema.json"),
  "utf8",
);
const schema = JSON.parse(schemaFile);

const LINTER_GROUPS = [
  "A11y",
  "Accessibility",
  "Complexity",
  "Correctness",
  "Nursery",
  "Performance",
  "Security",
  "Style",
  "Suspicious",
];

const rules = Object.entries(schema.$defs)
  .reduce((groups, [name, group]) => {
    if (!LINTER_GROUPS.includes(name) || !group.properties) {
      return groups;
    }

    const properties = Object.keys(group.properties).filter(
      (property) => !["recommended"].includes(property),
    );

    if (LINTER_GROUPS.includes(name) && group.properties) {
      groups.push(...properties);
    }

    return groups;
  }, [])
  .sort();

const failed = [];

for (const rule of rules) {
  const { stderr } = await execa`yarn biome lint --only=${rule}`;

  if (stderr?.includes('processing panicked: no entry found for key')) {
    failed.push(rule);
    console.error(`\n==========\nERROR: ${rule}\n==========\n`);
  } else {
    console.log(`Valid: ${rule}`);  
  }
}

console.log(`\nFailed rules:\n${JSON.stringify(failed, null, 2)}`);

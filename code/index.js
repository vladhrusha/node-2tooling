const fs = require("node:fs");
const cliProgress = require("cli-progress");
const { promisify } = require("util");

const readline = require("node:readline/promises");
const { output } = require("node:process");

const countCountriesWhileIndicatingProgress = async () => {
  const bar1 = new cliProgress.SingleBar(
    {
      format:
        "CLI Progress |" +
        "{bar}" +
        "| {percentage}% | ETA: {eta}s| {value}/{total} megabytes",
      fps: 1,
      etaBuffer: 100,
    },
    cliProgress.Presets.shades_classic,
  );
  const filePath = "Book1.csv";
  const input = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input, output });
  const countriesCounter = new Map();
  let barCounter = 0;

  const fileSizeInMegaBytes = Math.round(
    fs.statSync(filePath).size / 1024 / 1024,
  );
  bar1.start(fileSizeInMegaBytes, barCounter);

  input.on("error", (err) => {
    throw err;
  });
  input.on("data", (chunk) => {
    barCounter = barCounter + Buffer.byteLength(chunk, "utf8");
    bar1.update(Math.round(barCounter / 1024 / 1024));
    bar1.updateETA();
  });
  for await (const line of rl) {
    const country = line.slice(0, line.indexOf(","));
    countriesCounter.set(country, countriesCounter.get(country) + 1 || 1);
  }

  const onClose = promisify(input.on).bind(input);
  await onClose("close");
  countriesCounter.delete('""');
  countriesCounter.delete("country");
  bar1.stop();
  return countriesCounter;
};

const startTimestamp = Date.now();
countCountriesWhileIndicatingProgress()
  .then((values) => {
    // eslint-disable-next-line
    console.log(values);
    const endTimestamp = Date.now();
    const secondsElapsed = Math.round((endTimestamp - startTimestamp) / 1000);
    // eslint-disable-next-line
    console.log(`Stopped after ${secondsElapsed} seconds`);
  })
  .catch((err) => {
    process.on("exit", (code) => {
      // eslint-disable-next-line
      console.log("Inside error, fetching product line items failed", err);
      // eslint-disable-next-line
      console.log(`About to exit with code: ${code}`);
    });
    process.exit(1);
  });

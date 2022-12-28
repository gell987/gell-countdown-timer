#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import inquirer from "inquirer";

const sleep = (ms: number = 3000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function greet() {
  console.clear();
  const rainboxTitle = chalk.blue.bold(
    "Hassam's countdown timer PIAIC(PIAIC202061)\n"
  );
  console.log(rainboxTitle);
  await sleep();
}

let hours: number;
let minutes: number;
let seconds: number;

let intervalId: NodeJS.Timeout;

async function main(): Promise<void> {
  console.log(
    chalk.redBright(
      "Enter the amount of hours, minutes, and seconds for the countdown:"
    )
  );

  const userInputResponse: any = await inquirer.prompt([
    {
      name: "hours",
      type: "number",
      message: chalk.redBright("Hours: "),
      validate: (input: any) => input >= 0,
    },
    {
      name: "minutes",
      type: "number",
      message: chalk.redBright("Minutes: "),
      validate: (input: any) => input >= 0,
    },
    {
      name: "seconds",
      type: "number",
      message: chalk.redBright("Seconds: "),
      validate: (input: any) => input >= 0,
    },
  ]);

  hours = userInputResponse.hours;
  minutes = userInputResponse.minutes;
  seconds = userInputResponse.seconds;

  const countdown = () => {
    intervalId = setInterval(async () => {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);

      if (seconds === 0) {
        if (minutes !== 0) {
          minutes--;
          seconds += 60;
        } else if (hours !== 0) {
          hours--;
          minutes += 60;
          minutes--;
          seconds += 60;
        } else {
          clearInterval(intervalId);
          console.log(chalk.redBright("Countdown complete!"));
          await askForAction();
        }
      } else if (seconds !== 0) {
        seconds--;
      }
      process.stdout.write(
        `${chalk.redBright(hours)}:${chalk.greenBright(
          minutes
        )}:${chalk.redBright(seconds)}`
      );
    }, 1000);
  };

  async function askForAction(): Promise<void> {
    const actionResponse: any = await inquirer.prompt([
      {
        name: "action",
        type: "list",
        message: chalk.redBright("What do you want to do?"),
        choices: ["Start", "Stop", "Reset"],
      },
    ]);

    if (actionResponse.action === "Start") {
      hours = userInputResponse.hours;
      minutes = userInputResponse.minutes;
      seconds = userInputResponse.seconds;
      countdown();
    } else if (actionResponse.action === "Stop") {
      process.exit();
    } else if (actionResponse.action === "Reset") {
      clearInterval(intervalId);
      main();
    }
  }

  countdown();
}

await greet();
await main();

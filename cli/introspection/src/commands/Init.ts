import { Command, arg, format } from '@prisma/cli'
import { isError } from 'util'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { printError, printFix } from '../prompt/utils/print'

export const defaultSchema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// The \`datasource\` block is used to specify the connection to your DB.
// Set the \`provider\` field to match your DB type: "postgresql", "mysql" or "sqlite".
// The \`url\` field must contain the connection string to your DB.
// Learn more about connection strings for your DB: https://pris.ly/connection-strings
datasource db {
  provider = "postgresql" // other options are: "mysql" and "sqlite"
  url      = "postgresql://johndoe:johndoe@localhost:5432/mydb?schema=public"
}
// Other examples for connection strings are:
// SQLite: url = "sqlite:./dev.db"
// MySQL:  url = "mysql://johndoe:johndoe@localhost:3306/mydb"
// You can also use environment variables to specify the connection string: https://pris.ly/prisma-schema#using-environment-variables

// By adding the \`generator\` block, you specify that you want to generate Prisma's DB client.
// The client is generated by runnning the \`prisma generate\` command and will be located in \`node_modules/@prisma\` and can be imported in your code as:
// import { Prisma Client } from '@prisma/client'
generator client {
  provider = "prisma-client-js"
}

// Next steps:
// 1. Add your DB connection string as the \`url\` of the \`datasource\` block
// 2. Run \`prisma2 introspect\` to get your data model into the schema
// 3. Run \`prisma2 generate\` to generate Prisma Client JS
// 4. Start using Prisma Client JS in your application`

export class Init implements Command {
  static new(): Init {
    return new Init()
  }

  private constructor() {}

  async parse(argv: string[]): Promise<any> {
    // parse the arguments according to the spec
    const args = arg(argv, {
      '--help': Boolean,
      '-h': '--help',
    })

    if (isError(args)) {
      return null
    }

    if (args['--help']) {
      return this.help()
    }

    const outputDirName = args._[0]
    const outputDir = outputDirName ? path.join(process.cwd(), outputDirName) : process.cwd()
    const prismaFolder = path.join(outputDir, 'prisma')

    if (fs.existsSync(path.join(outputDir, 'schema.prisma'))) {
      console.log(printError(`File ${chalk.bold('schema.prisma')} already exists in your project.
        Please try again in a project that is not yet using Prisma.
      `))
      process.exit(1)
    }

    if (fs.existsSync(prismaFolder)) {
      console.log(printError(`Folder ${chalk.bold('prisma')} already exists in your project.
        Please try again in a project that is not yet using Prisma.
      `))
      process.exit(1)
    }

    if (fs.existsSync(path.join(prismaFolder, 'schema.prisma'))) {
      console.log(printError(`File ${chalk.bold('prisma/schema.prisma')} already exists in your project.
        Please try again in a project that is not yet using Prisma.
      `))
      process.exit(1)
    }

    if (fs.existsSync(path.join(prismaFolder, 'schema.prisma'))) {
      console.log(printError(`File ${chalk.bold('prisma/schema.prisma')} already exists in your project.
        Please try again in a project that is not yet using Prisma.
      `))
      process.exit(1)
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }

    if (!fs.existsSync(prismaFolder)) {
      fs.mkdirSync(prismaFolder)
    }

    fs.writeFileSync(path.join(prismaFolder, 'schema.prisma'), defaultSchema)

    return format(`We created ${chalk.green('prisma/schema.prisma')} for you.
      Edit it with your favorite editor to update your database connection so Prisma can connect to it.

      When done, run ${chalk.green('prisma2 introspect')} to test the connection and introspect the data model from your existing database.
      Then run ${chalk.green('prisma2 generate')} to generate a Prisma Client based on this data model that can be used in your application.

      More information in our documentation:
      https://pris.ly/getting-started
    `)
  }

  help() {
    return console.log(
      format(`
        Usage: prisma2 init

        Setup Prisma for your existing database
      `),
    )
  }
}

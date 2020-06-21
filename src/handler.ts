import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {ExpressAdapter} from '@nestjs/platform-express';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {APIGatewayProxyHandler, Context} from 'aws-lambda';
import {createServer, proxy} from 'aws-serverless-express';
import express = require('express');
import {Server} from 'http';
import dotenv = require('dotenv');
import {moduleFactory} from './app.module';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServers: Server;

process.on('unhandledRejection', (reason) => {
  console.error(reason);
});

process.on('uncaughtException', (reason) => {
  console.error(reason);
});

const {parsed} = dotenv.config({
  path: process.cwd() + '/.env',
});
process.env = {...parsed, ...process.env};

function bootstrapServer(): Promise<Server> {
  try {
    const expressApp = express();

    const adapter = new ExpressAdapter(expressApp);

    return NestFactory.create(moduleFactory(), adapter)
      .then((app) => {
        const options = new DocumentBuilder().setVersion('0.0').build();

        const document = SwaggerModule.createDocument(app, options);

        SwaggerModule.setup('/swagger', app, document);

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        app.use(require('express-status-monitor')());

        app.enableCors();

        expressApp.get('/swagger', (_req, res) => {
          res.send(JSON.stringify(document));
        });

        app.useGlobalPipes(new ValidationPipe());

        return app.init();
      })
      .then(() => createServer(expressApp, undefined, binaryMimeTypes));
  } catch (error) {
    console.error(error);

    throw error;
  }
}

export const handler: APIGatewayProxyHandler = async (
  event: any,
  context: Context,
) => {
  if (!cachedServers) {
    const server = await bootstrapServer();
    cachedServers = server;
  }

  return proxy(cachedServers, event, context, 'PROMISE').promise;
};

import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger();
    const configService = app.get(ConfigService);
    const version = process.env.VERSION ?? configService.get("VERSION");
    const port = process.env.API_PORT ?? configService.get("API_PORT");
    const environment = process.env.NODE_ENV;
    const config = new DocumentBuilder()
      .setTitle(`ETrackings ${environment}`)
      .setDescription("The ETrackings API description")
      .setVersion(`v${version}`)
      .addTag("ETrackings")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("", app, document);
    app.enableCors({
      origin: true,
      methods: "*",
      credentials: true,
    });
    await app.listen(port, "0.0.0.0");
    logger.log(`Application listening on version ${version}`);
    logger.log(`Application listening on port ${port}`);
    logger.log(`Application listening on ENV ${environment}`);
  } catch (error) {
    console.log(`Application catch error msg ! ${error.message ?? ""}`)
  }
}
bootstrap();

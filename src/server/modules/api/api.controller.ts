import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  NotFoundException,
  NotAcceptableException
} from "@nestjs/common";

@Controller("hello")
export class ApiController {
  @Get()
  root() {
    return {
      message: "Hello World!"
    };
  }
}

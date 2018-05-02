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
  NotAcceptableException,
  Query
} from '@nestjs/common';
import { ProxyService } from '../proxy/proxy.service';
/**
 * Add @Controller annotation to declare your class as Router controller.
 * The first param is the global path for your controller.
 * The others params is the controller dependencies.
 *
 * In this case, EventCtrl is a dependency of TenantCtrl.
 * All routes of EventCtrl will be mounted on the `/calendars` path.
 */
@Controller('testing')
export class TestingController {
  constructor(private service: ProxyService) {}

  @Get(':name')
  async get(@Param('name') name: string, @Query() qs: any, @Body() body): Promise<any> {
    const test: any = await this.service.restRequest(name, 'GET', null, qs, body);
    if (test) {
      return test;
    }
    throw new NotFoundException('Test Function not found');
  }

  /**
   *
   * @param name
   * @returns {{id: number, name: string}}
   */
  @Post(':name')
  async post(@Param('name') name: string, @Query() qs: any, @Body() body): Promise<any> {
    const test: any = await this.service.restRequest(name, 'POST', null, qs, body);
    if (test) {
      return test;
    }
    throw new NotFoundException('Test Function not found');
  }

  /**
   *
   * @param id
   * @param name
   * @returns {Promise<any>}
   */
  @Put(':name')
  async put(@Param('name') name: string, @Query() qs: any, @Body() body): Promise<any> {
    const test: any = await this.service.restRequest(name, 'PUT', null, qs, body);
    if (test) {
      return test;
    }
    throw new NotFoundException('Test Function not found');
  }

}

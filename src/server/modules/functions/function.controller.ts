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
@Controller('functions')
export class FunctionController {
  constructor(private service: ProxyService) {}

  @Get()
  async list(): Promise<any> {
    const list: any = await this.service.getFunctions();
    if (list) {
      return list;
    }
    throw new NotFoundException('Functions not found');
  }

  /**
   * Example of customised call. You can use decorators to inject express object like `response` as `@Response`,
   * `request` as `@Request` and `next` as `@Next`.
   *
   * Another decorator are available to access quickly to the pathParams request. `@Params` take an expression in
   * first parameter.
   * @returns {{id: any, name: string}}
   */

  @Get(':name')
  async get(@Param('name') name: string): Promise<any> {
    console.log('name', name);
    const fn: any = await this.service.getFunction(name);
    if (fn) {
      return fn;
    }
    throw new NotFoundException('Function not found');
  }

  @Get(':name/raw')
  async getRaw(@Param('name') name: string): Promise<any> {
    console.log('name', name);
    const fn: any = await this.service.getPackage(name);
    if (fn) {
      return fn;
    }
    throw new NotFoundException('Function not found');
  }

  /**
   *
   * @param name
   * @returns {{id: number, name: string}}
   */
  @Post()
  async save(@Body() data: any): Promise<any> {
    const fn: any = await this.service.postFunction(data);
    if (fn) {
      return fn;
    }
    throw new NotAcceptableException('Function not created');
  }

  /**
   *
   * @param id
   * @param name
   * @returns {Promise<any>}
   */
  @Put(':name')
  async update(@Param('name') name: string, @Body() data: any): Promise<any> {
    const fn: any = await this.service.putFunction(data);
    if (fn) {
      return fn;
    }
    throw new NotAcceptableException('Function not updated');
  }

  /**
   *
   * @param id
   * @returns {{id: string, name: string}}
   */
  @Delete()
  @HttpCode(204)
  async remove(@Param('name') name: string, @Body() data: any): Promise<void> {
    const fn: any = await this.service.removeFunction(data);
    if (fn) {
      return null;
    }
    throw new NotAcceptableException('Function not deleted');
  }
}

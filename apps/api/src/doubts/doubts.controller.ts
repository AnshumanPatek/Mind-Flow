import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { DoubtsService } from './doubts.service';
import { CreateDoubtDto } from './dto/create-doubt.dto';
import { AddReplyDto } from './dto/add-reply.dto';

@Controller('doubts')
export class DoubtsController {
  constructor(private readonly doubtsService: DoubtsService) {}

  @Post()
  create(@Body() createDoubtDto: CreateDoubtDto) {
    return this.doubtsService.create(createDoubtDto);
  }

  @Get()
  findByGoal(@Query('goalId') goalId: string) {
    return this.doubtsService.findByGoal(goalId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doubtsService.findOne(id);
  }

  @Post(':id/reply')
  addReply(@Param('id') id: string, @Body() addReplyDto: AddReplyDto) {
    return this.doubtsService.addReply(id, addReplyDto);
  }

  @Patch(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.doubtsService.resolve(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doubtsService.remove(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { StudySessionsService } from './study-sessions.service';
import { CreateStudySessionDto } from './dto/create-study-session.dto';
import { QueryStudySessionDto } from './dto/query-study-session.dto';

@Controller('study-sessions')
export class StudySessionsController {
  constructor(private readonly studySessionsService: StudySessionsService) {}

  @Post()
  create(@Body() createDto: CreateStudySessionDto) {
    return this.studySessionsService.create(createDto);
  }

  @Get()
  findAll(@Query() query: QueryStudySessionDto) {
    return this.studySessionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studySessionsService.findById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studySessionsService.remove(id);
  }
}

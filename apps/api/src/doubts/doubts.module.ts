import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoubtsController } from './doubts.controller';
import { DoubtsService } from './doubts.service';
import { Doubt, DoubtSchema } from './schemas/doubt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Doubt.name, schema: DoubtSchema }]),
  ],
  controllers: [DoubtsController],
  providers: [DoubtsService],
  exports: [DoubtsService],
})
export class DoubtsModule {}

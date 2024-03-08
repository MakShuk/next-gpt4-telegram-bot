import { PartialType } from '@nestjs/mapped-types';
import { CreateTelegrafDto } from './create-telegraf.dto';

export class UpdateTelegrafDto extends PartialType(CreateTelegrafDto) {}

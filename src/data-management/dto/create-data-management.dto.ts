import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBotTokenDto {
  @IsString()
  @IsNotEmpty()
  @Length(46, 46)
  readonly token: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 35)
  readonly botName: string;
}

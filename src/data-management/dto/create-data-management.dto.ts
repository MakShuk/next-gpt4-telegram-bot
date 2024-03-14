import { IsInt, IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 15)
  readonly name: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(999_999_999)
  readonly maxUsers: number;
}

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

import { IsInt, IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 40)
  readonly name: string;

  @IsInt()
  @IsNotEmpty()
  @Min(999)
  @Max(999_999_999)
  readonly telegramId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(10)
  readonly roleId: number;
}

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

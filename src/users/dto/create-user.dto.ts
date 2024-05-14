import { IsInt, IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 40;
const ID_MIN_VALUE = 999;
const ID_MAX_VALUE = 999_999_999;
const ROLE_ID_MIN_VALUE = 1;
const ROLE_ID_MAX_VALUE = 10;

class NameDto {
  @IsString()
  @IsNotEmpty()
  @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
  readonly name!: string;
}
export class CreateUserDto extends NameDto {
  @IsInt()
  @IsNotEmpty()
  @Min(ID_MIN_VALUE)
  @Max(ID_MAX_VALUE)
  readonly telegramId!: number;

  @IsInt()
  @IsNotEmpty()
  @Min(ROLE_ID_MIN_VALUE)
  @Max(ROLE_ID_MAX_VALUE)
  readonly roleId: number | undefined;
}

export class CreateRoleDto extends NameDto {
  @IsInt()
  @IsNotEmpty()
  @Min(ROLE_ID_MIN_VALUE)
  @Max(ID_MAX_VALUE)
  readonly maxUsers!: number;
}

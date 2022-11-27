import { IsNotEmpty, IsNumber } from "class-validator";

export class GetUserRequest {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

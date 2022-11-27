import { Versions } from "@/common/constans";
import { PaginationParams, PaginationRequest } from "@/lib/pagination";
import { Controller, Get, Post, Body, Param, Put } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user-request.dto";
import { EditUserDto } from "./dto/edit-user-request.dto";
import { GetUserRequest } from "./dto/get-user-request.dto";
import { UsersService } from "./users.service";

@Controller(`${Versions.V1}/users`)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getUsers(@PaginationParams() pagination: PaginationRequest) {
    return this.userService.getUsers(pagination);
  }

  @Get("/:id")
  getUser(@Param() { id }: GetUserRequest) {
    return this.userService.getUser(id);
  }

  @Post("/create")
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @Put("/:id/edit")
  editUser(@Param() { id }: GetUserRequest, @Body() user: EditUserDto) {
    return this.userService.editUser(id, user);
  }
}

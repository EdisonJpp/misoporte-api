import { HashHelper } from "@/common/helpers/hash.helper";
import {
  Pagination,
  PaginationRequest,
  PaginationResponseDto,
} from "@/lib/pagination";
import {
  Injectable,
  UnprocessableEntityException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user-request.dto";
import { EditUserDto } from "./dto/edit-user-request.dto";
import { UserEntity } from "./entities/users.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
  ) {}

  /**
   * Get users list
   * @param pagination {PaginationRequest}
   * @returns [userEntities: UserEntity[], totalUsers: number]
   */
  public async getUsers(
    pagination: PaginationRequest
  ): Promise<PaginationResponseDto<UserEntity>> {
    const {
      skip,
      limit: take,
      order,
      params: { search },
    } = pagination;

    const query = this.userRepository
      .createQueryBuilder("u")
      .select(["u.id", "u.name", "u.lastName", "u.phone", "u.email"])
      .skip(skip)
      .take(take)
      .orderBy(order);

    if (search) {
      query.where(
        `
          u.last_name ILIKE :search
          OR u.name ILIKE :search
          `,
        { search: `%${search}%` }
      );
    }

    const [users, total] = await query.getManyAndCount();

    return Pagination.of(pagination, total, users);
  }

  /**
   *
   * @param id
   * @returns user: UserEntity
   */
  async getUser(id: number) {
    if (!id) throw new BadRequestException("must to send id param");

    const user = await this.userRepository
      .createQueryBuilder("u")
      .select(["u.id", "u.name", "u.lastName", "u.phone", "u.email"])
      .where("id = :id", { id })
      .getOne();

    if (!user) throw new NotFoundException(`not found user by id = ${id}`);
    return user;
  }

  /**
   * Create user and hash password
   * @param user
   * @returns UserEntity
   */
  async createUser(user: CreateUserDto) {
    const isExist = await this.isExistingEmail(user.email);

    if (isExist) {
      throw new UnprocessableEntityException("This email already exist");
    }

    const password = await HashHelper.encrypt(user.password);
    const created = this.userRepository.create({ ...user, password });
    return this.userRepository.save(created);
  }

  /**
   * Create user and hash password
   * @param user
   * @returns UserEntity
   */
  async editUser(id: number, payalod: EditUserDto) {
    const isExistEmail = await this.isExistingEmail(payalod.email, id);

    if (isExistEmail) {
      throw new UnprocessableEntityException("This email already exist");
    }

    const created = this.userRepository.create({ ...payalod, id });
    return this.userRepository.save(created);
  }

  /**
   *
   * @param email
   * @param id
   * @returns Boolean (true o false)
   */
  async isExistingEmail(email: string, id?: number) {
    if (!email) throw Error("must send email");

    const foundSameEmail = this.userRepository
      .createQueryBuilder("u")
      .select(["email", "id"])
      .where("email = :email", { email: email });

    if (id) foundSameEmail.andWhere("id != :id", { id });

    const count = await foundSameEmail.getCount();

    return Boolean(count);
  }
}

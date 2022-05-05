import { Injectable, Logger } from '@nestjs/common';
import { Role, UserEntity } from '../../../Domain/Entities/user.entity';
import { RepositoryService } from '../../../Infrastructure/Persistence/Repository/repository.service';
import { EncryptionService } from './encryption.service';

@Injectable()
export class UsersService {
  public constructor(
    private readonly repositoryService: RepositoryService,
    private readonly encryptionService: EncryptionService,
  ) {}

  private readonly logger = new Logger(UsersService.name);

  private async isAdmin(id: string) {
    this.logger.log(`Checking if user with id "${id}" is admin.`);
    let user;
    try {
      //prepare and run the query to select the user by id and retrieve its role
      user = await this.repositoryService.user.findUnique({
        where: { id },
        select: { role: true },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
    // if the user doesn't exist
    if (!user) {
      this.logger.warn(`User with id "${id}" doesn't exist.`);
      throw new Error('The user was not found.');
    }
    // if the user an admin
    if (user.role === Role.ADMIN) {
      this.logger.log(`User "${id}" is admin.`);
      return true;
    }
    this.logger.log(`User "${id}" is not admin.`);
    return false;
  }

  private async create(data: {
    passwordHash: string;
    email: string;
    name: string;
  }) {
    this.logger.log(`Creating user with email "${data.email}".`);
    const existentUser = await this.findByEmail(data.email);
    // if the user already exists
    if (existentUser) {
      this.logger.error(`User with email "${data.email}" already exists.`);
      throw new Error('The given email is already in use.');
    }
    try {
      // prepare and run the insert query
      const user = await this.repositoryService.user.create({
        data,
      });
      this.logger.log(
        `User "${user.id}" with email "${user.email}" was created.`,
      );
      // return the created user as a UserEntity
      return new UserEntity(user);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  private async findByEmail(email: string) {
    this.logger.log(`Finding user with email "${email}".`);
    // prepare and run the query to select the user by email and retrieve its id
    try {
      const user = await this.repositoryService.user.findUnique({
        where: { email },
        select: { id: true },
      });
      // if the user is found
      if (user) {
        this.logger.log(`User "${user.id}" with email "${email}" was found.`);
        // return the user's id
        return user.id;
      }
      this.logger.warn(`User with email "${email}" was not found.`);
      return null;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async findById(id: string) {
    this.logger.log(`Finding user with id "${id}".`);
    try {
      // prepare and run the query select the user by id and retrieve its data
      const user = await this.repositoryService.user.findUnique({
        where: { id },
      });
      // if the user is found
      if (user) {
        this.logger.log(`User "${user.id}" was found.`);
        // return the user as a UserEntity
        return new UserEntity(user);
      }
      this.logger.warn(`User with id "${id}" was not found.`);
      return null;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async getUser(id: string, requesterId: string) {
    this.logger.log(
      `Getting user with id "${id}" at the request of "${requesterId}".`,
    );
    if (id !== requesterId) {
      const requesterIsAdmin = await this.isAdmin(requesterId);
      if (!requesterIsAdmin) {
        this.logger.error(`User "${requesterId}" is not admin.`);
        throw new Error('You are not authorized to perform this action.');
      }
    }
    const user = await this.findById(id);
    if (!user) {
      this.logger.error(`User with id "${id}" doesn't exist.`);
      throw new Error('The user was not found.');
    }
    this.logger.log(`User "${user.id}" was found.`);
    return user;
  }

  public async changeUserData(
    id: string,
    requesterId: string,
    data: Partial<{
      password: string;
      email: string;
      name: string;
      role: Role;
    }>,
  ) {
    this.logger.log(`Changing user data for user with id "${id}".`);
    // if data is empty
    if (data && Object.keys(data).length === 0) {
      this.logger.error(`No data to change ${id}.`);
      throw new Error('No data to change was given.');
    }
    // get if the requester's role is admin
    const isAdmin = await this.isAdmin(requesterId);
    // if the requester is an admin or the requester is the user to change
    const isAuthorized = id === requesterId || isAdmin;
    if (!isAuthorized) {
      this.logger.warn(
        `User "${requesterId}" is not authorized to update user "${id}".`,
      );
      throw new Error('You are not authorized to update this user.');
    }
    // initialize the updated data as an empty object
    const updateData: Partial<{
      passwordHash: string;
      email: string;
      name: string;
      role: Role;
    }> = {};
    // get the user's data
    const user = await this.findById(id);
    // if the user is not found
    if (!user) {
      this.logger.warn(`User with id "${id}" was not found.`);
      throw new Error('The user was not found.');
    }
    // check if the user role is required to change
    if (data?.role && user.role !== data.role) {
      // if the requester is not an admin
      if (isAdmin) {
        this.logger.log(`User ${id} role will be changed to ${data.role}`);
        // add the new role to the updated data
        updateData.role = data.role;
      } else {
        this.logger.warn(`User "${requesterId}" is not authorized to roles.`);
        throw new Error(`You are not authorized to roles".`);
      }
    }
    // check if the password is required to change
    if (data?.password) {
      // get if it is the same as the current password
      const isTheSamePassword =
        await this.encryptionService.validateAgainstHash(
          data.password,
          user.passwordHash,
        );
      // if the password is not the same
      if (!isTheSamePassword) {
        const passwordHash = await this.encryptionService.hashString(
          data.password,
        );
        this.logger.log(`User "${id}" password will be changed.`);
        // add the new passwordHash to the updated data
        updateData.passwordHash = passwordHash;
      }
    }
    // check if the email is required to change
    if (data?.email && user.email !== data.email) {
      // get if the email is already in use
      const existentUser = await this.findByEmail(data.email);
      // if the email is already in use
      if (existentUser) {
        this.logger.warn(`User with email "${data.email}" already exists.`);
        throw new Error('The given email is already in use.');
      }
      this.logger.log(`User "${id}" email will be changed.`);
      // add the new email to the updated data
      updateData.email = data.email;
    }
    // check if the name is required to change
    if (data?.name && user.name !== data.name) {
      this.logger.log(`User "${id}" name will be changed.`);
      // add the new name to the updated data
      updateData.name = data.name;
    }
    // if there is no data to update
    if (Object.keys(updateData).length === 0) {
      this.logger.log(`User "${id}" data was not changed.`);
      // return the user as a UserEntity
      return new UserEntity(user);
      // if there is data to update
    } else {
      try {
        this.logger.log(`Updating user with id "${id}".`);
        // prepare and run the query to update the user
        const updateUser = await this.repositoryService.user.update({
          where: { id },
          data: updateData,
        });
        this.logger.log(`User "${user.id}" was updated.`);
        // return the updated user as a UserEntity
        return new UserEntity(updateUser);
      } catch (error) {
        this.logger.error(error.message);
        throw error;
      }
    }
  }

  public async validateCredentials(email: string, password: string) {
    this.logger.log(`Validating credentials for user with email "${email}".`);
    let user;
    try {
      // prepare and run the query to select the user by email and retrieve its id and password hash
      user = await this.repositoryService.user.findUnique({
        where: { email },
        select: { id: true, passwordHash: true },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
    // if the user is not found
    if (!user) {
      this.logger.warn(`User with email "${email}" doesn't exist exists.`);
      return false;
    }
    // if the user is found
    const isPasswordValid = await this.encryptionService.validateAgainstHash(
      password,
      user.passwordHash,
    );
    // if the password is not valid
    if (!isPasswordValid) {
      this.logger.warn('The given password is not valid.');
      return false;
    }
    // if the password is valid
    // return the user's id
    this.logger.log(`Credentials validated for user "${user.id}".`);
    return user.id;
  }

  public async register(data: {
    password: string;
    email: string;
    name: string;
  }) {
    //hash the password
    const passwordHash = await this.encryptionService.hashString(data.password);
    const userData = {
      passwordHash,
      email: data.email,
      name: data.name,
    };
    const user = await this.create(userData);
    this.logger.log(`User "${user.id}" was registered.`);
    return user;
  }

  public async defaultAdminInit(data: {
    password: string;
    email: string;
    name: string;
  }) {
    this.logger.log(`Adding default admin: "${data.name}".`);
    const passwordHash = await this.encryptionService.hashString(data.password);
    const existentUser = await this.findByEmail(data.email);
    // if the doesn't already exists user already exists
    if (!existentUser) {
      try {
        const user = await this.repositoryService.user.create({
          data: {
            role: Role.ADMIN,
            passwordHash,
            email: data.email,
            name: data.name,
          },
        });
        this.logger.log(`Default admin "${data.name}" was added.`);
        return new UserEntity(user);
      } catch (error) {
        this.logger.error(error.message);
        throw error;
      }
    } else {
      this.logger.log(`Default admin "${data.name}" already exists.`);
      const user = await this.findById(existentUser);
      return new UserEntity(user);
    }
  }
}

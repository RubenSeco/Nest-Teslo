import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';



@Injectable()
export class SeedService {

  constructor(
    // Inject the products service
    private readonly productService: ProductsService,

    @InjectRepository(User)
    private readonly useRepository: Repository<User>

  ) { }



  async runSeed() {

    await this.deleteTables();

    const adminUser = await this.insertUser();

    await this.insertNewProduct(adminUser);

    return ('Seed executed');
  }

  private async deleteTables() {

    await this.productService.deleteAllProducts();

    const queryBuilder = this.useRepository.createQueryBuilder();

    await queryBuilder.delete().where({}).execute();

  }

  private async insertUser() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach((user) => {

      user.password = bcrypt.hashSync(user.password, 10);

      users.push(this.useRepository.create(user));

    });

    const dbUsers = await this.useRepository.save(seedUsers);

    return dbUsers[0];
  }

  private async insertNewProduct(user: User) {

    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productService.create(product, user));

    });

    await Promise.all(insertPromises);

    return true;
  }
}


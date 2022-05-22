import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { prepare } from '../../src/Aplication/aplication';
import { AppModule } from '../../src/Aplication/DI/app.module';

describe('Authentification Endpoints', () => {
  const email = process.env.DEFAULT_ADMIN_EMAIL;
  const password = process.env.DEFAULT_ADMIN_PASSWORD;
  const name = process.env.DEFAULT_ADMIN_NAME;

  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await prepare(app);
    await app.init();
  });

  it('/authentification (POST) with credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/authentification')
      .send({
        email,
        password,
      })
      .expect(201);

    token = response.text;

    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie']).toContain(
      `Authentication=${token}; Path=/`,
    );
  });

  it('/authentification (POST) with wrong credentials', async () => {
    await request(app.getHttpServer())
      .post('/authentification')
      .send({
        email: 'wrong' + email,
        password,
      })
      .expect(403);
  });

  it('/authentification (POST) with no credentials', async () => {
    await request(app.getHttpServer()).post('/authentification').expect(400);
  });

  it('authentification/details (GET) with no header or cookie', async () => {
    await request(app.getHttpServer())
      .get('/authentification/details')
      .expect(401);
  });

  it('authentification/details (GET) with wrong token format', async () => {
    await request(app.getHttpServer())
      .get('/authentification/details')
      .set('Authorization', token)
      .expect(401);
  });

  it('authentification/details (GET) with wrong token', async () => {
    await request(app.getHttpServer())
      .get('/authentification/details')
      .set('Authorization', 'wrong')
      .expect(401);
  });

  it('authentification/details (GET) with header', async () => {
    const response = await request(app.getHttpServer())
      .get('/authentification/details')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.email).toBeDefined();
    expect(response.body.email).toBe(email);
    expect(response.body.role).toBeDefined();
    expect(response.body.role).toBe('ADMIN');
    expect(response.body.name).toBeDefined();
    expect(response.body.name).toBe(name);
  });

  it('authentification/details (GET) with cookie', async () => {
    const response = await request(app.getHttpServer())
      .get('/authentification/details')
      .set('Cookie', `Authentication=${token};`)
      .expect(200);

    expect(response.body.email).toBeDefined();
    expect(response.body.email).toBe(email);
    expect(response.body.role).toBeDefined();
    expect(response.body.role).toBe('ADMIN');
    expect(response.body.name).toBeDefined();
    expect(response.body.name).toBe(name);
  });

  afterAll(async () => {
    await app.close();
  });
});

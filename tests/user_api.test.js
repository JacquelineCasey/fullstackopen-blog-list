
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const User = require('../models/user');
const helper = require('./test_helper');


const api = supertest(app);

beforeAll(async () => {
    await app.connection;
}, 20000);

beforeEach(async () => {
    await User.deleteMany({});

    await Promise.all(helper.initialUsers.map(user => new User(user).save()));
});


describe('GET /api/users/', () => {
    test('returns all users as json', async () => {
        const response = await api.get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(response.body).toHaveLength(helper.initialUsers.length);
    });

    test('contains correct info on a specific user', async () => {
        const response = await api.get('/api/users');

        const firstUser = response.body.find(user => user.username === helper.initialUsers[0].username);

        expect(firstUser).toBeDefined();
        expect(firstUser.id).toBeDefined();
        expect(firstUser.name).toBe(helper.initialUsers[0].name);

        expect(firstUser._id).toBeUndefined();
        expect(firstUser.__v).toBeUndefined();
        expect(firstUser.passwordHash).toBeUndefined();
    });
});


afterAll(() => {
    mongoose.connection.close();
});

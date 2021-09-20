
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const User = require('../models/user');
const helper = require('./test_helper');


const api = supertest(app);

beforeAll(async () => {
    await app.connectToDatabase();
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

describe('POST /api/users/', () => {
    const validUser = {
        username: 'a_new_user',
        name: 'a name',
        password: 'pass'
    };

    test('the database returns the posted user as JSON', async () => {
        const response = await api.post('/api/users')
            .send(validUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        expect(response.body.username).toBe(validUser.username);
        expect(response.body.name).toBe(validUser.name);
        expect(response.body.password).toBeUndefined();
        expect(response.body.passwordHash).toBeUndefined();
    });

    test('the database contains the new user', async () => {
        await api.post('/api/users').send(validUser);

        const foundUser = await User.findOne({username: validUser.username});

        expect(foundUser).toBeDefined();
        expect(foundUser.name).toBe(validUser.name);
        expect(foundUser.password).toBeUndefined;

        // Mongoose object actually does contain passwordHash (JSON object does not)
        expect(bcrypt.compare(validUser.password, foundUser.passwordHash)).toBeTruthy();
    });

    describe('Users are rejected for the following reasons: ', () => {
        const badUsers = [
            {user: {username: 'ab', password: 'abcdefg', name: 'name'}, reason: 'short username'},
            {user: {password: 'abcdefg', name: 'name'}, reason: 'no username'},
            {user: {username: helper.initialUsers[0].username, password: 'abcdefg', name: 'name'}, reason: 'non-unique username'},
            {user: {username: 'bob', password: 'ab', name: 'name'}, reason: 'short password'},
            {user: {username: 'bob', name: 'name'}, reason: 'no password'}
        ];

        for (const {user, reason} of badUsers) {
            test(reason, async () => {
                const response = await api.post('/api/users').send(user).expect(400);

                expect(response.body.error).toBeDefined();
            });
        }
    });
});


afterAll(() => {
    mongoose.connection.close();
});

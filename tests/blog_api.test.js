
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');


const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});

    await Promise.all(
        helper.initialBlogs.map(blog => new Blog(blog).save())
    );
});


describe('GET /', () => {
    test('all notes are returned as json with 200', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(response.body).toHaveLength(helper.initialBlogs.length);
    });

    test('returned notes have "id" property instead of "_id"', async () => {
        const blogs = await helper.databaseAllBlogs();

        blogs.forEach(blog => {
            expect(blog._id).toBeUndefined();
            expect(blog.id).toBeDefined();
        });
    });
});

describe('POST /', () => {
    const blogToSend = {
        title: 'new blog title',
        author: 'new blog author',
        url: 'new blog string',
        likes: 0
    };

    const blogToSendNoLikes = {
        title: 'No likes',
        author: 'somebody',
        url: 'htpp://userForgotToSendLikesProperty/weWillForgiveHimAnyway.com'
    };

    test('the database returns the sent note as JSON', async () => {
        const response = await api
            .post('/api/blogs')
            .send(blogToSend)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        expect(response.body).toMatchObject(blogToSend); // Can have extra properties (id)
    });

    test('the database has one more note after', async () => {
        await api.post('/api/blogs').send(blogToSend);

        const blogs = await helper.databaseAllBlogs();
        expect(blogs.length).toBe(helper.initialBlogs.length + 1);
    });

    test('missing likes property is replaced with 0', async () => {
        await api.post('/api/blogs').send(blogToSendNoLikes);

        const blogs = await helper.databaseAllBlogs();
        expect(blogs.find(b => b.title === blogToSendNoLikes.title))
            .toMatchObject({likes: 0});
    });
});


afterAll(() => {
    mongoose.connection.close();
});

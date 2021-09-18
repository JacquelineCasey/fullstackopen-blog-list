
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
        const blogs = await helper.fetchAllBlogs();

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

    const blogToSendNoTitle = {
        author: 'Guy who forgot to title his work',
        url: 'http://oops.com',
        likes: 0
    };

    const blogToSendNoUrl = {
        title: 'This is a Book',
        author: 'book author',
        likes: 100
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

        const blogs = await helper.fetchAllBlogs();
        expect(blogs.length).toBe(helper.initialBlogs.length + 1);
    });

    test('missing likes property is replaced with 0', async () => {
        await api.post('/api/blogs').send(blogToSendNoLikes);

        const blogs = await helper.fetchAllBlogs();
        expect(blogs.find(b => b.title === blogToSendNoLikes.title))
            .toMatchObject({likes: 0});
    });

    test('missing title property causes 400 error code', async () => {
        await api.post('/api/blogs').send(blogToSendNoTitle)
            .expect(400);

        const blogs = await helper.fetchAllBlogs();
        expect(blogs).toHaveLength(helper.initialBlogs.length);
    });

    test('missing url property causes 400 error code', async () => {
        await api.post('/api/blogs').send(blogToSendNoUrl)
            .expect(400);

        const blogs = await helper.fetchAllBlogs();
        expect(blogs).toHaveLength(helper.initialBlogs.length);
    });
});

describe('DELETE /:id', () => {
    test('Returns 204 No Content and deletes the note', async () => {
        let blogs = await helper.fetchAllBlogs();
        const blog0 = blogs[0];

        await api.delete(`/api/blogs/${blog0.id}`)
            .expect(204);

        blogs = await helper.fetchAllBlogs();
        expect(blogs).toHaveLength(helper.initialBlogs.length - 1);
        expect(blogs.some(b => b.id === blog0.id)).toBeFalsy();
    });

    test('No such id: Returns 204 No Content and does nothing', async () => {
        const fakeButValidID = '000000000000000000000000'; // 24 digits is valid format

        await api.delete(`/api/blogs/${fakeButValidID}`)
            .expect(204);

        const blogs = await helper.fetchAllBlogs();
        expect(blogs).toHaveLength(helper.initialBlogs.length);
    });

    test('Invalid id format: Returns 400 Bad Request and does nothing', async () => {
        const invalidID = 'invalid'; // invalid format

        await api.delete(`/api/blogs/${invalidID}`)
            .expect(400);

        const blogs = await helper.fetchAllBlogs();
        expect(blogs).toHaveLength(helper.initialBlogs.length);
    });
});

describe('PUT /:id', () => {
    test('changes the blog with the same id, and returns the updated blog', async () => {
        const newBlog = {
            title: 'A new blog',
            author: 'Blogger McBlogface',
            url: 'http://blog.com',
            likes: 2000
        };

        let blogs = await helper.fetchAllBlogs();
        const response = await api.put(`/api/blogs/${blogs[0].id}`)
            .send(newBlog)
            .expect(200);

        const returnedBlog = response.body;
        expect(returnedBlog).toMatchObject(newBlog);
        blogs = await helper.fetchAllBlogs();
        expect(returnedBlog).toEqual(blogs.find(b => b.title === returnedBlog.title));
    });
});

afterAll(() => {
    mongoose.connection.close();
});

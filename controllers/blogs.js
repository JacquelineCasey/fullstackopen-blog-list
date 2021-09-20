
const blogsRouter = require('express').Router();

const Blog = require('../models/blog');
const middleware = require('../utils/middleware');


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', {username: 1, name: 1, id: 1});

    response.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const user = request.user;

    const blog = new Blog({
        ...request.body,
        user: user
    });

    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();

    response.status(201).json(result);
});

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
    const found_blog = await Blog.findById(request.params.id);
    const user = request.user;

    if (!found_blog)
        return next({name: 'NotFoundError', message: 'Could not find that post'});
    if (found_blog.user.toString() !== user._id.toString()) // Objects must be cast to string
        return next({name: 'AuthenticationError', message: 'User does not own this post'});

    await found_blog.delete();
    user.blogs = user.blogs.filter(blogId => blogId.toString() !== found_blog.id.toString()); // Have to compare them as strings
    await user.save();

    response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
    const newBlog = {
        title: request.body.title,
        url: request.body.url,
        author: request.body.author,
        likes: request.body.likes
    };

    // Return the new note not the old.
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {new: true});

    if (!updatedBlog) // Mongoose did not fail, but nothing found.
        return response.status(404).send();

    response.json(updatedBlog);
});

module.exports = blogsRouter;

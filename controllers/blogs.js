
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body);

    const result = await blog.save();
    response.status(201).json(result);
});

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id);
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

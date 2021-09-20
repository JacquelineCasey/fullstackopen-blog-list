
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', {username: 1, name: 1, id: 1});

    response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
    const user = await User.findOne({});

    const blog = new Blog({
        ...request.body,
        user: user
    });

    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();

    response.status(201).json(result);
});

blogsRouter.delete('/:id', async (request, response) => {
    const removed_blog = await Blog.findByIdAndDelete(request.params.id);

    const user = await User.findById(removed_blog.user._id);
    user.blogs = user.blogs.filter(blogId => blogId.toString() !== removed_blog.id.toString()); // Have to compare them as strings
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

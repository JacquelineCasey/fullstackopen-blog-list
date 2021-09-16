
const _ = require('lodash'); // Lodash recommends use '_' as the library object.

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    return blogs.reduce((likesSoFar, blog) => likesSoFar + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null;
    return blogs.reduce((previousBest, next) =>
        (previousBest.likes > next.likes) ? previousBest : next);
};

const mostBlogs = (blogList) => {
    const [author, blogs] = _
        .chain(blogList)
        .groupBy((blog) => blog.author)
        .mapValues((blog_arr) => blog_arr.length)
        .toPairs()
        .reduce((a, b) => a[1] > b[1] ? a : b, [null, 0])
        .value();

    return {author, blogs};

    /* Solution explained:
     * - To avoid dealing with nesting, or passing around state, we use _.chain(),
     *   which wraps the value into a lodash object that can call functions we
     *   would normally need _ for.
     * - We group blogs by the author field. We now have an object that
     *   maps authors to arrays of their blogs.
     * - We map the values of that object to their lengths. We have an object that
     *   maps authors to their number of blogs.
     * - We use toPairs() to generate an array of key-value tuples (arrays: [author, blog])
     * - This is standard javascript reduce, bringing us to one author with the
     *   most posts.
     * - We unwrap the lodash object, bringing us back to a standard javascript
     *   value (a tuple / array).
     *
     * Finally, we destructure this array-tuple and return it as an object. */
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
};

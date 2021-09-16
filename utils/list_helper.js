

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    return blogs.reduce((likesSoFar, blog) => likesSoFar + blog.likes, 0);
};

const favoriteBlog = (blogs) => {

};


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
};

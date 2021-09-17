
# Blog List

This project is related to this part of the course: https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2.

## Exercises

The project is involved in the following exercises:
- 4.1: Expand a given application body into a fully working npm project.
- 4.2: Refactor the project into modules, as we did [here](https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#project-structure).
- 4.3: Add a `dummy` function to `utils/list_helper.js`, and setup the testing system.
- 4.4: Write and test `totalLikes()`, which returns the total number of likes in a blog list.
- 4.5: Write and test `favoriteBlog()`, which returns the favorite blog.
  - When comparing objects, `toEqual()` is better than `toBe()`, which only comparse values (address / reference).
- 4.6: Write and test `mostBlogs`. This is a good time to try out the `Lodash` library.
- 4.7: Write and test `mostLikes`.
- 4.8: Write test(s) for `GET api/blogs`. Then make it use async await.
- 4.9: Make sure (through testing) that `GET api/blogs` returns objects with a
       `id` property, instead of `_id`.
- 4.10: Write test(s) for `POST api/blogs`. Then make it use async await.
- 4.11: Write a test that checks that if the likes property is missing, it is set to zero.
        Make this behavior happen. 
- 4.12: Write a test that ensures that 400 is sent if either `title` or `url` are missing.

## Playing with continuous integration

My first big mistake was assuming github could connect to the database, when in
reality it does not have the URI. It is possible to add it in settings. (encrypted)
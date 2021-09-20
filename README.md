
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
- 4.13: Add functionality for deleting blog posts. Verify that it works (tests or REST api).
- 4.14: Add functionality for PUT.
- 4.15: Add users, and the ability to add them via `POST api/users`
  - Users have a username, a name, and a password (and implicitly, and id).
- 4.16: Add restrictions on username, and password. Mongoose validators won't work,
        since they receive the password hash.

  


## Playing with continuous integration

My first big mistake was assuming github could connect to the database, when in
reality it does not have the URI. It is possible to add it in settings, under 
environments.

Jest gave weird errors, so I followed the advice here, which revealed the true
errors from Mongoose. After I fixed those, I removed the fix here.
(https://github.com/facebook/jest/issues/11607)

Setting up a github environment seemed not to work, but the current system
does work. See the current `main.yml` file. Also, maybe quotes were getting in
the way, so I eventually took them out.
- github does use the same uri as we do, so try not to run tests locally at the
  same time. I could change it on github in the future.
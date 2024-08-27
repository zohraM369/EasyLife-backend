/**
 * @swagger
 * /login:
 *  post:
 *      summary: Login user
 *      description: Login user with the provided details
 *      tags:
 *          - Authentification
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Login'
 *      responses:
 *          200:
 *              description: Login successfully.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/User'
 *          401:
 *              $ref: '#/components/responses/ErrorLogin'
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /user:
 *  post:
 *      summary: Create a new user
 *      description : Create a new user with the provided details
 *      tags:
 *          - User
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          201:
 *              description: User created successfully.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          403:
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a user by their ID.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A user object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       405:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add multiple users
 *     description: Create multiple users with the provided details.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Users created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       405:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get multiple users by IDs
 *     description: Retrieve multiple users by their IDs.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           example: ["6696711304c71eaa5de75189", "6696711304c71eaa5de75187"]
 *         description: The list of user IDs
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       405:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /user:
 *  post:
 *      summary: Create a new user
 *      description : Create a new user with the provided details
 *      tags:
 *          - User
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          201:
 *              description: User created successfully.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          403:
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /users_by_filters:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve a paginated list of users with optional search query. This endpoint is protected by JWT.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: The page number to retrieve
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         description: The number of users per page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: q
 *         in: query
 *         description: The search query to filter users
 *         required: false
 *         schema:
 *           type: string
 *           example: johndoe
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 count:
 *                   type: integer
 *                   description: The total number of users
 *                   example: 100
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       405:
 *          $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *       500:
 *         description: Internal server error.
 */

/**
 *
 * @swagger
 * /user:
 *  delete:
 *      summary: Delete one user
 *      description : delete one user by using ID
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Object ID of the user to delete
 *      tags:
 *          - User
 *      responses:
 *          200:
 *              description: User deleted successfully.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/User'
 *          403:
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete multiple users
 *     description: Delete multiple users by their IDs.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           example: ["6696711304c71eaa5de75189", "6696711304c71eaa5de75187"]
 *         description: The list of user IDs
 *     responses:
 *       200:
 *         description: Users deleted successfully.
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       405:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error.
 */

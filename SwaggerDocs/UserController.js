/**
 * @swagger
 * auth/login:
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
 * /logout:
 *  post:
 *      summary: Logout user
 *      description: Logout user with the provided details
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Authentification
 *      requestBody:
 *          required: false
 *      responses:
 *          200:
 *              description: Logout successfully.
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
 * /auth/register:
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
 * /auth/user/{id}:
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
 * /auth/users:
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
 *
 * @swagger
 * /auth/delete_user/{id}:
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

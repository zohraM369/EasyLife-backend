/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     TodoItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *   responses:
 *     NotFound:
 *       description: Resource not found
 *     ValidationError:
 *       description: Validation error
 */

/**
 * @swagger
 * /tasks/add_task:
 *  post:
 *      summary: Create a new TodoItem
 *      description: Create a new TodoItem with the provided details
 *      tags:
 *          - TodoItem
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/TodoItem'
 *      responses:
 *          201:
 *              description: TodoItem created successfully.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/TodoItem'
 *          403:
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description: Internal server error
 */

// Apply similar changes for each of the endpoints, adding the `security` section for bearerAuth

/**
 * @swagger
 * /tasks/add_team_member_to_task:
 *  post:
 *      summary: Add a team member to a task
 *      description: Adds a team member to a specified task
 *      tags:
 *          - TodoItem
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/TodoItem'
 *      responses:
 *          201:
 *              description: Team member added successfully.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/TodoItem'
 *          403:
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description: Internal server error
 */

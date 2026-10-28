import express from 'express';

import { openapiRoute } from './openapiRoute.ts';
import {
  createSubmissionController,
  deleteSubmissionController,
  getSubmissionController,
  listSubmissionsController
} from '#src/controllers/submission';
import { requireSomeAuth } from '#src/middleware/requireSomeAuth';
import { submissionPageSchema, submissionSchema } from '#src/schemas/response/submission';
import { NOT_FOUND_RESPONSE, UNAUTHORIZED_RESPONSE, VALIDATION_ERROR_RESPONSE } from '#src/schemas/response/problem';
import { schema } from '#src/schemas/request/submission';

const basePath = '/submission';
const router = express.Router();
router.use(requireSomeAuth);

openapiRoute(basePath, router, {
  method: 'get',
  path: '/',
  operationId: 'listSubmissions',
  summary: 'List submissions, newest first',
  tags: ['Submission'],
  schema: schema.listSubmissions,
  responses: {
    200: { description: 'A page of submissions and the total number of submissions', schema: submissionPageSchema },
    401: UNAUTHORIZED_RESPONSE,
    422: VALIDATION_ERROR_RESPONSE
  },
  handler: listSubmissionsController
});

openapiRoute(basePath, router, {
  method: 'post',
  path: '/',
  operationId: 'createSubmission',
  summary: 'Save a demo form submission',
  tags: ['Submission'],
  schema: schema.createSubmission,
  responses: {
    201: { description: 'The saved submission', schema: submissionSchema },
    401: UNAUTHORIZED_RESPONSE,
    422: VALIDATION_ERROR_RESPONSE
  },
  handler: createSubmissionController
});

openapiRoute(basePath, router, {
  method: 'get',
  path: '/:submissionId',
  operationId: 'getSubmission',
  summary: 'Get a submission',
  tags: ['Submission'],
  schema: schema.getSubmission,
  responses: {
    200: { description: 'The submission', schema: submissionSchema },
    401: UNAUTHORIZED_RESPONSE,
    404: NOT_FOUND_RESPONSE,
    422: VALIDATION_ERROR_RESPONSE
  },
  handler: getSubmissionController
});

openapiRoute(basePath, router, {
  method: 'delete',
  path: '/:submissionId',
  operationId: 'deleteSubmission',
  summary: 'Soft delete a submission',
  tags: ['Submission'],
  schema: schema.deleteSubmission,
  responses: {
    204: { description: 'The submission was deleted' },
    401: UNAUTHORIZED_RESPONSE,
    404: NOT_FOUND_RESPONSE,
    422: VALIDATION_ERROR_RESPONSE
  },
  handler: deleteSubmissionController
});

export default router;

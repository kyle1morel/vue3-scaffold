import {
  createSubmissionService,
  deleteSubmissionService,
  getSubmissionService,
  listSubmissionsService
} from '#src/services/submission';

import type { Request, Response } from 'express';
import type {
  CreateSubmissionRequest,
  ListSubmissionsQuery,
  Submission,
  SubmissionIdParams,
  SubmissionPage
} from '#types';

/**
 * Saves the submission in the request body.
 * @param req - The request, whose body holds the submitted form values.
 * @param res - The response, sent the saved submission.
 */
export const createSubmissionController = async (
  req: Request<never, never, CreateSubmissionRequest, never>,
  res: Response<Submission>
) => {
  const response = await createSubmissionService(req.body);

  res.status(201).json(response);
};

/**
 * Soft deletes the submission in the path.
 * @param req - The request, whose params hold the submission id.
 * @param res - The response, sent no content.
 */
export const deleteSubmissionController = async (
  req: Request<SubmissionIdParams, never, never, never>,
  res: Response
) => {
  await deleteSubmissionService(req.params.submissionId);

  res.status(204).end();
};

/**
 * Gets the submission in the path.
 * @param req - The request, whose params hold the submission id.
 * @param res - The response, sent the submission.
 */
export const getSubmissionController = async (
  req: Request<SubmissionIdParams, never, never, never>,
  res: Response<Submission>
) => {
  const response = await getSubmissionService(req.params.submissionId);

  res.status(200).json(response);
};

/**
 * Lists one page of submissions.
 * @param req - The request, whose query holds the page and page size.
 * @param res - The response, sent the page of submissions and the total.
 */
export const listSubmissionsController = async (
  req: Request<never, never, never, ListSubmissionsQuery>,
  res: Response<SubmissionPage>
) => {
  const response = await listSubmissionsService({
    page: req.query.page,
    pageSize: req.query.pageSize
  });

  res.status(200).json(response);
};

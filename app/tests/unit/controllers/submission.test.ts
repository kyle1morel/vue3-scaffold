import { TEST_CURRENT_CONTEXT, TEST_SUBMISSION_1 } from '#tests/unit/data/index';
import {
  createSubmissionController,
  deleteSubmissionController,
  getSubmissionController,
  listSubmissionsController
} from '#src/controllers/submission';
import * as submissionService from '#src/services/submission';

import type { Request, Response } from 'express';
import type { Mock } from 'vitest';
import type { CreateSubmissionRequest, ListSubmissionsQuery, SubmissionIdParams } from '#types';

const mockResponse = () => {
  const res: { locals: Record<string, unknown>; status?: Mock; json?: Mock; end?: Mock } = {
    locals: {}
  };
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.end = vi.fn().mockReturnValue(res);
  return res;
};

let res = mockResponse();
beforeEach(() => {
  res = mockResponse();
  res.locals.currentContext = TEST_CURRENT_CONTEXT;
  vi.clearAllMocks();
});

describe('createSubmissionController', () => {
  it('should save the request body and respond with 201', async () => {
    vi.spyOn(submissionService, 'createSubmissionService').mockResolvedValueOnce(TEST_SUBMISSION_1);

    const body: CreateSubmissionRequest = {
      firstName: 'Jane',
      email: 'jane.doe@example.com',
      province: 'BC',
      contactMethod: 'email'
    };
    const req = { body } as unknown as Request<never, never, CreateSubmissionRequest, never>;

    await createSubmissionController(req, res as unknown as Response);

    expect(submissionService.createSubmissionService).toHaveBeenCalledWith(body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(TEST_SUBMISSION_1);
  });
});

describe('deleteSubmissionController', () => {
  it('should delete the submission in the path and respond with 204', async () => {
    vi.spyOn(submissionService, 'deleteSubmissionService').mockResolvedValueOnce();

    const req = { params: { submissionId: TEST_SUBMISSION_1.id } } as unknown as Request<
      SubmissionIdParams,
      never,
      never,
      never
    >;

    await deleteSubmissionController(req, res as unknown as Response);

    expect(submissionService.deleteSubmissionService).toHaveBeenCalledWith(TEST_SUBMISSION_1.id);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });
});

describe('getSubmissionController', () => {
  it('should get the submission in the path and respond with 200', async () => {
    vi.spyOn(submissionService, 'getSubmissionService').mockResolvedValueOnce(TEST_SUBMISSION_1);

    const req = { params: { submissionId: TEST_SUBMISSION_1.id } } as unknown as Request<
      SubmissionIdParams,
      never,
      never,
      never
    >;

    await getSubmissionController(req, res as unknown as Response);

    expect(submissionService.getSubmissionService).toHaveBeenCalledWith(TEST_SUBMISSION_1.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(TEST_SUBMISSION_1);
  });
});

describe('listSubmissionsController', () => {
  it('should get the requested page and respond with 200', async () => {
    const page = { items: [TEST_SUBMISSION_1], total: 1 };
    vi.spyOn(submissionService, 'listSubmissionsService').mockResolvedValueOnce(page);

    const req = { query: { page: 2, pageSize: 5 } } as unknown as Request<never, never, never, ListSubmissionsQuery>;

    await listSubmissionsController(req, res as unknown as Response);

    expect(submissionService.listSubmissionsService).toHaveBeenCalledWith({ page: 2, pageSize: 5 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(page);
  });
});

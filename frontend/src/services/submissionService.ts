import { api } from './apiClient';
import { createRouteBuilder } from './routeBuilder';

import type { QueryParams, RequestBody, Submission, SubmissionPage } from '@/types';

/**
 * Base route builder and endpoint definitions for this resource.
 * Routes should be referenced through this object rather than
 * constructing endpoint paths directly within service methods.
 */
const submissionRoute = createRouteBuilder('submission');

const submissionRoutes = {
  byId: (submissionId: string) => submissionRoute(submissionId),
  root: () => submissionRoute()
} as const;

/**
 * Saves a demo form submission.
 * @param req - The submitted form values.
 * @returns A promise resolving to the saved submission.
 */
export function createSubmission(req: RequestBody<'createSubmission'>): Promise<Submission> {
  return api.post<Submission>(submissionRoutes.root(), req);
}

/**
 * Soft deletes a submission.
 * @param submissionId - The submission id.
 * @returns A promise resolving once the submission is deleted.
 */
export function deleteSubmission(submissionId: string): Promise<void> {
  return api.delete<void>(submissionRoutes.byId(submissionId));
}

/**
 * Gets a submission.
 * @param submissionId - The submission id.
 * @returns A promise resolving to the submission.
 */
export function getSubmission(submissionId: string): Promise<Submission> {
  return api.get<Submission>(submissionRoutes.byId(submissionId));
}

/**
 * Gets one page of submissions, newest first.
 * @param params - The 1-based page number and the page size.
 * @returns A promise resolving to the page of submissions and the total number of submissions.
 */
export function listSubmissions(params: QueryParams<'listSubmissions'>): Promise<SubmissionPage> {
  return api.get<SubmissionPage>(submissionRoutes.root(), { params });
}

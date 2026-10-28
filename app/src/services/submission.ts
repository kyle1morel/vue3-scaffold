import { randomUUID } from 'node:crypto';

import { unitOfWork } from '#src/db/unitOfWork';

import type { CreateSubmissionRequest, ListSubmissionsQuery, Submission, SubmissionPage } from '#types';

/**
 * Saves a demo form submission.
 * @param data - The submitted form values.
 * @returns A Promise that resolves to the saved submission.
 */
export const createSubmissionService = async (data: CreateSubmissionRequest): Promise<Submission> => {
  return await unitOfWork.execute(
    async ({ submission }) =>
      await submission.create({
        ...data,
        id: randomUUID(),
        startDate: data.startDate ? new Date(data.startDate) : null
      })
  );
};

/**
 * Soft deletes a submission.
 * @param id - The submission id.
 * @returns A Promise that resolves once the submission is deleted.
 * @throws {@link NotFoundProblem} When no undeleted submission has the id.
 */
export const deleteSubmissionService = async (id: string): Promise<void> => {
  await unitOfWork.execute(async ({ submission }) => await submission.delete({ id }));
};

/**
 * Gets a submission by id.
 * @param id - The submission id.
 * @returns A Promise that resolves to the submission.
 * @throws {@link NotFoundProblem} When no undeleted submission has the id.
 */
export const getSubmissionService = async (id: string): Promise<Submission> => {
  return await unitOfWork.execute(async ({ submission }) => await submission.findUniqueOrThrow({ where: { id } }));
};

/**
 * Gets one page of submissions, newest first.
 * @param params - The paging parameters.
 * @param params.page - The 1-based page number.
 * @param params.pageSize - The number of submissions per page.
 * @returns A Promise that resolves to the page of submissions and the total number of submissions.
 */
export const listSubmissionsService = async ({ page, pageSize }: ListSubmissionsQuery): Promise<SubmissionPage> => {
  return await unitOfWork.execute(async ({ submission }) => {
    const items = await submission.findMany({
      // id breaks createdAt ties, so a row can't appear on two pages
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize
    });
    const total = await submission.count();

    return { items, total };
  });
};

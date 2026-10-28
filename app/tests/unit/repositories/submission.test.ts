import { prismaTxMock } from '#tests/__mocks__/prismaMock';
import { SubmissionRepository } from '#src/repositories/submission';

// Construct the real repo
const makeRepo = () => new SubmissionRepository(prismaTxMock, 'principal-id');

describe('SubmissionRepository', () => {
  it('makes repo', () => {
    const repo = makeRepo();

    expect(repo).toBeInstanceOf(SubmissionRepository);
  });

  it('soft deletes rather than removing the row', async () => {
    const repo = makeRepo();

    await repo.delete({ id: 'submission-1' });

    expect(prismaTxMock.submission.delete).not.toHaveBeenCalled();
    expect(prismaTxMock.submission.update).toHaveBeenCalledWith({
      where: { id: 'submission-1' },
      data: expect.objectContaining({ deletedAt: expect.any(Date), deletedBy: 'principal-id' })
    });
  });
});

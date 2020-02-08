import {AttachmentRepository} from '../../../repositories';

import {
  givenEmptyDatabase,
  init,
  givenAttachment,
} from '../../helpers/database.helpers';
import {expect, toJSON} from '@loopback/testlab';

describe('AttachmentRepository (Integration)', () => {
  let attachmentRepo: AttachmentRepository;
  beforeEach(givenEmptyDatabase);

  beforeEach(async () => {
    const repos = await init();
    attachmentRepo = repos.attachmentRepo;
  });

  describe('create()', () => {
    it('creates a basic instance', async () => {
      const attachment = await givenAttachment(attachmentRepo);
      const response = await attachmentRepo.find();
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(attachment),
        },
      ]);
    });
  });

  describe('read()', () => {
    it('finds the collection', async () => {
      const attachment = await givenAttachment(attachmentRepo);
      const response = await attachmentRepo.find();
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(attachment),
        },
      ]);
    });

    it('finds by id', async () => {
      const attachment = await givenAttachment(attachmentRepo);
      const response = await attachmentRepo.findById(attachment.id);
      expect(toJSON(response)).to.deepEqual({
        ...toJSON(attachment),
      });
    });

    it('finds by filter', async () => {
      const attachmentA = await givenAttachment(attachmentRepo, {
        title: 'cats',
      });
      const attachmentB = await givenAttachment(attachmentRepo, {
        title: 'cats',
      });
      await givenAttachment(attachmentRepo, {title: 'dogs'});

      const response = await attachmentRepo.find({where: {title: 'cats'}});
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(attachmentA),
        },
        {...toJSON(attachmentB)},
      ]);
    });
  });

  describe('update()', () => {
    it('updates by id', async () => {
      const attachment = await givenAttachment(attachmentRepo);
      await attachmentRepo.updateById(attachment.id, {title: 'dog picture'});

      const response = await attachmentRepo.find();
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(attachment),
          title: 'dog picture',
        },
      ]);
    });

    it('updates multiple with query', async () => {
      const attachmentA = await givenAttachment(attachmentRepo, {
        title: 'cats',
      });
      const attachmentB = await givenAttachment(attachmentRepo, {
        title: 'cats',
      });
      const attachmentC = await givenAttachment(attachmentRepo, {
        title: 'dogs',
      });

      const count = await attachmentRepo.updateAll(
        {title: 'dogs'},
        {title: 'cats'},
      );

      expect(count.count).to.eql(2);
      const response = await attachmentRepo.find();
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(attachmentA),
          title: 'dogs',
        },
        {
          ...toJSON(attachmentB),
          title: 'dogs',
        },
        {
          ...toJSON(attachmentC),
        },
      ]);
    });
  });

  describe('delete()', () => {
    it('deletes by id', async () => {
      const attachmentA = await givenAttachment(attachmentRepo, {
        title: 'cats',
      });
      const attachmentB = await givenAttachment(attachmentRepo, {
        title: 'cats',
      });
      const attachmentC = await givenAttachment(attachmentRepo, {
        title: 'dogs',
      });

      await attachmentRepo.deleteById(attachmentC.id);
      const response = await attachmentRepo.find();
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(attachmentA),
        },
        {
          ...toJSON(attachmentB),
        },
      ]);
    });

    it('deletes with query', async () => {
      await givenAttachment(attachmentRepo, {
        title: 'cats',
      });
      await givenAttachment(attachmentRepo, {
        title: 'cats',
      });
      const attachmentC = await givenAttachment(attachmentRepo, {
        title: 'dogs',
      });

      const count = await attachmentRepo.deleteAll({title: 'cats'});
      expect(count.count).to.eql(2);

      const response = await attachmentRepo.find();
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(attachmentC),
        },
      ]);
    });
  });
});

import {
  givenEmptyDatabase,
  init,
  givenFriendship,
} from '../../helpers/database.helpers';
import {expect, toJSON} from '@loopback/testlab';
import {FriendshipRepository} from '../../../repositories';

describe('FriendshipRepository (Integration)', () => {
  let friendshipRepo: FriendshipRepository;
  beforeEach(givenEmptyDatabase);

  beforeEach(async () => {
    const repos = await init();
    friendshipRepo = repos.friendshipRepo;
  });

  describe('create()', () => {
    it('creates a basic instance', async () => {
      const friendship = await givenFriendship(friendshipRepo);
      const response = await friendshipRepo.find();
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(friendship),
        },
      ]);
    });
  });

  describe('read()', () => {
    it('finds the collection', async () => {
      const friendshipA = await givenFriendship(friendshipRepo, {
        userId: '1',
        friendId: '2',
      });
      const friendshipB = await givenFriendship(friendshipRepo, {
        userId: '2',
        friendId: '1',
      });

      const response = await friendshipRepo.find();
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(friendshipA),
        },
        {
          ...toJSON(friendshipB),
        },
      ]);
    });

    it('finds by id', async () => {
      const friendshipA = await givenFriendship(friendshipRepo);

      const response = await friendshipRepo.findById(friendshipA.friendshipId);
      expect(toJSON(response)).to.deepEqual({
        ...toJSON(friendshipA),
      });
    });

    it('finds by filter', async () => {
      const friendshipA = await givenFriendship(friendshipRepo, {
        userId: '1',
        friendId: '2',
      });
      await givenFriendship(friendshipRepo, {
        userId: '2',
        friendId: '1',
      });

      const response = await friendshipRepo.find({where: {userId: '1'}});
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(friendshipA),
        },
      ]);
    });
  });

  describe('update()', () => {
    it('updates by id', async () => {
      const friendshipA = await givenFriendship(friendshipRepo, {
        userId: '1',
        friendId: '2',
      });

      await friendshipRepo.updateById(friendshipA.friendshipId, {
        friendId: '3',
      });

      const response = await friendshipRepo.findById(friendshipA.friendshipId);
      expect(toJSON(response)).to.deepEqual({
        ...toJSON(friendshipA),
        friendId: '3',
      });
    });

    it('updates multiple with query', async () => {
      const friendshipA = await givenFriendship(friendshipRepo, {
        userId: '1',
        friendId: '2',
      });
      const friendshipB = await givenFriendship(friendshipRepo, {
        userId: '2',
        friendId: '1',
      });

      const count = await friendshipRepo.updateAll(
        {friendId: '4'},
        {userId: '2'},
      );
      expect(count.count).to.eql(1);

      const response = await friendshipRepo.find();
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(friendshipA),
        },
        {
          ...toJSON(friendshipB),
          friendId: '4',
        },
      ]);
    });
  });

  describe('delete()', () => {
    it('deletes by id', async () => {
      const friendshipA = await givenFriendship(friendshipRepo, {
        userId: '1',
        friendId: '2',
      });
      const friendshipB = await givenFriendship(friendshipRepo, {
        userId: '2',
        friendId: '1',
      });

      await friendshipRepo.deleteById(friendshipA.friendshipId);

      const response = await friendshipRepo.find();
      expect(toJSON(response)).to.deepEqual([
        {
          ...toJSON(friendshipB),
        },
      ]);
    });

    it('deletes with query', async () => {
      await givenFriendship(friendshipRepo, {
        userId: '1',
        friendId: '2',
      });
      await givenFriendship(friendshipRepo, {
        userId: '2',
        friendId: '1',
      });

      const count = await friendshipRepo.deleteAll({userId: {inq: ['1', '2']}});

      const response = await friendshipRepo.find();
      expect(count.count).to.eql(2);
      expect(response).length(0);
    });
  });
});

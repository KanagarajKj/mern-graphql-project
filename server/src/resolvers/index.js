module.exports = {
  Query: {
    users: async (_, __, { User }) => await User.find(),
    user: async (_, { id }, { User }) => await User.findById(id),
  },
  Mutation: {
    createUser: async (_, { name, email }, { User }) => {
      const user = new User({ name, email });
      await user.save();
      return user;
    },
    updateUser: async (_, { id, name, email }, { User }) => {
      return await User.findByIdAndUpdate(id, { name, email }, { new: true });
    },
    deleteUser: async (_, { id }, { User }) => {
      await User.findByIdAndDelete(id);
      return true;
    },
  },
};
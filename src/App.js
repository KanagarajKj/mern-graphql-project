import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, useMutation } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

function UserList() {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.users.map(({ id, name, email }) => (
    <div key={id}>
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  ));
}

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`;

function UserDetails({ userId }) {
  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>{data.user.name}</h2>
      <p>Email: {data.user.email}</p>
    </div>
  );
}

// Mutation to update a user
const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String, $email: String) {
    updateUser(id: $id, name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

// Mutation to delete a user
const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

function UserManagement({ userId }) {
  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
  });

  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const result = await updateUser({
        variables: {
          id: userId,
          name: e.target.name.value,
          email: e.target.email.value,
        },
      });
      console.log('User updated:', result.data.updateUser);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await deleteUser({
          variables: { id: userId },
        });
        if (result.data.deleteUser) {
          console.log('User deleted successfully');
          // Optionally, redirect or update UI here
        }
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      <form onSubmit={handleUpdate}>
        <input name="name" defaultValue={data.user.name} />
        <input name="email" defaultValue={data.user.email} />
        <button type="submit">Update User</button>
      </form>
      <button onClick={handleDelete}>Delete User</button>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h2>My MERN GraphQL App</h2>
        <UserList />
      </div>
    </ApolloProvider>
  );
}

export default App;
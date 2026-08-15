const module = 'https://dummyjson.com/users';

const usermanagementApi = {
  user: {
    // List all elites
    list: `${module}`,
   delete: (id: number) => `${module}/${id}`,

  }
};

export default usermanagementApi;

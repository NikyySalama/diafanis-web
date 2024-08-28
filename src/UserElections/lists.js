const listsData = [
    {
      id: 1,
      name: 'La Libertad Avanza',
      acronym: 'LLA'
    },
    {
      id: 2,
      name: 'Union por La Patria',
      acronym: 'LLA'
    }
  ];
  
export const addList = (newList) => {
    listsData.push(newList);
};
  
export const getLists = () => {
    return listsData;
};
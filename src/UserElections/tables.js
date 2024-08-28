const tablesData = [
    {
      id: 1,
      location: 'Matanza',
    },
    {
      id: 2,
      location: 'Almagro',
    }
  ];
  
export const addTable = (newTable) => {
    tablesData.push(newTable);
};
  
export const getTables = () => {
    return tablesData;
};
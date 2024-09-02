const electionsData = [
    {
      id: 1,
      name: 'Elección Presidencial',
      description: 'Elección para presidente de la nación.',
      startsAt: '2024-09-01T08:00:00Z',
      endsAt: '2024-09-30T18:00:00Z',
      "electionPositions": [
        {
          "title": "Presidencia"
        },
        {
          "title": "Senado"
        }
      ],
    "image": "base64 encode"
    }
  ];
  
export const addElection = (newElection) => {
    electionsData.push(newElection);
};
  
export const getElections = () => {
    return electionsData;
};
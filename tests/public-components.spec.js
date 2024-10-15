const { test, expect } = require('@playwright/test');
//TODO: crear un usuario previamente para poder obtener el sessionStorage
test('Visualizar las elecciones', async ({ page, request }) => {
    // Enviar una solicitud POST para crear la elección directamente
    
    await page.route('**/api/elections', async (route) => {
        const mockData = [
          { uuid: '1', title: 'Election 1', imageUrl: '' },
          { uuid: '2', title: 'Election 2', imageUrl: '' },
        ];
        // Respond with the mock data
        await route.fulfill({
          contentType: 'application/json',
          body: JSON.stringify(mockData),
        });
      });
    
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.grid-container');

  // Verify that the mocked data is displayed
  const cards = await page.locator('.grid > div'); // Adjust the selector to match the structure of Card components
  expect(await cards.count()).toBe(2); // Expect 2 cards to be rendered

  // Verify the content of the cards
  expect(await cards.nth(0).locator('h4').textContent()).toBe('Election 1'); // Check title for the first card
  expect(await cards.nth(1).locator('h4').textContent()).toBe('Election 2'); // Check title for the second card
});

test('Visualizar las mesas de la eleccion seleccionada', async ({ page, request }) => {
  // Enviar una solicitud POST para crear la elección directamente
  
  await page.goto('http://localhost:3000');
 
  // Navigate to an empty page first (to avoid race conditions)
  await page.evaluate(() => {
    // Mocking sessionStorage data
    sessionStorage.setItem('electionId', 'abc'); // Mock election ID
    sessionStorage.setItem('election', JSON.stringify( 
      {
      uuid: "abc",
      title: "Eleccion",
      description: ".",
      imageUrl: "",
      startsAt: "2023-10-10T08:53:00",
      endsAt: "2023-10-24T08:53:00",
      electionPositions: [
        {
          uuid: "presi",
          title: "Presidencia",
          description: "",
          formulas: [
            {
              uuid: "143",
              title: "title",
              idNumber: "143",
              candidates: [
                {
                  uuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                  data: {
                    docNumber:98490,
                    name: "Sergio",
                    lastName: "Massa",
                    docType: "DNI",
                    imageUrl: "https://pbs.twimg.com/profile_images/1709748513565810689/rO356hOB_400x400.jpg",
                    electorTableUuid: null,
                    authorityTableUuid: null,
                    electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                    candidateUuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                    hasVoted: null,
                    votedAt: null
                  },
                  role: "Presidente",
                  imageUrl: null,
                  formulaUuid: "43a70d5f-191a-458d-8120-094ac9e439f3",
                  zindex: 0
                }
              ],
              party: {
                uuid: "party",
                name: "La libertad avanza",
                colorHex: "#822ed6",
                logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg"
              },
              election: {
                uuid: "abc",
                title: "Eleccion",
                description: ".",
                 imageUrl: "",
                 startsAt: "2023-10-10T08:53:00",
                endsAt: "2023-10-24T08:53:00",
              }
            }
          ],
        }
      ],
      votingTables: [
        {
          uuid: "1",
          publicKey: "MIIBCgKCAQEAve8D9Fhu6+O+Ptu8xLRbEYt3h+OohTW0RqidVX4BkY3dXdfaIQyBidkYTGRzjVa+LHuJNwQ9liDj3luJ2CJyWI+Ou1sOlf9dDEZUGvXQ8JoO4IS/yLpPiH7dWaJ8kBLfmcfL5ZNJ/uMwaCr8zOh8s8Jf48gRbdob/DFMHdJ6LFLnhPANeuWvHr8C4kaz73U+nAd8OT1O/FoUBAoDG7EPnR4OLE5EzqocUXvspxw4Cyk48QQd3aZ9euMHMoY94VkejAzVzk7+RabY4LlIpV/Y9USSngWvMv1yj8W4silMSnHAGZGSOD4Uwz9ltj5oxAQoZyfreKz46IusPtB+chci7wIDAQAB-----END RSA PUBLIC KEY-----\n",
          hashedResults: null,
          electors: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 30728575,
              name: "Manuel",
              lastName: "Azcazabal",
              docType: "DNI",
              imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:52.886847"
            },
            {
              docNumber: 33117456,
              name: "Soledad",
              lastName: "Arancibia",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 254891407,
              name: "Jorge",
              lastName: "Bruneo",
              docType: "DNI",
              imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          authorities: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          location: {
            country: "Argentina",
            state: "Buenos Aires",
            city: "Capital",
            address: "Av Cordoba 2002"
          },
          electionUuid: "abc",
          results: {},
          enabledToVote: false
        },
        {
          uuid: "2",
          publicKey: "MIIBCgKCAQEAve8D9Fhu6+O+Ptu8xLRbEYt3h+OohTW0RqidVX4BkY3dXdfaIQyBidkYTGRzjVa+LHuJNwQ9liDj3luJ2CJyWI+Ou1sOlf9dDEZUGvXQ8JoO4IS/yLpPiH7dWaJ8kBLfmcfL5ZNJ/uMwaCr8zOh8s8Jf48gRbdob/DFMHdJ6LFLnhPANeuWvHr8C4kaz73U+nAd8OT1O/FoUBAoDG7EPnR4OLE5EzqocUXvspxw4Cyk48QQd3aZ9euMHMoY94VkejAzVzk7+RabY4LlIpV/Y9USSngWvMv1yj8W4silMSnHAGZGSOD4Uwz9ltj5oxAQoZyfreKz46IusPtB+chci7wIDAQAB-----END RSA PUBLIC KEY-----\n",
          hashedResults: null,
          electors: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 30728575,
              name: "Manuel",
              lastName: "Azcazabal",
              docType: "DNI",
              imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:52.886847"
            },
            {
              docNumber: 33117456,
              name: "Soledad",
              lastName: "Arancibia",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 254891407,
              name: "Jorge",
              lastName: "Bruneo",
              docType: "DNI",
              imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          authorities: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          location: {
            country: "Argentina",
            state: "Buenos Aires",
            city: "Capital",
            address: "Av Cordoba 2402"
          },
          electionUuid: "abc",
          results: {},
          enabledToVote: false
        }
      ],
      parties: [
        {
          uuid: "9fe10876-db5c-4c52-9c57-e24806c72450",
          name: "La libertad avanza",
          colorHex: "#822ed6",
          logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg",
          electionUuid: "abc",
        }
      ],
      formulas: [
        {
          uuid: "143",
          title: "title",
          idNumber: "143",
          candidates: [
            {
              uuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
              data: {
                docNumber:98490,
                name: "Sergio",
                lastName: "Massa",
                docType: "DNI",
                imageUrl: "https://pbs.twimg.com/profile_images/1709748513565810689/rO356hOB_400x400.jpg",
                electorTableUuid: null,
                authorityTableUuid: null,
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                hasVoted: null,
                votedAt: null
              },
              role: "Presidente",
              imageUrl: null,
              formulaUuid: "43a70d5f-191a-458d-8120-094ac9e439f3",
              zindex: 0
            }
          ],
          party: {
            uuid: "party",
            name: "La libertad avanza",
            colorHex: "#822ed6",
            logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg"
          },
          election: {
            uuid: "abc",
            title: "Eleccion",
            description: ".",
             imageUrl: "",
             startsAt: "2023-10-10T08:53:00",
            endsAt: "2023-10-24T08:53:00",
          }
        }
      ],
      people: [],
      computedResults: {},
      username: "valentin"
    }));
  });

  await page.route('**/api/elections/abc', async (route) => {
    const mockData = {
      uuid: "abc",
      title: "Eleccion",
      description: ".",
      imageUrl: "",
      startsAt: "2023-10-10T08:53:00",
      endsAt: "2023-10-24T08:53:00",
      electionPositions: [
        {
          uuid: "presi",
          title: "Presidencia",
          description: "",
          formulas: [
            {
              uuid: "143",
              title: "title",
              idNumber: "143",
              candidates: [
                {
                  uuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                  data: {
                    docNumber:98490,
                    name: "Sergio",
                    lastName: "Massa",
                    docType: "DNI",
                    imageUrl: "https://pbs.twimg.com/profile_images/1709748513565810689/rO356hOB_400x400.jpg",
                    electorTableUuid: null,
                    authorityTableUuid: null,
                    electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                    candidateUuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                    hasVoted: null,
                    votedAt: null
                  },
                  role: "Presidente",
                  imageUrl: null,
                  formulaUuid: "43a70d5f-191a-458d-8120-094ac9e439f3",
                  zindex: 0
                }
              ],
              party: {
                uuid: "party",
                name: "La libertad avanza",
                colorHex: "#822ed6",
                logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg"
              },
              election: {
                uuid: "abc",
                title: "Eleccion",
                description: ".",
                 imageUrl: "",
                 startsAt: "2023-10-10T08:53:00",
                endsAt: "2023-10-24T08:53:00",
              }
            }
          ],
        }
      ],
      votingTables: [
        {
          uuid: "1",
          publicKey: "MIIBCgKCAQEAve8D9Fhu6+O+Ptu8xLRbEYt3h+OohTW0RqidVX4BkY3dXdfaIQyBidkYTGRzjVa+LHuJNwQ9liDj3luJ2CJyWI+Ou1sOlf9dDEZUGvXQ8JoO4IS/yLpPiH7dWaJ8kBLfmcfL5ZNJ/uMwaCr8zOh8s8Jf48gRbdob/DFMHdJ6LFLnhPANeuWvHr8C4kaz73U+nAd8OT1O/FoUBAoDG7EPnR4OLE5EzqocUXvspxw4Cyk48QQd3aZ9euMHMoY94VkejAzVzk7+RabY4LlIpV/Y9USSngWvMv1yj8W4silMSnHAGZGSOD4Uwz9ltj5oxAQoZyfreKz46IusPtB+chci7wIDAQAB-----END RSA PUBLIC KEY-----\n",
          hashedResults: null,
          electors: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 30728575,
              name: "Manuel",
              lastName: "Azcazabal",
              docType: "DNI",
              imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:52.886847"
            },
            {
              docNumber: 33117456,
              name: "Soledad",
              lastName: "Arancibia",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 254891407,
              name: "Jorge",
              lastName: "Bruneo",
              docType: "DNI",
              imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          authorities: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          location: {
            country: "Argentina",
            state: "Buenos Aires",
            city: "Capital",
            address: "Av Cordoba 2002"
          },
          electionUuid: "abc",
          results: {},
          enabledToVote: false
        },
        {
          uuid: "2",
          publicKey: "MIIBCgKCAQEAve8D9Fhu6+O+Ptu8xLRbEYt3h+OohTW0RqidVX4BkY3dXdfaIQyBidkYTGRzjVa+LHuJNwQ9liDj3luJ2CJyWI+Ou1sOlf9dDEZUGvXQ8JoO4IS/yLpPiH7dWaJ8kBLfmcfL5ZNJ/uMwaCr8zOh8s8Jf48gRbdob/DFMHdJ6LFLnhPANeuWvHr8C4kaz73U+nAd8OT1O/FoUBAoDG7EPnR4OLE5EzqocUXvspxw4Cyk48QQd3aZ9euMHMoY94VkejAzVzk7+RabY4LlIpV/Y9USSngWvMv1yj8W4silMSnHAGZGSOD4Uwz9ltj5oxAQoZyfreKz46IusPtB+chci7wIDAQAB-----END RSA PUBLIC KEY-----\n",
          hashedResults: null,
          electors: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 30728575,
              name: "Manuel",
              lastName: "Azcazabal",
              docType: "DNI",
              imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:52.886847"
            },
            {
              docNumber: 33117456,
              name: "Soledad",
              lastName: "Arancibia",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 254891407,
              name: "Jorge",
              lastName: "Bruneo",
              docType: "DNI",
              imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          authorities: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          location: {
            country: "Argentina",
            state: "Buenos Aires",
            city: "Capital",
            address: "Av Cordoba 2402"
          },
          electionUuid: "abc",
          results: {},
          enabledToVote: false
        }
      ],
      parties: [
        {
          uuid: "9fe10876-db5c-4c52-9c57-e24806c72450",
          name: "La libertad avanza",
          colorHex: "#822ed6",
          logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg",
          electionUuid: "abc",
        }
      ],
      formulas: [
        {
          uuid: "143",
          title: "title",
          idNumber: "143",
          candidates: [
            {
              uuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
              data: {
                docNumber:98490,
                name: "Sergio",
                lastName: "Massa",
                docType: "DNI",
                imageUrl: "https://pbs.twimg.com/profile_images/1709748513565810689/rO356hOB_400x400.jpg",
                electorTableUuid: null,
                authorityTableUuid: null,
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                hasVoted: null,
                votedAt: null
              },
              role: "Presidente",
              imageUrl: null,
              formulaUuid: "43a70d5f-191a-458d-8120-094ac9e439f3",
              zindex: 0
            }
          ],
          party: {
            uuid: "party",
            name: "La libertad avanza",
            colorHex: "#822ed6",
            logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg"
          },
          election: {
            uuid: "abc",
            title: "Eleccion",
            description: ".",
             imageUrl: "",
             startsAt: "2023-10-10T08:53:00",
            endsAt: "2023-10-24T08:53:00",
          }
        }
      ],
      people: [],
      computedResults: {},
      username: "valentin"
    };
    await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(mockData),
    });
});

  await page.goto('http://localhost:3000/election');

  // Perform your test assertions
  const storedData = await page.evaluate(() => sessionStorage.getItem('election'));
  expect(storedData).toBe(JSON.stringify({
    uuid: "abc",
    title: "Eleccion",
    description: ".",
    imageUrl: "",
    startsAt: "2023-10-10T08:53:00",
    endsAt: "2023-10-24T08:53:00",
    electionPositions: [
      {
        uuid: "presi",
        title: "Presidencia",
        description: "",
        formulas: [
          {
            uuid: "143",
            title: "title",
            idNumber: "143",
            candidates: [
              {
                uuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                data: {
                  docNumber:98490,
                  name: "Sergio",
                  lastName: "Massa",
                  docType: "DNI",
                  imageUrl: "https://pbs.twimg.com/profile_images/1709748513565810689/rO356hOB_400x400.jpg",
                  electorTableUuid: null,
                  authorityTableUuid: null,
                  electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                  candidateUuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                  hasVoted: null,
                  votedAt: null
                },
                role: "Presidente",
                imageUrl: null,
                formulaUuid: "43a70d5f-191a-458d-8120-094ac9e439f3",
                zindex: 0
              }
            ],
            party: {
              uuid: "party",
              name: "La libertad avanza",
              colorHex: "#822ed6",
              logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg"
            },
            election: {
              uuid: "abc",
              title: "Eleccion",
              description: ".",
               imageUrl: "",
               startsAt: "2023-10-10T08:53:00",
              endsAt: "2023-10-24T08:53:00",
            }
          }
        ],
      }
    ],
    votingTables: [
      {
        uuid: "1",
        publicKey: "MIIBCgKCAQEAve8D9Fhu6+O+Ptu8xLRbEYt3h+OohTW0RqidVX4BkY3dXdfaIQyBidkYTGRzjVa+LHuJNwQ9liDj3luJ2CJyWI+Ou1sOlf9dDEZUGvXQ8JoO4IS/yLpPiH7dWaJ8kBLfmcfL5ZNJ/uMwaCr8zOh8s8Jf48gRbdob/DFMHdJ6LFLnhPANeuWvHr8C4kaz73U+nAd8OT1O/FoUBAoDG7EPnR4OLE5EzqocUXvspxw4Cyk48QQd3aZ9euMHMoY94VkejAzVzk7+RabY4LlIpV/Y9USSngWvMv1yj8W4silMSnHAGZGSOD4Uwz9ltj5oxAQoZyfreKz46IusPtB+chci7wIDAQAB-----END RSA PUBLIC KEY-----\n",
        hashedResults: null,
        electors: [
          {
            docNumber: 12364486,
            name: "Federico",
            lastName: "Botti",
            docType: "DNI",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: true,
            votedAt: "2024-10-08T11:57:02.143456"
          },
          {
            docNumber: 30728575,
            name: "Manuel",
            lastName: "Azcazabal",
            docType: "DNI",
            imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: null,
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: true,
            votedAt: "2024-10-08T11:57:52.886847"
          },
          {
            docNumber: 33117456,
            name: "Soledad",
            lastName: "Arancibia",
            docType: "DNI",
            imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: null,
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: null,
            votedAt: null
          },
          {
            docNumber: 123456780,
            name: "Yolanda",
            lastName: "Antara",
            docType: "DNI",
            imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: null,
            votedAt: null
          },
          {
            docNumber: 254891407,
            name: "Jorge",
            lastName: "Bruneo",
            docType: "DNI",
            imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: null,
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: null,
            votedAt: null
          }
        ],
        authorities: [
          {
            docNumber: 12364486,
            name: "Federico",
            lastName: "Botti",
            docType: "DNI",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: true,
            votedAt: "2024-10-08T11:57:02.143456"
          },
          {
            docNumber: 123456780,
            name: "Yolanda",
            lastName: "Antara",
            docType: "DNI",
            imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: null,
            votedAt: null
          }
        ],
        location: {
          country: "Argentina",
          state: "Buenos Aires",
          city: "Capital",
          address: "Av Cordoba 2002"
        },
        electionUuid: "abc",
        results: {},
        enabledToVote: false
      },
      {
        uuid: "2",
        publicKey: "MIIBCgKCAQEAve8D9Fhu6+O+Ptu8xLRbEYt3h+OohTW0RqidVX4BkY3dXdfaIQyBidkYTGRzjVa+LHuJNwQ9liDj3luJ2CJyWI+Ou1sOlf9dDEZUGvXQ8JoO4IS/yLpPiH7dWaJ8kBLfmcfL5ZNJ/uMwaCr8zOh8s8Jf48gRbdob/DFMHdJ6LFLnhPANeuWvHr8C4kaz73U+nAd8OT1O/FoUBAoDG7EPnR4OLE5EzqocUXvspxw4Cyk48QQd3aZ9euMHMoY94VkejAzVzk7+RabY4LlIpV/Y9USSngWvMv1yj8W4silMSnHAGZGSOD4Uwz9ltj5oxAQoZyfreKz46IusPtB+chci7wIDAQAB-----END RSA PUBLIC KEY-----\n",
        hashedResults: null,
        electors: [
          {
            docNumber: 12364486,
            name: "Federico",
            lastName: "Botti",
            docType: "DNI",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: true,
            votedAt: "2024-10-08T11:57:02.143456"
          },
          {
            docNumber: 30728575,
            name: "Manuel",
            lastName: "Azcazabal",
            docType: "DNI",
            imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: null,
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: true,
            votedAt: "2024-10-08T11:57:52.886847"
          },
          {
            docNumber: 33117456,
            name: "Soledad",
            lastName: "Arancibia",
            docType: "DNI",
            imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: null,
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: null,
            votedAt: null
          },
          {
            docNumber: 123456780,
            name: "Yolanda",
            lastName: "Antara",
            docType: "DNI",
            imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: null,
            votedAt: null
          },
          {
            docNumber: 254891407,
            name: "Jorge",
            lastName: "Bruneo",
            docType: "DNI",
            imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: null,
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: null,
            votedAt: null
          }
        ],
        authorities: [
          {
            docNumber: 12364486,
            name: "Federico",
            lastName: "Botti",
            docType: "DNI",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: true,
            votedAt: "2024-10-08T11:57:02.143456"
          },
          {
            docNumber: 123456780,
            name: "Yolanda",
            lastName: "Antara",
            docType: "DNI",
            imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: null,
            votedAt: null
          }
        ],
        location: {
          country: "Argentina",
          state: "Buenos Aires",
          city: "Capital",
          address: "Av Cordoba 2402"
        },
        electionUuid: "abc",
        results: {},
        enabledToVote: false
      }
    ],
    parties: [
      {
        uuid: "9fe10876-db5c-4c52-9c57-e24806c72450",
        name: "La libertad avanza",
        colorHex: "#822ed6",
        logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg",
        electionUuid: "abc",
      }
    ],
    formulas: [
      {
        uuid: "143",
        title: "title",
        idNumber: "143",
        candidates: [
          {
            uuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
            data: {
              docNumber:98490,
              name: "Sergio",
              lastName: "Massa",
              docType: "DNI",
              imageUrl: "https://pbs.twimg.com/profile_images/1709748513565810689/rO356hOB_400x400.jpg",
              electorTableUuid: null,
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
              hasVoted: null,
              votedAt: null
            },
            role: "Presidente",
            imageUrl: null,
            formulaUuid: "43a70d5f-191a-458d-8120-094ac9e439f3",
            zindex: 0
          }
        ],
        party: {
          uuid: "party",
          name: "La libertad avanza",
          colorHex: "#822ed6",
          logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg"
        },
        election: {
          uuid: "abc",
          title: "Eleccion",
          description: ".",
           imageUrl: "",
           startsAt: "2023-10-10T08:53:00",
          endsAt: "2023-10-24T08:53:00",
        }
      }
    ],
    people: [],
    computedResults: {},
    username: "valentin"
  }));

  await page.waitForSelector('.list-tables > div'); // Wait for the tables to be rendered
  const tables = await page.locator('.list-tables > div'); 
  expect(await tables.count()).toBe(2); // Expecting 2 voting tables to be displayed
  expect(await tables.nth(0).locator('h4').textContent()).toBe('Mesa'); // Check title for the first card
  expect(await tables.nth(1).locator('h4').textContent()).toBe('Mesa'); // Check title for the second card
 // expect(await tables.nth(0).locator('body2').textContent()).toBe('1'); // Check title for the first card
 // expect(await tables.nth(1).locator('body2').textContent()).toBe('2'); // Check title for the second card

 
  });

test('Visualizar el titulo de la eleccion seleccionada', async ({ page, request }) => {
  // Enviar una solicitud POST para crear la elección directamente
  
  await page.goto('http://localhost:3000');
 
  // Navigate to an empty page first (to avoid race conditions)
  await page.evaluate(() => {
    // Mocking sessionStorage data
    sessionStorage.setItem('electionId', 'abc'); // Mock election ID
    sessionStorage.setItem('election', JSON.stringify( {
      uuid: "abc",
      title: "Eleccion",
      description: ".",
      imageUrl: "",
      startsAt: "2023-10-10T08:53:00",
      endsAt: "2023-10-24T08:53:00",
      electionPositions: [
        {
          uuid: "presi",
          title: "Presidencia",
          description: "",
          formulas: [
            {
              uuid: "143",
              title: "title",
              idNumber: "143",
              candidates: [
                {
                  uuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                  data: {
                    docNumber:98490,
                    name: "Sergio",
                    lastName: "Massa",
                    docType: "DNI",
                    imageUrl: "https://pbs.twimg.com/profile_images/1709748513565810689/rO356hOB_400x400.jpg",
                    electorTableUuid: null,
                    authorityTableUuid: null,
                    electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                    candidateUuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                    hasVoted: null,
                    votedAt: null
                  },
                  role: "Presidente",
                  imageUrl: null,
                  formulaUuid: "43a70d5f-191a-458d-8120-094ac9e439f3",
                  zindex: 0
                }
              ],
              party: {
                uuid: "party",
                name: "La libertad avanza",
                colorHex: "#822ed6",
                logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg"
              },
              election: {
                uuid: "abc",
                title: "Eleccion",
                description: ".",
                 imageUrl: "",
                 startsAt: "2023-10-10T08:53:00",
                endsAt: "2023-10-24T08:53:00",
              }
            }
          ],
        }
      ],
      votingTables: [
        {
          uuid: "1",
          publicKey: "MIIBCgKCAQEAve8D9Fhu6+O+Ptu8xLRbEYt3h+OohTW0RqidVX4BkY3dXdfaIQyBidkYTGRzjVa+LHuJNwQ9liDj3luJ2CJyWI+Ou1sOlf9dDEZUGvXQ8JoO4IS/yLpPiH7dWaJ8kBLfmcfL5ZNJ/uMwaCr8zOh8s8Jf48gRbdob/DFMHdJ6LFLnhPANeuWvHr8C4kaz73U+nAd8OT1O/FoUBAoDG7EPnR4OLE5EzqocUXvspxw4Cyk48QQd3aZ9euMHMoY94VkejAzVzk7+RabY4LlIpV/Y9USSngWvMv1yj8W4silMSnHAGZGSOD4Uwz9ltj5oxAQoZyfreKz46IusPtB+chci7wIDAQAB-----END RSA PUBLIC KEY-----\n",
          hashedResults: null,
          electors: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 30728575,
              name: "Manuel",
              lastName: "Azcazabal",
              docType: "DNI",
              imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:52.886847"
            },
            {
              docNumber: 33117456,
              name: "Soledad",
              lastName: "Arancibia",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 254891407,
              name: "Jorge",
              lastName: "Bruneo",
              docType: "DNI",
              imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          authorities: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          location: {
            country: "Argentina",
            state: "Buenos Aires",
            city: "Capital",
            address: "Av Cordoba 2002"
          },
          electionUuid: "abc",
          results: {},
          enabledToVote: false
        },
        {
          uuid: "2",
          publicKey: "MIIBCgKCAQEAve8D9Fhu6+O+Ptu8xLRbEYt3h+OohTW0RqidVX4BkY3dXdfaIQyBidkYTGRzjVa+LHuJNwQ9liDj3luJ2CJyWI+Ou1sOlf9dDEZUGvXQ8JoO4IS/yLpPiH7dWaJ8kBLfmcfL5ZNJ/uMwaCr8zOh8s8Jf48gRbdob/DFMHdJ6LFLnhPANeuWvHr8C4kaz73U+nAd8OT1O/FoUBAoDG7EPnR4OLE5EzqocUXvspxw4Cyk48QQd3aZ9euMHMoY94VkejAzVzk7+RabY4LlIpV/Y9USSngWvMv1yj8W4silMSnHAGZGSOD4Uwz9ltj5oxAQoZyfreKz46IusPtB+chci7wIDAQAB-----END RSA PUBLIC KEY-----\n",
          hashedResults: null,
          electors: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 30728575,
              name: "Manuel",
              lastName: "Azcazabal",
              docType: "DNI",
              imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:52.886847"
            },
            {
              docNumber: 33117456,
              name: "Soledad",
              lastName: "Arancibia",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 254891407,
              name: "Jorge",
              lastName: "Bruneo",
              docType: "DNI",
              imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          authorities: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          location: {
            country: "Argentina",
            state: "Buenos Aires",
            city: "Capital",
            address: "Av Cordoba 2402"
          },
          electionUuid: "abc",
          results: {},
          enabledToVote: false
        }
      ],
      parties: [
        {
          uuid: "9fe10876-db5c-4c52-9c57-e24806c72450",
          name: "La libertad avanza",
          colorHex: "#822ed6",
          logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg",
          electionUuid: "abc",
        }
      ],
      formulas: [
        {
          uuid: "143",
          title: "title",
          idNumber: "143",
          candidates: [
            {
              uuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
              data: {
                docNumber:98490,
                name: "Sergio",
                lastName: "Massa",
                docType: "DNI",
                imageUrl: "https://pbs.twimg.com/profile_images/1709748513565810689/rO356hOB_400x400.jpg",
                electorTableUuid: null,
                authorityTableUuid: null,
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                hasVoted: null,
                votedAt: null
              },
              role: "Presidente",
              imageUrl: null,
              formulaUuid: "43a70d5f-191a-458d-8120-094ac9e439f3",
              zindex: 0
            }
          ],
          party: {
            uuid: "party",
            name: "La libertad avanza",
            colorHex: "#822ed6",
            logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg"
          },
          election: {
            uuid: "abc",
            title: "Eleccion",
            description: ".",
             imageUrl: "",
             startsAt: "2023-10-10T08:53:00",
            endsAt: "2023-10-24T08:53:00",
          }
        }
      ],
      people: [],
      computedResults: {},
      username: "valentin"
    }));
  });

  await page.route('**/api/elections/abc', async (route) => {
    const mockData = {
      uuid: "abc",
      title: "Eleccion",
      description: ".",
      imageUrl: "",
      startsAt: "2023-10-10T08:53:00",
      endsAt: "2023-10-24T08:53:00",
      electionPositions: [
        {
          uuid: "presi",
          title: "Presidencia",
          description: "",
          formulas: [
            {
              uuid: "143",
              title: "title",
              idNumber: "143",
              candidates: [
                {
                  uuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                  data: {
                    docNumber:98490,
                    name: "Sergio",
                    lastName: "Massa",
                    docType: "DNI",
                    imageUrl: "https://pbs.twimg.com/profile_images/1709748513565810689/rO356hOB_400x400.jpg",
                    electorTableUuid: null,
                    authorityTableUuid: null,
                    electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                    candidateUuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                    hasVoted: null,
                    votedAt: null
                  },
                  role: "Presidente",
                  imageUrl: null,
                  formulaUuid: "43a70d5f-191a-458d-8120-094ac9e439f3",
                  zindex: 0
                }
              ],
              party: {
                uuid: "party",
                name: "La libertad avanza",
                colorHex: "#822ed6",
                logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg"
              },
              election: {
                uuid: "abc",
                title: "Eleccion",
                description: ".",
                 imageUrl: "",
                 startsAt: "2023-10-10T08:53:00",
                endsAt: "2023-10-24T08:53:00",
              }
            }
          ],
        }
      ],
      votingTables: [
        {
          uuid: "1",
          publicKey: "MIIBCgKCAQEAve8D9Fhu6+O+Ptu8xLRbEYt3h+OohTW0RqidVX4BkY3dXdfaIQyBidkYTGRzjVa+LHuJNwQ9liDj3luJ2CJyWI+Ou1sOlf9dDEZUGvXQ8JoO4IS/yLpPiH7dWaJ8kBLfmcfL5ZNJ/uMwaCr8zOh8s8Jf48gRbdob/DFMHdJ6LFLnhPANeuWvHr8C4kaz73U+nAd8OT1O/FoUBAoDG7EPnR4OLE5EzqocUXvspxw4Cyk48QQd3aZ9euMHMoY94VkejAzVzk7+RabY4LlIpV/Y9USSngWvMv1yj8W4silMSnHAGZGSOD4Uwz9ltj5oxAQoZyfreKz46IusPtB+chci7wIDAQAB-----END RSA PUBLIC KEY-----\n",
          hashedResults: null,
          electors: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 30728575,
              name: "Manuel",
              lastName: "Azcazabal",
              docType: "DNI",
              imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:52.886847"
            },
            {
              docNumber: 33117456,
              name: "Soledad",
              lastName: "Arancibia",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 254891407,
              name: "Jorge",
              lastName: "Bruneo",
              docType: "DNI",
              imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          authorities: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          location: {
            country: "Argentina",
            state: "Buenos Aires",
            city: "Capital",
            address: "Av Cordoba 2002"
          },
          electionUuid: "abc",
          results: {},
          enabledToVote: false
        },
        {
          uuid: "2",
          publicKey: "MIIBCgKCAQEAve8D9Fhu6+O+Ptu8xLRbEYt3h+OohTW0RqidVX4BkY3dXdfaIQyBidkYTGRzjVa+LHuJNwQ9liDj3luJ2CJyWI+Ou1sOlf9dDEZUGvXQ8JoO4IS/yLpPiH7dWaJ8kBLfmcfL5ZNJ/uMwaCr8zOh8s8Jf48gRbdob/DFMHdJ6LFLnhPANeuWvHr8C4kaz73U+nAd8OT1O/FoUBAoDG7EPnR4OLE5EzqocUXvspxw4Cyk48QQd3aZ9euMHMoY94VkejAzVzk7+RabY4LlIpV/Y9USSngWvMv1yj8W4silMSnHAGZGSOD4Uwz9ltj5oxAQoZyfreKz46IusPtB+chci7wIDAQAB-----END RSA PUBLIC KEY-----\n",
          hashedResults: null,
          electors: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 30728575,
              name: "Manuel",
              lastName: "Azcazabal",
              docType: "DNI",
              imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:52.886847"
            },
            {
              docNumber: 33117456,
              name: "Soledad",
              lastName: "Arancibia",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 254891407,
              name: "Jorge",
              lastName: "Bruneo",
              docType: "DNI",
              imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          authorities: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          location: {
            country: "Argentina",
            state: "Buenos Aires",
            city: "Capital",
            address: "Av Cordoba 2402"
          },
          electionUuid: "abc",
          results: {},
          enabledToVote: false
        }
      ],
      parties: [
        {
          uuid: "9fe10876-db5c-4c52-9c57-e24806c72450",
          name: "La libertad avanza",
          colorHex: "#822ed6",
          logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg",
          electionUuid: "abc",
        }
      ],
      formulas: [
        {
          uuid: "143",
          title: "title",
          idNumber: "143",
          candidates: [
            {
              uuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
              data: {
                docNumber:98490,
                name: "Sergio",
                lastName: "Massa",
                docType: "DNI",
                imageUrl: "https://pbs.twimg.com/profile_images/1709748513565810689/rO356hOB_400x400.jpg",
                electorTableUuid: null,
                authorityTableUuid: null,
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                hasVoted: null,
                votedAt: null
              },
              role: "Presidente",
              imageUrl: null,
              formulaUuid: "43a70d5f-191a-458d-8120-094ac9e439f3",
              zindex: 0
            }
          ],
          party: {
            uuid: "party",
            name: "La libertad avanza",
            colorHex: "#822ed6",
            logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg"
          },
          election: {
            uuid: "abc",
            title: "Eleccion",
            description: ".",
             imageUrl: "",
             startsAt: "2023-10-10T08:53:00",
            endsAt: "2023-10-24T08:53:00",
          }
        }
      ],
      people: [],
      computedResults: {},
      username: "valentin"
    };
    await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(mockData),
    });
});
  // Now navigate to the page you want to test
  await page.goto('http://localhost:3000/election');

  // Perform your test assertions
  const storedData = await page.evaluate(() => sessionStorage.getItem('election'));
  expect(storedData).toBe(JSON.stringify({
    uuid: "abc",
    title: "Eleccion",
    description: ".",
    imageUrl: "",
    startsAt: "2023-10-10T08:53:00",
    endsAt: "2023-10-24T08:53:00",
    electionPositions: [
      {
        uuid: "presi",
        title: "Presidencia",
        description: "",
        formulas: [
          {
            uuid: "143",
            title: "title",
            idNumber: "143",
            candidates: [
              {
                uuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                data: {
                  docNumber:98490,
                  name: "Sergio",
                  lastName: "Massa",
                  docType: "DNI",
                  imageUrl: "https://pbs.twimg.com/profile_images/1709748513565810689/rO356hOB_400x400.jpg",
                  electorTableUuid: null,
                  authorityTableUuid: null,
                  electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                  candidateUuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                  hasVoted: null,
                  votedAt: null
                },
                role: "Presidente",
                imageUrl: null,
                formulaUuid: "43a70d5f-191a-458d-8120-094ac9e439f3",
                zindex: 0
              }
            ],
            party: {
              uuid: "party",
              name: "La libertad avanza",
              colorHex: "#822ed6",
              logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg"
            },
            election: {
              uuid: "abc",
              title: "Eleccion",
              description: ".",
               imageUrl: "",
               startsAt: "2023-10-10T08:53:00",
              endsAt: "2023-10-24T08:53:00",
            }
          }
        ],
      }
    ],
    votingTables: [
      {
        uuid: "1",
        publicKey: "MIIBCgKCAQEAve8D9Fhu6+O+Ptu8xLRbEYt3h+OohTW0RqidVX4BkY3dXdfaIQyBidkYTGRzjVa+LHuJNwQ9liDj3luJ2CJyWI+Ou1sOlf9dDEZUGvXQ8JoO4IS/yLpPiH7dWaJ8kBLfmcfL5ZNJ/uMwaCr8zOh8s8Jf48gRbdob/DFMHdJ6LFLnhPANeuWvHr8C4kaz73U+nAd8OT1O/FoUBAoDG7EPnR4OLE5EzqocUXvspxw4Cyk48QQd3aZ9euMHMoY94VkejAzVzk7+RabY4LlIpV/Y9USSngWvMv1yj8W4silMSnHAGZGSOD4Uwz9ltj5oxAQoZyfreKz46IusPtB+chci7wIDAQAB-----END RSA PUBLIC KEY-----\n",
        hashedResults: null,
        electors: [
          {
            docNumber: 12364486,
            name: "Federico",
            lastName: "Botti",
            docType: "DNI",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: true,
            votedAt: "2024-10-08T11:57:02.143456"
          },
          {
            docNumber: 30728575,
            name: "Manuel",
            lastName: "Azcazabal",
            docType: "DNI",
            imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: null,
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: true,
            votedAt: "2024-10-08T11:57:52.886847"
          },
          {
            docNumber: 33117456,
            name: "Soledad",
            lastName: "Arancibia",
            docType: "DNI",
            imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: null,
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: null,
            votedAt: null
          },
          {
            docNumber: 123456780,
            name: "Yolanda",
            lastName: "Antara",
            docType: "DNI",
            imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: null,
            votedAt: null
          },
          {
            docNumber: 254891407,
            name: "Jorge",
            lastName: "Bruneo",
            docType: "DNI",
            imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: null,
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: null,
            votedAt: null
          }
        ],
        authorities: [
          {
            docNumber: 12364486,
            name: "Federico",
            lastName: "Botti",
            docType: "DNI",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: true,
            votedAt: "2024-10-08T11:57:02.143456"
          },
          {
            docNumber: 123456780,
            name: "Yolanda",
            lastName: "Antara",
            docType: "DNI",
            imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: null,
            votedAt: null
          }
        ],
        location: {
          country: "Argentina",
          state: "Buenos Aires",
          city: "Capital",
          address: "Av Cordoba 2002"
        },
        electionUuid: "abc",
        results: {},
        enabledToVote: false
      },
      {
        uuid: "2",
        publicKey: "MIIBCgKCAQEAve8D9Fhu6+O+Ptu8xLRbEYt3h+OohTW0RqidVX4BkY3dXdfaIQyBidkYTGRzjVa+LHuJNwQ9liDj3luJ2CJyWI+Ou1sOlf9dDEZUGvXQ8JoO4IS/yLpPiH7dWaJ8kBLfmcfL5ZNJ/uMwaCr8zOh8s8Jf48gRbdob/DFMHdJ6LFLnhPANeuWvHr8C4kaz73U+nAd8OT1O/FoUBAoDG7EPnR4OLE5EzqocUXvspxw4Cyk48QQd3aZ9euMHMoY94VkejAzVzk7+RabY4LlIpV/Y9USSngWvMv1yj8W4silMSnHAGZGSOD4Uwz9ltj5oxAQoZyfreKz46IusPtB+chci7wIDAQAB-----END RSA PUBLIC KEY-----\n",
        hashedResults: null,
        electors: [
          {
            docNumber: 12364486,
            name: "Federico",
            lastName: "Botti",
            docType: "DNI",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: true,
            votedAt: "2024-10-08T11:57:02.143456"
          },
          {
            docNumber: 30728575,
            name: "Manuel",
            lastName: "Azcazabal",
            docType: "DNI",
            imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: null,
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: true,
            votedAt: "2024-10-08T11:57:52.886847"
          },
          {
            docNumber: 33117456,
            name: "Soledad",
            lastName: "Arancibia",
            docType: "DNI",
            imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: null,
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: null,
            votedAt: null
          },
          {
            docNumber: 123456780,
            name: "Yolanda",
            lastName: "Antara",
            docType: "DNI",
            imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: null,
            votedAt: null
          },
          {
            docNumber: 254891407,
            name: "Jorge",
            lastName: "Bruneo",
            docType: "DNI",
            imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: null,
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: null,
            votedAt: null
          }
        ],
        authorities: [
          {
            docNumber: 12364486,
            name: "Federico",
            lastName: "Botti",
            docType: "DNI",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: true,
            votedAt: "2024-10-08T11:57:02.143456"
          },
          {
            docNumber: 123456780,
            name: "Yolanda",
            lastName: "Antara",
            docType: "DNI",
            imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
            electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
            electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
            candidateUuid: null,
            hasVoted: null,
            votedAt: null
          }
        ],
        location: {
          country: "Argentina",
          state: "Buenos Aires",
          city: "Capital",
          address: "Av Cordoba 2402"
        },
        electionUuid: "abc",
        results: {},
        enabledToVote: false
      }
    ],
    parties: [
      {
        uuid: "9fe10876-db5c-4c52-9c57-e24806c72450",
        name: "La libertad avanza",
        colorHex: "#822ed6",
        logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg",
        electionUuid: "abc",
      }
    ],
    formulas: [
      {
        uuid: "143",
        title: "title",
        idNumber: "143",
        candidates: [
          {
            uuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
            data: {
              docNumber:98490,
              name: "Sergio",
              lastName: "Massa",
              docType: "DNI",
              imageUrl: "https://pbs.twimg.com/profile_images/1709748513565810689/rO356hOB_400x400.jpg",
              electorTableUuid: null,
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
              hasVoted: null,
              votedAt: null
            },
            role: "Presidente",
            imageUrl: null,
            formulaUuid: "43a70d5f-191a-458d-8120-094ac9e439f3",
            zindex: 0
          }
        ],
        party: {
          uuid: "party",
          name: "La libertad avanza",
          colorHex: "#822ed6",
          logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg"
        },
        election: {
          uuid: "abc",
          title: "Eleccion",
          description: ".",
           imageUrl: "",
           startsAt: "2023-10-10T08:53:00",
          endsAt: "2023-10-24T08:53:00",
        }
      }
    ],
    people: [],
    computedResults: {},
    username: "valentin"
  }));

  await page.locator('.title-container h4');
  const title = await page.locator('.title-container h4');
  expect(await title.textContent()).toBe('Eleccion');
});

test('Visualizar la informacion de la mesa seleccionada', async ({ page, request }) => {
  // Enviar una solicitud POST para crear la elección directamente
  
  await page.goto('http://localhost:3000');
 
  // Navigate to an empty page first (to avoid race conditions)
  await page.evaluate(() => {
    // Mocking sessionStorage data
    sessionStorage.setItem('tableUuid',"1");
    sessionStorage.setItem('positions',JSON.stringify( {
      uuid: "presi",
      title: "Presidencia",
      description: "",
      formulas: [
        {
          uuid: "143",
          title: "title",
          idNumber: "143",
          candidates: [
            {
              uuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
              data: {
                docNumber:98490,
                name: "Sergio",
                lastName: "Massa",
                docType: "DNI",
                imageUrl: "https://pbs.twimg.com/profile_images/1709748513565810689/rO356hOB_400x400.jpg",
                electorTableUuid: null,
                authorityTableUuid: null,
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                hasVoted: null,
                votedAt: null
              },
              role: "Presidente",
              imageUrl: null,
              formulaUuid: "43a70d5f-191a-458d-8120-094ac9e439f3",
              zindex: 0
            }
          ],
          party: {
            uuid: "party",
            name: "La libertad avanza",
            colorHex: "#822ed6",
            logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg"
          },
          election: {
            uuid: "abc",
            title: "Eleccion",
            description: ".",
             imageUrl: "",
             startsAt: "2023-10-10T08:53:00",
            endsAt: "2023-10-24T08:53:00",
          }
        }
      ],
    }));
    sessionStorage.setItem('formulas',JSON.stringify({title: "go"}));
    sessionStorage.setItem('display',true);
    sessionStorage.setItem('tableInfo',JSON.stringify({
      uuid: "1",
      publicKey:"key",
      hashedResults: "hash",
      electors: [
        {
          docNumber: 12364486,
          name: "Federico",
          lastName: "Botti",
          docType: "DNI",
          imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
          electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
          authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
          electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
          candidateUuid: null,
          hasVoted: true,
          votedAt: "2024-10-08T11:57:02.143456"
        },
        {
          docNumber: 30728575,
          name: "Manuel",
          lastName: "Azcazabal",
          docType: "DNI",
          imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
          electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
          authorityTableUuid: null,
          electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
          candidateUuid: null,
          hasVoted: true,
          votedAt: "2024-10-08T11:57:52.886847"
        },
        {
          docNumber: 33117456,
          name: "Soledad",
          lastName: "Arancibia",
          docType: "DNI",
          imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
          electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
          authorityTableUuid: null,
          electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
          candidateUuid: null,
          hasVoted: null,
          votedAt: null
        },
        {
          docNumber: 123456780,
          name: "Yolanda",
          lastName: "Antara",
          docType: "DNI",
          imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
          electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
          authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
          electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
          candidateUuid: null,
          hasVoted: null,
          votedAt: null
        },
        {
          docNumber: 254891407,
          name: "Jorge",
          lastName: "Bruneo",
          docType: "DNI",
          imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
          electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
          authorityTableUuid: null,
          electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
          candidateUuid: null,
          hasVoted: null,
          votedAt: null
        }
      ],
      authorities: [
        {
          docNumber: 12364486,
          name: "Federico",
          lastName: "Botti",
          docType: "DNI",
          imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
          electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
          authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
          electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
          candidateUuid: null,
          hasVoted: true,
          votedAt: "2024-10-08T11:57:02.143456"
        },
        {
          docNumber: 123456780,
          name: "Yolanda",
          lastName: "Antara",
          docType: "DNI",
          imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
          electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
          authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
          electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
          candidateUuid: null,
          hasVoted: null,
          votedAt: null
        }
      ],
      location: {
        country: "Argentina",
        state: "Buenos Aires",
        city: "Capital",
        address: "Av Cordoba 2002"
      },
      electionUuid: "abc",
      results: {},
      enabledToVote: false
    }));
  });

  await page.route('**/api/tables/1', async (route) => {
    const mockData = {
          uuid: "1",
          publicKey:"key",
          hashedResults: "hash",
          electors: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 30728575,
              name: "Manuel",
              lastName: "Azcazabal",
              docType: "DNI",
              imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:52.886847"
            },
            {
              docNumber: 33117456,
              name: "Soledad",
              lastName: "Arancibia",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 254891407,
              name: "Jorge",
              lastName: "Bruneo",
              docType: "DNI",
              imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          authorities: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          location: {
            country: "Argentina",
            state: "Buenos Aires",
            city: "Capital",
            address: "Av Cordoba 2002"
          },
          electionUuid: "abc",
          results: {},
          enabledToVote: false
        }
    await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(mockData),
    });
});
  // Now navigate to the page you want to test
  await page.goto('http://localhost:3000/election/table');


   // Wait for the text container to be rendered
   await page.waitForSelector('.text-container');

   // Locate the h6 element (the title field inside text-container)
   const titleField = page.locator('.text-container h6.title-field').filter({ hasText: 'Hash' });
   const titleField2 = page.locator('.text-container h6.title-field').filter({ hasText: 'Public key' });
 
   // Check if the h6 element is visible
   await expect(titleField).toBeVisible();
   await expect(titleField2).toBeVisible();
   // Extract and verify the title content
   const titleContent = await titleField.textContent();
   const titleContent2 = await titleField2.textContent();
   // Perform an assertion (check if the title matches the expected value)
   await expect(titleContent).toBe('Hash');
   await expect(titleContent2).toBe('Public key');

   
   // Locate the p element (the output field inside text-container)
   const outputField = page.locator('.text-container p.output-field').filter({ hasText: 'hash' });
 
   // Check if the p element is visible
   await expect(outputField).toBeVisible();
 
   // Extract and verify the content of the output field
   const outputContent = await outputField.textContent();
 
   // Perform an assertion (check if the output content is not empty)
   await expect(outputContent).not.toBeNull();
   await expect(outputContent).not.toBe('');



   const outputField2 = page.locator('.text-container p.output-field').filter({ hasText: 'key' });
 
   // Check if the p element is visible
   await expect(outputField2).toBeVisible();
 
   // Extract and verify the content of the output field
   const outputContent2 = await outputField2.textContent();
 
   // Perform an assertion (check if the output content is not empty)
   await expect(outputContent2).not.toBeNull();
   await expect(outputContent2).not.toBe('');
});

test.describe('Menu Component', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the page where the Menu component is rendered
        await page.goto('http://localhost:3000'); // Adjust the URL as needed
       
       


    });

    test('should open Signin modal and fill in the form', async ({ page }) => {
        // Click the "Crear usuario" button to open the Signin modal
        await page.click('text=Crear usuario');

        // Fill in the Signin form
        await page.fill('input[name="Usuario"]', 'testuser');
        await page.fill('input[name="Contraseña"]', 'password123');
     

        // Click the "Continuar" button to go to the next step
        await page.click('text=Continuar');

        // Fill in the second step of the form
        await page.fill('input[name="Email"]', 'testuser@example.com');
        await page.fill('input[name="Nombre"]', 'Test');
        await page.fill('input[name="Apellido"]', 'User');
        await page.fill('input[name="Imagen"]', 'http://example.com/image.jpg');

        // Click the "Registrarme" button to submit the form
        await page.click('text=Continuar');

        // Assert that the modal is closed or check for a success message
        // You can check for a specific element that appears after successful registration
        await expect(page.locator('text=Cree su cuenta')).not.toBeVisible();
    });

    test('should open Login modal and fill in the form', async ({ page }) => {
      // Click the "Iniciar sesion" button to open the Login modal
      await page.click('text=Iniciar sesion');
  
      // Fill in the Login form
      await page.fill('input[name="Usuario"]', 'testuser');
      await page.fill('input[name="Contraseña"]', 'password123');
  
      // Mock the API response for login
     
      // Click the "Iniciar sesion" button to submit the form
      await page.click('text=Iniciar sesion', { force: true });

      // Wait for the modal to close
      await expect(page.locator('text=Inicie sesion')).toBeHidden(); // Wait for the modal to be hidden
  });

    
    
});

test('Visualizar titulo de home',async({page,request}) => {

  await page.goto('http://localhost:3000');
  const titleByClass = await page.locator('.HeadContent-title');
  await expect(titleByClass).toBeVisible();
  expect(await titleByClass.textContent()).toBe('Bienvenido a Diafanis'); // Check title for the first card
  const subtitleByClass = await page.locator('.HeadContent-text');
  await expect(subtitleByClass).toBeVisible();
  expect(await subtitleByClass.textContent()).toBe('Su sistema de votacion de confianza'); // Check title for the first card\
});

test('Visualizar titulo de la grilla',async({page,request}) => {

  await page.goto('http://localhost:3000');
  const subTitle = await page.locator('.subTitle');
  await expect(subTitle).toBeVisible();
  expect(await subTitle.textContent()).toBe('Elecciones activas'); // Check title for the first card
 });

test("Flujo de usuario revisando una eleccion",async({page,request}) => {
 

  await page.route('**/api/elections', async (route) => {
    const mockData = [
      { uuid: '2', title: 'Election 1', imageUrl: '' },
      {
        uuid: "abc",
        title: "Eleccion",
        description: ".",
        imageUrl: "",
        startsAt: "2023-10-10T08:53:00",
        endsAt: "2023-10-24T08:53:00",
        electionPositions: [
          {
            uuid: "presi",
            title: "Presidencia",
            description: "",
            formulas: [
              {
                uuid: "143",
                title: "title",
                idNumber: "143",
                candidates: [
                  {
                    uuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                    data: {
                      docNumber:98490,
                      name: "Sergio",
                      lastName: "Massa",
                      docType: "DNI",
                      imageUrl: "https://pbs.twimg.com/profile_images/1709748513565810689/rO356hOB_400x400.jpg",
                      electorTableUuid: null,
                      authorityTableUuid: null,
                      electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                      candidateUuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                      hasVoted: null,
                      votedAt: null
                    },
                    role: "Presidente",
                    imageUrl: null,
                    formulaUuid: "43a70d5f-191a-458d-8120-094ac9e439f3",
                    zindex: 0
                  }
                ],
                party: {
                  uuid: "party",
                  name: "La libertad avanza",
                  colorHex: "#822ed6",
                  logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg"
                },
                election: {
                  uuid: "abc",
                  title: "Eleccion",
                  description: ".",
                   imageUrl: "",
                   startsAt: "2023-10-10T08:53:00",
                  endsAt: "2023-10-24T08:53:00",
                }
              }
            ],
          }
        ],
        votingTables: [
          {
            uuid: "1",
            publicKey: "MIIBCgKCAQEAve8D9Fhu6+O+Ptu8xLRbEYt3h+OohTW0RqidVX4BkY3dXdfaIQyBidkYTGRzjVa+LHuJNwQ9liDj3luJ2CJyWI+Ou1sOlf9dDEZUGvXQ8JoO4IS/yLpPiH7dWaJ8kBLfmcfL5ZNJ/uMwaCr8zOh8s8Jf48gRbdob/DFMHdJ6LFLnhPANeuWvHr8C4kaz73U+nAd8OT1O/FoUBAoDG7EPnR4OLE5EzqocUXvspxw4Cyk48QQd3aZ9euMHMoY94VkejAzVzk7+RabY4LlIpV/Y9USSngWvMv1yj8W4silMSnHAGZGSOD4Uwz9ltj5oxAQoZyfreKz46IusPtB+chci7wIDAQAB-----END RSA PUBLIC KEY-----\n",
            hashedResults: null,
            electors: [
              {
                docNumber: 12364486,
                name: "Federico",
                lastName: "Botti",
                docType: "DNI",
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
                electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: null,
                hasVoted: true,
                votedAt: "2024-10-08T11:57:02.143456"
              },
              {
                docNumber: 30728575,
                name: "Manuel",
                lastName: "Azcazabal",
                docType: "DNI",
                imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
                electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                authorityTableUuid: null,
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: null,
                hasVoted: true,
                votedAt: "2024-10-08T11:57:52.886847"
              },
              {
                docNumber: 33117456,
                name: "Soledad",
                lastName: "Arancibia",
                docType: "DNI",
                imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
                electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                authorityTableUuid: null,
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: null,
                hasVoted: null,
                votedAt: null
              },
              {
                docNumber: 123456780,
                name: "Yolanda",
                lastName: "Antara",
                docType: "DNI",
                imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
                electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: null,
                hasVoted: null,
                votedAt: null
              },
              {
                docNumber: 254891407,
                name: "Jorge",
                lastName: "Bruneo",
                docType: "DNI",
                imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
                electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                authorityTableUuid: null,
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: null,
                hasVoted: null,
                votedAt: null
              }
            ],
            authorities: [
              {
                docNumber: 12364486,
                name: "Federico",
                lastName: "Botti",
                docType: "DNI",
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
                electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: null,
                hasVoted: true,
                votedAt: "2024-10-08T11:57:02.143456"
              },
              {
                docNumber: 123456780,
                name: "Yolanda",
                lastName: "Antara",
                docType: "DNI",
                imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
                electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: null,
                hasVoted: null,
                votedAt: null
              }
            ],
            location: {
              country: "Argentina",
              state: "Buenos Aires",
              city: "Capital",
              address: "Av Cordoba 2002"
            },
            electionUuid: "abc",
            results: {},
            enabledToVote: false
          },
          {
            uuid: "2",
            publicKey: "MIIBCgKCAQEAve8D9Fhu6+O+Ptu8xLRbEYt3h+OohTW0RqidVX4BkY3dXdfaIQyBidkYTGRzjVa+LHuJNwQ9liDj3luJ2CJyWI+Ou1sOlf9dDEZUGvXQ8JoO4IS/yLpPiH7dWaJ8kBLfmcfL5ZNJ/uMwaCr8zOh8s8Jf48gRbdob/DFMHdJ6LFLnhPANeuWvHr8C4kaz73U+nAd8OT1O/FoUBAoDG7EPnR4OLE5EzqocUXvspxw4Cyk48QQd3aZ9euMHMoY94VkejAzVzk7+RabY4LlIpV/Y9USSngWvMv1yj8W4silMSnHAGZGSOD4Uwz9ltj5oxAQoZyfreKz46IusPtB+chci7wIDAQAB-----END RSA PUBLIC KEY-----\n",
            hashedResults: null,
            electors: [
              {
                docNumber: 12364486,
                name: "Federico",
                lastName: "Botti",
                docType: "DNI",
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
                electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: null,
                hasVoted: true,
                votedAt: "2024-10-08T11:57:02.143456"
              },
              {
                docNumber: 30728575,
                name: "Manuel",
                lastName: "Azcazabal",
                docType: "DNI",
                imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
                electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                authorityTableUuid: null,
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: null,
                hasVoted: true,
                votedAt: "2024-10-08T11:57:52.886847"
              },
              {
                docNumber: 33117456,
                name: "Soledad",
                lastName: "Arancibia",
                docType: "DNI",
                imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
                electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                authorityTableUuid: null,
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: null,
                hasVoted: null,
                votedAt: null
              },
              {
                docNumber: 123456780,
                name: "Yolanda",
                lastName: "Antara",
                docType: "DNI",
                imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
                electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: null,
                hasVoted: null,
                votedAt: null
              },
              {
                docNumber: 254891407,
                name: "Jorge",
                lastName: "Bruneo",
                docType: "DNI",
                imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
                electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                authorityTableUuid: null,
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: null,
                hasVoted: null,
                votedAt: null
              }
            ],
            authorities: [
              {
                docNumber: 12364486,
                name: "Federico",
                lastName: "Botti",
                docType: "DNI",
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
                electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: null,
                hasVoted: true,
                votedAt: "2024-10-08T11:57:02.143456"
              },
              {
                docNumber: 123456780,
                name: "Yolanda",
                lastName: "Antara",
                docType: "DNI",
                imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
                electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: null,
                hasVoted: null,
                votedAt: null
              }
            ],
            location: {
              country: "Argentina",
              state: "Buenos Aires",
              city: "Capital",
              address: "Av Cordoba 2402"
            },
            electionUuid: "abc",
            results: {},
            enabledToVote: false
          }
        ],
        parties: [
          {
            uuid: "9fe10876-db5c-4c52-9c57-e24806c72450",
            name: "La libertad avanza",
            colorHex: "#822ed6",
            logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg",
            electionUuid: "abc",
          }
        ],
        formulas: [
          {
            uuid: "143",
            title: "title",
            idNumber: "143",
            candidates: [
              {
                uuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                data: {
                  docNumber:98490,
                  name: "Sergio",
                  lastName: "Massa",
                  docType: "DNI",
                  imageUrl: "https://pbs.twimg.com/profile_images/1709748513565810689/rO356hOB_400x400.jpg",
                  electorTableUuid: null,
                  authorityTableUuid: null,
                  electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                  candidateUuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                  hasVoted: null,
                  votedAt: null
                },
                role: "Presidente",
                imageUrl: null,
                formulaUuid: "43a70d5f-191a-458d-8120-094ac9e439f3",
                zindex: 0
              }
            ],
            party: {
              uuid: "party",
              name: "La libertad avanza",
              colorHex: "#822ed6",
              logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg"
            },
            election: {
              uuid: "abc",
              title: "Eleccion",
              description: ".",
               imageUrl: "",
               startsAt: "2023-10-10T08:53:00",
              endsAt: "2023-10-24T08:53:00",
            }
          }
        ],
        people: [],
        computedResults: {},
        username: "valentin"
      },
    ];
    // Respond with the mock data
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(mockData),
    });
  });

   await page.goto('http://localhost:3000');
   await page.route('**/api/elections/abc', async (route) => {
    const mockData = {
      uuid: "abc",
      title: "Eleccion",
      description: ".",
      imageUrl: "",
      startsAt: "2023-10-10T08:53:00",
      endsAt: "2023-10-24T08:53:00",
      electionPositions: [
        {
          uuid: "presi",
          title: "Presidencia",
          description: "",
          formulas: [
            {
              uuid: "143",
              title: "title",
              idNumber: "143",
              candidates: [
                {
                  uuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                  data: {
                    docNumber:98490,
                    name: "Sergio",
                    lastName: "Massa",
                    docType: "DNI",
                    imageUrl: "https://pbs.twimg.com/profile_images/1709748513565810689/rO356hOB_400x400.jpg",
                    electorTableUuid: null,
                    authorityTableUuid: null,
                    electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                    candidateUuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                    hasVoted: null,
                    votedAt: null
                  },
                  role: "Presidente",
                  imageUrl: null,
                  formulaUuid: "43a70d5f-191a-458d-8120-094ac9e439f3",
                  zindex: 0
                }
              ],
              party: {
                uuid: "party",
                name: "La libertad avanza",
                colorHex: "#822ed6",
                logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg"
              },
              election: {
                uuid: "abc",
                title: "Eleccion",
                description: ".",
                 imageUrl: "",
                 startsAt: "2023-10-10T08:53:00",
                endsAt: "2023-10-24T08:53:00",
              }
            }
          ],
        }
      ],
      votingTables: [
        {
          uuid: "1",
          publicKey: "MIIBCgKCAQEAve8D9Fhu6+O+Ptu8xLRbEYt3h+OohTW0RqidVX4BkY3dXdfaIQyBidkYTGRzjVa+LHuJNwQ9liDj3luJ2CJyWI+Ou1sOlf9dDEZUGvXQ8JoO4IS/yLpPiH7dWaJ8kBLfmcfL5ZNJ/uMwaCr8zOh8s8Jf48gRbdob/DFMHdJ6LFLnhPANeuWvHr8C4kaz73U+nAd8OT1O/FoUBAoDG7EPnR4OLE5EzqocUXvspxw4Cyk48QQd3aZ9euMHMoY94VkejAzVzk7+RabY4LlIpV/Y9USSngWvMv1yj8W4silMSnHAGZGSOD4Uwz9ltj5oxAQoZyfreKz46IusPtB+chci7wIDAQAB-----END RSA PUBLIC KEY-----\n",
          hashedResults: null,
          electors: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 30728575,
              name: "Manuel",
              lastName: "Azcazabal",
              docType: "DNI",
              imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:52.886847"
            },
            {
              docNumber: 33117456,
              name: "Soledad",
              lastName: "Arancibia",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 254891407,
              name: "Jorge",
              lastName: "Bruneo",
              docType: "DNI",
              imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          authorities: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          location: {
            country: "Argentina",
            state: "Buenos Aires",
            city: "Capital",
            address: "Av Cordoba 2002"
          },
          electionUuid: "abc",
          results: {},
          enabledToVote: false
        },
        {
          uuid: "2",
          publicKey: "MIIBCgKCAQEAve8D9Fhu6+O+Ptu8xLRbEYt3h+OohTW0RqidVX4BkY3dXdfaIQyBidkYTGRzjVa+LHuJNwQ9liDj3luJ2CJyWI+Ou1sOlf9dDEZUGvXQ8JoO4IS/yLpPiH7dWaJ8kBLfmcfL5ZNJ/uMwaCr8zOh8s8Jf48gRbdob/DFMHdJ6LFLnhPANeuWvHr8C4kaz73U+nAd8OT1O/FoUBAoDG7EPnR4OLE5EzqocUXvspxw4Cyk48QQd3aZ9euMHMoY94VkejAzVzk7+RabY4LlIpV/Y9USSngWvMv1yj8W4silMSnHAGZGSOD4Uwz9ltj5oxAQoZyfreKz46IusPtB+chci7wIDAQAB-----END RSA PUBLIC KEY-----\n",
          hashedResults: null,
          electors: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 30728575,
              name: "Manuel",
              lastName: "Azcazabal",
              docType: "DNI",
              imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:52.886847"
            },
            {
              docNumber: 33117456,
              name: "Soledad",
              lastName: "Arancibia",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 254891407,
              name: "Jorge",
              lastName: "Bruneo",
              docType: "DNI",
              imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          authorities: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          location: {
            country: "Argentina",
            state: "Buenos Aires",
            city: "Capital",
            address: "Av Cordoba 2402"
          },
          electionUuid: "abc",
          results: {},
          enabledToVote: false
        }
      ],
      parties: [
        {
          uuid: "9fe10876-db5c-4c52-9c57-e24806c72450",
          name: "La libertad avanza",
          colorHex: "#822ed6",
          logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg",
          electionUuid: "abc",
        }
      ],
      formulas: [
        {
          uuid: "143",
          title: "title",
          idNumber: "143",
          candidates: [
            {
              uuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
              data: {
                docNumber:98490,
                name: "Sergio",
                lastName: "Massa",
                docType: "DNI",
                imageUrl: "https://pbs.twimg.com/profile_images/1709748513565810689/rO356hOB_400x400.jpg",
                electorTableUuid: null,
                authorityTableUuid: null,
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                hasVoted: null,
                votedAt: null
              },
              role: "Presidente",
              imageUrl: null,
              formulaUuid: "43a70d5f-191a-458d-8120-094ac9e439f3",
              zindex: 0
            }
          ],
          party: {
            uuid: "party",
            name: "La libertad avanza",
            colorHex: "#822ed6",
            logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg"
          },
          election: {
            uuid: "abc",
            title: "Eleccion",
            description: ".",
             imageUrl: "",
             startsAt: "2023-10-10T08:53:00",
            endsAt: "2023-10-24T08:53:00",
          }
        }
      ],
      people: [],
      computedResults: {},
      username: "valentin"
    };
    await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(mockData),
    });
  });
  await page.locator('.card').nth(1).click({ force: true });
  await page.evaluate(() => {
    sessionStorage.setItem('positions',JSON.stringify( {
      uuid: "presi",
      title: "Presidencia",
      description: "",
      formulas: [
        {
          uuid: "143",
          title: "title",
          idNumber: "143",
          candidates: [
            {
              uuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
              data: {
                docNumber:98490,
                name: "Sergio",
                lastName: "Massa",
                docType: "DNI",
                imageUrl: "https://pbs.twimg.com/profile_images/1709748513565810689/rO356hOB_400x400.jpg",
                electorTableUuid: null,
                authorityTableUuid: null,
                electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
                candidateUuid: "36890a43-12aa-41bf-a0f2-dbf50dae0b65",
                hasVoted: null,
                votedAt: null
              },
              role: "Presidente",
              imageUrl: null,
              formulaUuid: "43a70d5f-191a-458d-8120-094ac9e439f3",
              zindex: 0
            }
          ],
          party: {
            uuid: "party",
            name: "La libertad avanza",
            colorHex: "#822ed6",
            logoUrl: "https://pbs.twimg.com/profile_images/1422950434751369222/njQmVapA_400x400.jpg"
          },
          election: {
            uuid: "abc",
            title: "Eleccion",
            description: ".",
             imageUrl: "",
             startsAt: "2023-10-10T08:53:00",
            endsAt: "2023-10-24T08:53:00",
          }
        }
      ],
    }));
    sessionStorage.setItem('formulas',JSON.stringify({title: "go"}));
    sessionStorage.setItem('display',true);
  
  
   
  });

   await page.waitForSelector('.list-tables > div'); // Wait for the tables to be rendered
  const tables = await page.locator('.list-tables > div'); 
  expect(await tables.count()).toBe(2); // Expecting 2 voting tables to be displayed
  expect(await tables.nth(0).locator('h4').textContent()).toBe('Mesa'); // Check title for the first card
  expect(await tables.nth(1).locator('h4').textContent()).toBe('Mesa'); // Check title for the second card
 
  
  const title = await page.locator('.title-container h4');
  expect(await title.textContent()).toBe('Eleccion');
  await page.route('**/api/tables/1', async (route) => {
    const mockData = {
          uuid: "1",
          publicKey:"key",
          hashedResults: "hash",
          electors: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 30728575,
              name: "Manuel",
              lastName: "Azcazabal",
              docType: "DNI",
              imageUrl: "https://issi.dsic.upv.es/Members/agomez/images/foto-carnet.png/image",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:52.886847"
            },
            {
              docNumber: 33117456,
              name: "Soledad",
              lastName: "Arancibia",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            },
            {
              docNumber: 254891407,
              name: "Jorge",
              lastName: "Bruneo",
              docType: "DNI",
              imageUrl: "https://www.eventosfilm.com/wp-content/uploads/2018/02/foto-visa-5x5-para-los-Estados-Unidos-300x300.gif",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: null,
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          authorities: [
            {
              docNumber: 12364486,
              name: "Federico",
              lastName: "Botti",
              docType: "DNI",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZlHUd4RJkGjfDSEHpIabfOICHm5gB5tBdSPm7P5pM4Voyhr351JP6S8EU2Rm7Q3lIIY4&usqp=CAU",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: true,
              votedAt: "2024-10-08T11:57:02.143456"
            },
            {
              docNumber: 123456780,
              name: "Yolanda",
              lastName: "Antara",
              docType: "DNI",
              imageUrl: "https://i.pinimg.com/474x/b8/91/fb/b891fb0046f2a92b99754d061710c1dc.jpg",
              electorTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              authorityTableUuid: "dde5af06-1b3a-442e-b792-38e1d3032699",
              electionUuid: "61837185-520f-4487-b754-b6f30231ac91",
              candidateUuid: null,
              hasVoted: null,
              votedAt: null
            }
          ],
          location: {
            country: "Argentina",
            state: "Buenos Aires",
            city: "Capital",
            address: "Av Cordoba 2002"
          },
          electionUuid: "abc",
          results: {},
          enabledToVote: false
        }
    await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(mockData),
    });
});

await page.locator('.table-container').nth(0).click({ force: true });
await page.waitForSelector('.text-container');

// Locate the h6 element (the title field inside text-container)
const titleField = page.locator('.text-container h6.title-field').filter({ hasText: 'Hash' });
const titleField2 = page.locator('.text-container h6.title-field').filter({ hasText: 'Public key' });

// Check if the h6 element is visible
await expect(titleField).toBeVisible();
await expect(titleField2).toBeVisible();
// Extract and verify the title content
const titleContent = await titleField.textContent();
const titleContent2 = await titleField2.textContent();
// Perform an assertion (check if the title matches the expected value)
await expect(titleContent).toBe('Hash');
await expect(titleContent2).toBe('Public key');


// Locate the p element (the output field inside text-container)
const outputField = page.locator('.text-container p.output-field').filter({ hasText: 'hash' });

// Check if the p element is visible
await expect(outputField).toBeVisible();

// Extract and verify the content of the output field
const outputContent = await outputField.textContent();

// Perform an assertion (check if the output content is not empty)
await expect(outputContent).not.toBeNull();
await expect(outputContent).not.toBe('');



const outputField2 = page.locator('.text-container p.output-field').filter({ hasText: 'key' });

// Check if the p element is visible
await expect(outputField2).toBeVisible();

// Extract and verify the content of the output field
const outputContent2 = await outputField2.textContent();

// Perform an assertion (check if the output content is not empty)
await expect(outputContent2).not.toBeNull();
await expect(outputContent2).not.toBe('');
});





const { test, expect } = require('@playwright/test');
//TODO: crear un usuario previamente para poder obtener el sessionStorage
test('Visualizar las elecciones en home correctamente', async ({ page, request }) => {
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

  await page.waitForSelector('.list-tables > div'); // Wait for the tables to be rendered
  const tables = await page.locator('.list-tables > div'); 
  expect(await tables.count()).toBe(2); // Expecting 2 voting tables to be displayed
  
//  await page.waitForSelector('title-container > div'); // Wait for the tables to be rendered
  await page.locator('.title-container h4');
  const title = await page.locator('.title-container h4');
  expect(await title.textContent()).toBe('Eleccion');
  
  



// Verify that the mocked data is displayed
//const cards = await page.locator('.grid > div'); // Adjust the selector to match the structure of Card components
//expect(await cards.count()).toBe(2); // Expect 2 cards to be rendered

// Verify the content of the cards
//expect(await cards.nth(0).locator('h4').textContent()).toBe('Election 1'); // Check title for the first card
//expect(await cards.nth(1).locator('h4').textContent()).toBe('Election 2'); // Check title for the second card
});


import { expect, test } from "@playwright/test";
import { identityURL, contentURL } from "@src/environment/environment";
import { generateName, generateUUID } from "@src/helpers";
import { ApiManager } from "@src/api/apiManager";
import * as fs from "fs";

let am: ApiManager;

test.beforeAll(({ request }) => {
  am = new ApiManager(request);
});

test.describe("API Tests", () => {
  test("It should create a project", async ({ request }) => {
    //Action
    const response = await am
      .createProject(generateName())
      .then(
        async (response) =>
          (await response.json()) as { project: { id: string } }
      );

    //Assert
    expect(response.project.id).toBeDefined();

    //Clear
    const deleteResponse = await request.delete(
      `${identityURL}/projects/${response.project.id}`
    );
    expect(deleteResponse.status()).toBe(204);
  });

  test("It should update a project", async ({ request }) => {
    const projectName1 = generateName();
    const projectName2 = generateName();

    const responseProject = await am.createProject(projectName1).then(
      async (response) =>
        (await response.json()) as {
          project: { id: string; active: boolean; name: string };
        }
    );

    const response = await request
      .put(`${identityURL}/projects/${responseProject.project.id}`, {
        data: {
          name: projectName2,
          tags: [projectName2],
        },
      })
      .then(
        async (response) =>
          (await response.json()) as { name: string; tags: [] }
      );

    expect(response.name).toBe(projectName2);
    expect(response.tags).toStrictEqual([projectName2]);

    //Clear
    const deleteResponse = await request.delete(
      `${identityURL}/projects/${responseProject.project.id}`
    );
    expect(deleteResponse.status()).toBe(204);
  });

  test("It should archive a project", async ({ request }) => {
    const projectName1 = generateName();

    const responseProject = await am.createProject(projectName1).then(
      (response) =>
        response.json() as unknown as {
          project: { id: string; active: boolean; name: string };
        }
    );

    await request.put(`${identityURL}/projects/${responseProject.project.id}`, {
      data: {
        active: false,
        tags: [],
      },
    });

    const response = await request
      .get(`${identityURL}/projects/${responseProject.project.id}`)
      .then(
        async (response) =>
          (await response.json()) as {
            active: boolean;
          }
      );

    expect(response.active).toBe(false);
  });

  test("It should get list of active projects", async ({ request }) => {
    const responseProject = await am
      .createProject(generateName())
      .then(
        async (response) =>
          (await response.json()) as { project: { id: string } }
      );

    //Action
    const response = await request
      .get(
        `${identityURL}/search/projects/?active=true&tags=[]&sort=[]&pagesize=50`
      )
      .then(
        async (response) =>
          (await response.json()) as { elements: [{ id: string }] }
      );

    const foundProject = response.elements.some(
      (element) => element.id === responseProject.project.id
    );

    expect(foundProject).toBeTruthy();

    //Clear
    const deleteResponse = await request.delete(
      `${identityURL}/projects/${responseProject.project.id}`
    );
    expect(deleteResponse.status()).toBe(204);
  });

  test("It should search a project by name", async ({ request }) => {
    const projectName = generateName();

    const responseProject = await am
      .createProject(projectName)
      .then(
        async (response) =>
          (await response.json()) as { project: { id: string } }
      );

    const response = await request
      .get(`${identityURL}/search/projects?q=${projectName}`)
      .then(
        async (response) =>
          (await response.json()) as { cursor: { count: number } }
      );

    expect(response.cursor.count).toBe(1);

    //Clear
    const deleteResponse = await request.delete(
      `${identityURL}/projects/${responseProject.project.id}`
    );
    expect(deleteResponse.status()).toBe(204);
  });

  test("It should search a project by tag", async ({ request }) => {
    const projectName = generateName();
    const tag = generateName();

    const responseProject = await request
      .post(`${identityURL}/projects`, {
        data: {
          description: projectName,
          name: projectName,
          tags: [tag],
        },
      })
      .then(
        async (response) =>
          (await response.json()) as { project: { id: string } }
      );

    const response = await request
      .get(`${identityURL}/search/projects?tags=[${tag}]`, {})
      .then(
        async (response) =>
          (await response.json()) as { cursor: { count: number } }
      );

    expect(response.cursor.count).toBe(1);

    //Clear
    const deleteResponse = await request.delete(
      `${identityURL}/projects/${responseProject.project.id}`
    );
    expect(deleteResponse.status()).toBe(204);
  });

  test("It should create a kit", async ({ request }) => {
    const kitName = generateName();

    const response = await am.createKit(kitName);

    expect(response.status()).toBe(200);

    //Clear
    const responseBody = (await response.json()) as { id: string };

    const deleteResponse = await request
      .put(`${contentURL}/libraries/${responseBody.id}/`, {
        data: {
          active: false,
        },
      })
      .then(async (response) => (await response.json()) as { active: boolean });
    expect(deleteResponse.active).toBe(false);
  });

  test("It should publish a component", async ({ request }) => {
    const stream = fs.createReadStream("../../data/BOM/walls.zip");

    const projectName = generateName();
    const kitName = generateName();

    const responseKit = await request
      .post(`${contentURL}/libraries`, {
        data: {
          description: kitName,
          name: kitName,
          tags: [kitName],
        },
      })
      .then(async (response) => (await response.json()) as { id: string });

    const kitId = responseKit.id;

    const responseProject = await request
      .post(`${identityURL}/projects`, {
        data: {
          description: projectName,
          name: projectName,
          tags: [projectName],
        },
      })
      .then(
        async (response) =>
          (await response.json()) as { project: { id: string } }
      );

    const projectId = responseProject.project.id;

    await request
      .put(`${contentURL}/libraries/projects`, {
        data: {
          libs: [`${kitId}`],
          project: `${projectId}`,
        },
      })
      .then(
        async (response) =>
          (await response.json()) as { libraries: [{ id: string }] }
      );

    const responseItem = await request
      .post(`${contentURL}/content-items`, {
        headers: {
          "KC-Project": `${responseProject.project.id}`,
        },
        data: {
          name: generateName(),
          description: generateName(),
          source: "Autodesk Revit 2023-2023-23.0.11.19",
          tags: [],
          libraries: [`${kitId}`],
        },
      })
      .then(async (response) => (await response.json()) as { id: string });

    const responsePublish = await request
      .post(
        `${contentURL}/content-item-revs?item=${
          responseItem.id
        }&notes=${generateName()}&sourceId=${generateUUID()}&category=component&kind=component&state=progress`,
        {
          headers: {
            Accept: "multipart/form-data",
            "KC-Project": `${responseProject.project.id}`,
            Host: "content.qa.kitconnect.com",
          },
          multipart: {
            fileField: stream,
          },
        }
      )
      .then(
        async (response) =>
          (await response.json()) as { id: string; checksum: string }
      );

    expect(responsePublish.checksum).not.toBe("");
  });

  test("It should check BOM model for walls", async ({ request }) => {
    const stream = fs.createReadStream("../../data/BOM/walls.zip ");

    const responseKit = await am
      .createKit(generateName())
      .then(async (response) => (await response.json()) as { id: string });

    const responseProject = await am
      .createProject(generateName())
      .then(
        async (response) =>
          (await response.json()) as { project: { id: string } }
      );

    await request
      .put(`${contentURL}/libraries/projects`, {
        data: {
          libs: [`${responseKit.id}`],
          project: `${responseProject.project.id}`,
        },
      })
      .then(
        async (response) =>
          (await response.json()) as { libraries: [{ id: string }] }
      );

    const responseItem = await request
      .post(`${contentURL}/content-items`, {
        headers: {
          "KC-Project": `${responseProject.project.id}`,
        },
        data: {
          name: generateName(),
          description: generateName(),
          source: "Autodesk Revit 2023-2023-23.0.11.19",
          tags: [],
          libraries: [`${responseKit.id}`],
        },
      })
      .then(async (response) => (await response.json()) as { id: string });

    const responsePublish = await request
      .post(
        `${contentURL}/content-item-revs?item=${
          responseItem.id
        }&notes=${generateName()}&sourceId=${generateUUID()}&category=component&kind=component&state=progress`,
        {
          headers: {
            Accept: "multipart/form-data",
            "KC-Project": `${responseProject.project.id}`,
            Host: "content.qa.kitconnect.com",
          },
          multipart: {
            fileField: stream,
          },
        }
      )
      .then(
        async (response) =>
          (await response.json()) as { id: string; checksum: string }
      );

    const componentId = responsePublish.id;

    let componentData = {} as { id: string };

    while (!componentData.id) {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      componentData = await request
        .get(`${contentURL}/components/${componentId}/`, {
          headers: {
            "KC-Project": responseProject.project.id,
          },
        })
        .then(async (response) => (await response.json()) as { id: string });
    }

    const responseBOM = await request
      .get(
        `${contentURL}/components/dependencies/${componentData.id}?tags=[]&kinds=[]&states=[]&statuses=[]&cadVersions=[]&active=true&pagesize=50&sort=[]`,
        {
          headers: {
            "KC-Project": responseProject.project.id,
          },
        }
      )
      .then(
        async (response) =>
          (await response.json()) as {
            elements: [{ name: string; count: string }];
          }
      );

    const elementsIncluded = [
      "System::Curtain Wall Mullions::Circular Mullion test",
      "System::Curtain Wall Mullions::Ret 12",
      `System::Curtain Wall Mullions::2.5" x 5" Rectangular`, //12
      "System::Curtain Wall Mullions::Quad Mullion 2",
      "System::Curtain Wall Mullions::Trapezoid Mullion 1",
      "System::Curtain Wall Mullions::L Mullion Test",
      "System::Doors::Store Front Double Door",
      "System::Curtain Panels::Glazed", //4
      "System::Curtain Panels::Empty",
      "System::Walls::Storefront",
    ];

    const results = [] as boolean[];
    const counts = {};

    for (const element of elementsIncluded) {
      const found = responseBOM.elements.some(
        (result) => result.name === element
      );
      results.push(found);

      const specialElement =
        element === `System::Curtain Wall Mullions::2.5" x 5" Rectangular` ||
        element === "System::Curtain Panels::Glazed";

      if (specialElement) {
        const foundElement = responseBOM.elements.find(
          (result) => result.name === element
        );
        counts[element] = foundElement?.count;
      }
    }

    expect(results.every((element) => element === true)).toBeTruthy();
    expect(counts).toStrictEqual({
      'System::Curtain Wall Mullions::2.5" x 5" Rectangular': "12",
      "System::Curtain Panels::Glazed": "4",
    });
  });
});

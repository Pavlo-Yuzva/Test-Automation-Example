import { APIRequestContext } from "@playwright/test";
import { identityURL, contentURL } from "@src/environment/environment";
import { generateUUID, generateName } from "../helpers";
import * as fs from "fs";

type RequestBody = { [key: string]: string | number | boolean | null | object };

export class ApiManager {
  request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  public async createProject(name: string, body?: RequestBody) {
    const response = await this.request.post(`${identityURL}/projects`, {
      data: {
        name: name,
        description: name,
        tags: [name],
        ...body,
      },
    });

    return response;
  }

  public async createKit(name: string, body?: RequestBody) {
    const response = await this.request.post(`${contentURL}/libraries`, {
      data: {
        name: name,
        description: name,
        tags: [name],
        ...body,
      },
    });
    return response;
  }

  public async linkKitToProject(projectId: string, kitId: string) {
    const response = await this.request.put(
      `${contentURL}/libraries/projects`,
      {
        data: {
          libs: [`${kitId}`],
          project: `${projectId}`,
        },
      }
    );
    return response;
  }

  public async publishComponent(
    projectId: string,
    kitId: string,
    file: fs.ReadStream
  ) {
    const responseItem = await this.request
      .post(`${contentURL}/content-items`, {
        headers: {
          "KC-Project": `${projectId}`,
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

    const response = await this.request.post(
      `${contentURL}/content-item-revs?item=${
        responseItem.id
      }&notes=${generateName()}&sourceId=${generateUUID()}&category=component&kind=component&state=progress`,
      {
        headers: {
          Accept: "multipart/form-data",
          "KC-Project": `${projectId}`,
          Host: "content.qa.kitconnect.com",
        },
        multipart: {
          fileField: file,
        },
      }
    );

    return response;
  }

  public async getBOM(projectId: string, componentId: string) {
    let componentData = {} as { id: string };

    while (!componentData.id) {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      componentData = await this.request
        .get(`${contentURL}/components/${componentId}/`, {
          headers: {
            "KC-Project": projectId,
          },
        })
        .then(async (response) => (await response.json()) as { id: string });
    }

    const response = await this.request.get(
      `${contentURL}/components/dependencies/${componentData.id}?tags=[]&kinds=[]&states=[]&statuses=[]&cadVersions=[]&active=true&pagesize=50&sort=[]`,
      {
        headers: {
          "KC-Project": projectId,
        },
      }
    );

    return response;
  }
}

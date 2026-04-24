// src/lib/webcontainer.ts
import { WebContainer } from '@webcontainer/api';
import { files } from './files';

// Logic: Store the promise, not just the instance
let webcontainerPromise: Promise<WebContainer> | null = null;

export async function getWebContainer() {
  if (!webcontainerPromise) {
    webcontainerPromise = WebContainer.boot().then(async (instance) => {
      await instance.mount(files);
      return instance;
    });
  }
  return webcontainerPromise;
}
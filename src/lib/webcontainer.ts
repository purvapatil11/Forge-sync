import { WebContainer } from "@webcontainer/api";
import { files } from './files'
let webcontainerInstance: WebContainer;

export async function getWebContainer() {
    //logic: only boot if instance dosent already exist
    if(!webcontainerInstance){
        console.log("Booting webcontainer engine....");
        webcontainerInstance = await WebContainer.boot();

        //logic: Mount our virtual files immediatly after the boot
        await webcontainerInstance.mount(files);
        console.log("Virtual File System Mounted.");
    }
    return webcontainerInstance
}
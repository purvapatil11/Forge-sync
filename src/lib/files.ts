export const files = {
    'package.json':{
        file: {
            contents: JSON.stringify({
                name: 'forge-sync-runtime',
                type: 'module',
                dependencies: {
                    "nodemon" : "^3.1.0" //using specific version
                },
                scripts: {
                    start: 'node index.js'
                }
            },null, 2)
        },
    },
    'index.js': {
        file: {
            contents: `
            console.log("Forge-Sync Engine Online...");
            process.stdin.on('data',(data) => {
            const sensorData = JSON.parse(data.toString())
            //logic written here will go in monacco
            console.log("Processing sensor Data:", sensorData);
            })
            `
        },
    },
}
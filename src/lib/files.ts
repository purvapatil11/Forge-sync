export const files = {
    'package.json':{
        file: {
            contents: JSON.stringify({
                name: 'forge-sync-runtime',
                type: 'module',
                dependencies: {
                    "nodemon" : "latest"
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
            // 
            console.log("Processing sensor Data:", sensorData);
            })
            `
        },
    },
}
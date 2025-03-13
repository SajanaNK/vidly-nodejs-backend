import config from "config";


export function startupConfig() {
    if(!config.get('jwtPrivateKey')){
        console.error('FATAL ERROR: jwtPrivateKey is not defined');
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
    }
}
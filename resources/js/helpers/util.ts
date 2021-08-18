export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function trimmed(str: string, len: number = 8, shouldCapitalizeFirstLetter = false){
    if(!str) return "";
    if(shouldCapitalizeFirstLetter)
        str = capitalizeFirstLetter(str);
    return str.length <= len ? str: `${str.substr(0, len)}...`
}


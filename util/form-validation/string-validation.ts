export const isLongerThan = (str: string, minNum: number): boolean => {
    if (str.length >= minNum) {
        return true;
    }
    return false;
}

export const isEmail = (str: string): boolean => {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(str);
}

export const isEqual = (str1: string, str2: string): boolean => {
    return str1 === str2;
}
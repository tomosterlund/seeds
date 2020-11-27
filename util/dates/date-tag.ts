const DateFormat = (str: string) => {
    const monthNr = str.substring(5, 7);
    const year = str.substring(0, 4);
    const dateNr = str.substring(8, 10);
    const monthsArr = ['nil', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthsArr[monthNr]} ${dateNr}, ${year}`
}

export default DateFormat;
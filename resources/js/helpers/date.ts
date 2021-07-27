import { MONTHS } from "../components/MonthSelectControl";

/**
 *
 * @params (date: string) - Must be in 'yyyy-mm-dd' format
 * @returns string - Example "08 Aug, 2021""
 */
export function appDateFormat(date: string) {
    const d = date.split("-");

    if(d.length !== 3){
        return "";
    }
    var year =d[0];
    var month = d[1];
    var day = d[2];

    return `${day} ${MONTHS[parseInt(month) - 1]}, ${year}`
}

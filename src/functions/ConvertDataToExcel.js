import XLSX from 'xlsx';

export const exportToCsv = (result) =>{
    let binaryWS = XLSX.utils.json_to_sheet(result);

// Create a new Workbook
    var wb = XLSX.utils.book_new()

// Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')

// export your excel
    XLSX.writeFile(wb, 'data.xlsx');
}



export default exportToCsv;
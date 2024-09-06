function openFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("กรุณาเลือกไฟล์");
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // แสดงข้อมูลทั้งหมดเพื่อการตรวจสอบ
        displayFileContent(jsonData, "ข้อมูลทั้งหมด");
    };
    
    reader.readAsArrayBuffer(file);
}

function displayFileContent(data, title) {
    const fileContentDiv = document.getElementById('fileContent');
    fileContentDiv.innerHTML = `<h3>${title}</h3>`; // แสดงหัวข้อ

    if (data.length > 0) {
        let html = '<table class="table table-bordered"><thead><tr>';

        // สร้างหัวตาราง
        for (const header of data[0]) {
            html += `<th>${header}</th>`;
        }
        html += '</tr></thead><tbody>';
        
        // แสดงข้อมูลในแต่ละแถวตามลำดับที่อยู่ในไฟล์
        for (let i = 1; i < data.length; i++) {
            html += '<tr>';
            for (const cell of data[i]) {
                html += `<td>${cell || ''}</td>`; // แสดงเซลล์ที่ว่างเป็นค่าว่างแทน undefined
            }
            html += '</tr>';
        }
        html += '</tbody></table>';

        fileContentDiv.innerHTML += html; // แสดงตารางข้อมูล
    } else {
        fileContentDiv.innerHTML += '<p>ไม่มีข้อมูลในไฟล์</p>';
    }
}
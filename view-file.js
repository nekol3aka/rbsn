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

        if (jsonData.length > 1) {
            const header = jsonData[0]; // แถวแรกเป็นหัวตาราง
            const rows = jsonData.slice(1); // ข้อมูลที่เหลือ

            // เรียงลำดับข้อมูลตามคอลัมน์แรก
            rows.sort((a, b) => {
                const valueA = a[0] || ''; // ถ้า a[0] ว่างให้ใช้ค่า ''
                const valueB = b[0] || ''; // ถ้า b[0] ว่างให้ใช้ค่า ''

                if (!isNaN(valueA) && !isNaN(valueB)) {
                    return valueA - valueB; // เรียงลำดับแบบตัวเลข
                }

                return valueA.toString().localeCompare(valueB.toString());
            });

            // แสดงผลตารางโดยมีหัวตารางอยู่ด้านบนเสมอ
            displayFileContent([header, ...rows]);
        } else {
            displayFileContent(jsonData);
        }
    };
    
    reader.readAsArrayBuffer(file);
}

function displayFileContent(data) {
    const fileContentDiv = document.getElementById('fileContent');
    fileContentDiv.innerHTML = ""; // ล้างเนื้อหาก่อนหน้า

    if (data.length > 0) {
        let table = '<table class="table table-bordered"><thead><tr>';
        
        const numberOfColumns = data[0].length; // นับจำนวนคอลัมน์จากหัวตาราง

        // สร้างหัวตาราง
        for (const header of data[0]) {
            table += `<th>${header}</th>`;
        }
        table += '</tr></thead><tbody>';
        
        // แสดงข้อมูลในแต่ละแถวตามลำดับที่อยู่ในไฟล์
        for (let i = 1; i < data.length; i++) {
            table += '<tr>';
            const row = data[i];

            // ตรวจสอบและเติมคอลัมน์ว่างหากแถวมีจำนวนน้อยกว่าหัวตาราง
            for (let j = 0; j < numberOfColumns; j++) {
                table += `<td>${row[j] || ''}</td>`; // แสดงเซลล์ที่ว่างเป็นค่าว่างแทน undefined
            }
            table += '</tr>';
        }
        table += '</tbody></table>';

        fileContentDiv.innerHTML = table; // แสดงตารางข้อมูล
    } else {
        fileContentDiv.innerHTML = '<p>ไม่มีข้อมูลในไฟล์</p>';
    }
}
// ฟังก์ชันหลักที่เรียกใช้งานเมื่ออัพโหลดไฟล์
function openFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("กรุณาเลือกไฟล์");
        return;
    }

    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsArrayBuffer(file);
}

// ฟังก์ชันที่จัดการการโหลดไฟล์
function handleFileLoad(event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // สมมติว่าข้อมูลลูกค้าเริ่มต้นที่แถว 0 และมีการสิ้นสุดที่แถวที่ 9
    const customerData = jsonData.slice(0, 10); // ดึงข้อมูลเฉพาะแถวที่ 0 ถึง 9

    // แสดงผลเฉพาะข้อมูลลูกค้า
    displayFileContent(customerData, "ข้อมูลลูกค้า");
}

// ฟังก์ชันที่แสดงข้อมูลในตาราง
function displayFileContent(data, title) {
    const fileContentDiv = document.getElementById('fileContent');
    let html = `<h3>${title}</h3>`;

    if (data.length > 0) {
        html += '<table class="table table-bordered"><thead><tr>';

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
    } else {
        html += '<p>ไม่มีข้อมูลในไฟล์</p>';
    }

    fileContentDiv.innerHTML = html; // แสดงตารางข้อมูล
}

// ฟังก์ชันที่พิมพ์เนื้อหาของตาราง
function printContent() {
    const printWindow = window.open('', '', 'height=600,width=800');
    const content = `
        <html>
        <head>
            <title>Print</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { padding: 20px; }
                .container { max-width: 100%; }
                .page-break { page-break-after: always; }
            </style>
        </head>
        <body>
            <div class="container">
                ${document.getElementById('fileContent').innerHTML}
            </div>
        </body>
        </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}
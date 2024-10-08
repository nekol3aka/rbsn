let itemIndex = 1;

// ฟังก์ชันเพิ่มรายการสินค้า
function addOrderItem() {
    itemIndex++;
    const orderItemsContainer = document.getElementById('orderItemsContainer');

    // สร้าง div ใหม่สำหรับรายการสินค้า
    const newOrderItemDiv = document.createElement('div');
    newOrderItemDiv.className = 'order-item mb-3';
    newOrderItemDiv.id = 'order_item_' + itemIndex;

    // กำหนด HTML ภายใน div ใหม่
    newOrderItemDiv.innerHTML = `
        <div class="row">
            <div class="col-md-3 mb-3">
                <label for="factory_${itemIndex}" class="form-label">โรงงาน:</label>
                <input type="text" id="factory_${itemIndex}" name="factory[]" class="form-control" placeholder="ชื่อโรงงาน" required>
            </div>
            <div class="col-md-5 mb-3">
                <label for="item_name_${itemIndex}" class="form-label">สินค้าที่สั่ง:</label>
                <input type="text" id="item_name_${itemIndex}" name="order_item[]" class="form-control" placeholder="ชื่อสินค้า" required>
            </div>
            <div class="col-md-2 mb-3">
                <label for="item_quantity_${itemIndex}" class="form-label">จำนวน:</label>
                <input type="number" id="item_quantity_${itemIndex}" name="order_quantity[]" class="form-control" min="1" placeholder="จำนวน" required>
            </div>
            <div class="col-md-2 mb-3">
                <label for="item_unit_${itemIndex}" class="form-label">หน่วยนับ:</label>
                <input type="text" id="item_unit_${itemIndex}" name="order_unit[]" class="form-control" placeholder="หน่วยนับ" required>
            </div>
            <div class="col-md-2 d-flex align-items-end">
                <button type="button" class="btn btn-danger remove-button" onclick="removeOrderItem(this)">
                    <i class="fas fa-trash"></i> ลบ
                </button>
            </div>
        </div>
    `;

    // เพิ่ม div ใหม่ไปยัง container
    orderItemsContainer.appendChild(newOrderItemDiv);
}

// ฟังก์ชันลบรายการสินค้า
function removeOrderItem(button) {
    const orderItemsContainer = document.getElementById('orderItemsContainer');
    orderItemsContainer.removeChild(button.closest('.order-item'));
}

// ฟังก์ชันบันทึกออเดอร์
function saveOrder() {
    const customerName = document.getElementById('customer_name').value;
    const fileName = document.getElementById('file_name').value;

    // ตรวจสอบการกรอกข้อมูล
    if (!customerName) {
        alert('กรุณากรอกชื่อลูกค้า');
        return;
    }
    if (!fileName) {
        alert('กรุณากรอกชื่อไฟล์');
        return;
    }

    const orderItems = document.getElementsByName("order_item[]");
    const factories = document.getElementsByName("factory[]");
    const orderQuantities = document.getElementsByName("order_quantity[]");
    const orderUnits = document.getElementsByName("order_unit[]");

    // สร้าง timestamp สำหรับชื่อไฟล์
    const currentDateTime = new Date();
    const timeStamp = `${currentDateTime.getFullYear()}${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}${currentDateTime.getDate().toString().padStart(2, '0')}_${currentDateTime.getHours().toString().padStart(2, '0')}${currentDateTime.getMinutes().toString().padStart(2, '0')}${currentDateTime.getSeconds().toString().padStart(2, '0')}`;

    // แปลงอักขระพิเศษในชื่อให้เป็น _
    const sanitizedCustomerName = customerName.replace(/[^a-zA-Z0-9]/g, '_');
    const downloadFileName = `${fileName}_${sanitizedCustomerName}_${timeStamp}.xlsx`;

    // สร้างข้อมูลสำหรับไฟล์ Excel
    const data = [
        ["ข้อมูลการสั่งซื้อ"],
        ["ชื่อร้านค้า:", customerName],
        ["วันที่/เวลา:", currentDateTime.toLocaleString()],
        [],
        ["โรงงาน", "สินค้าที่สั่ง", "จำนวน", "หน่วยนับ"]
    ];

    for (let i = 0; i < orderItems.length; i++) {
        data.push([
            factories[i].value,
            orderItems[i].value,
            orderQuantities[i].value,
            orderUnits[i].value
        ]);
    }

    // สร้างชีท Excel
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order Data");

    // ดาวน์โหลดไฟล์ Excel
    XLSX.writeFile(wb, downloadFileName);
}

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const sendEmailCreateOrder = async (email, orderItems) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    // Attach images as buffers
    const attachments = orderItems.map((order, index) => ({
        filename: `${order.name}-${index}.jpg`, // You can customize the file name here
        content: order.image.split('base64,')[1], // Extract base64 data
        encoding: 'base64',
        cid: `product-image-${index}` // Unique CID for each image
    }));

    // Generate HTML content for order items
    let listItem = '';
    orderItems.forEach((order, index) => {
        listItem += `
            <div style="border-bottom: 1px solid #ddd; padding: 10px;">
                <p><b>Sản phẩm:</b> ${order.name}</p>
                <p><b>Số lượng:</b> ${order.amount}</p>
                <p><b>Giá:</b> ${order.price.toLocaleString()} VNĐ</p>
                <p><b>Hình ảnh:</b><br/>
                    <img src="cid:product-image-${index}" alt="Product Image" style="max-width: 200px; height: auto;" />
                </p>
            </div>
        `;
    });

    // Compose the email content
    let info = await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT,
        to: email,
        subject: "[YagiShop] - Thông tin đơn hàng",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #4CAF50;">YagiShop - Xác nhận đơn hàng của bạn</h2>
                <p>Xin chào,</p>
                <p>Cảm ơn bạn đã đặt hàng tại <b>YagiShop</b>. Dưới đây là thông tin chi tiết về đơn hàng của bạn:</p>
                ${listItem}
                <p>Chúng tôi sẽ xử lý đơn hàng và thông báo khi hàng được giao.</p>
                <p>Trân trọng,<br/>YagiShop</p>
            </div>
        `,
        attachments: attachments
    });

    console.log("Email sent: %s", info.messageId);
};

module.exports = {
    sendEmailCreateOrder
};

// Sample chat history shown to signed-in users in the demo (titles from the Figma "Trợ lý DeepEdu" frame).
// Static content only — no AI model is involved.

export const DEMO_CONVERSATIONS = [
  {
    id: 'demo-1',
    title: 'Ma trận đề kiểm tra cuối kì I',
    messages: [
      { role: 'user', text: 'Lập giúp tôi ma trận đề kiểm tra cuối kì I môn Toán lớp 7, thời gian 90 phút.' },
      {
        role: 'assistant',
        text:
          'Ma trận đề kiểm tra cuối kì I – Toán 7 (90 phút, thang điểm 10):\n\n' +
          '• Số hữu tỉ: Nhận biết 1,0đ · Thông hiểu 1,0đ · Vận dụng 1,0đ\n' +
          '• Số thực: Nhận biết 0,5đ · Thông hiểu 1,0đ\n' +
          '• Góc và đường thẳng song song: Nhận biết 0,5đ · Thông hiểu 1,0đ · Vận dụng 1,0đ\n' +
          '• Tam giác bằng nhau: Thông hiểu 1,0đ · Vận dụng 1,0đ · Vận dụng cao 1,0đ\n\n' +
          'Tỉ lệ: Nhận biết 20% – Thông hiểu 40% – Vận dụng 30% – Vận dụng cao 10%.',
      },
    ],
  },
  {
    id: 'demo-2',
    title: 'Giáo án Bài 1 môn Toán lớp 7',
    messages: [
      { role: 'user', text: 'Soạn giáo án Bài 1: Tập hợp các số hữu tỉ – Toán 7, theo Công văn 5512.' },
      {
        role: 'assistant',
        text:
          'Giáo án Bài 1 – Tập hợp các số hữu tỉ (2 tiết)\n\n' +
          'I. Mục tiêu: nhận biết số hữu tỉ, biểu diễn số hữu tỉ trên trục số, so sánh hai số hữu tỉ.\n' +
          'II. Thiết bị: thước thẳng, phiếu học tập, máy chiếu.\n' +
          'III. Tiến trình:\n' +
          '1. Mở đầu (5 phút): tình huống nhiệt độ âm/dương.\n' +
          '2. Hình thành kiến thức (20 phút): khái niệm, trục số.\n' +
          '3. Luyện tập (15 phút): bài 1.1 – 1.4 SGK.\n' +
          '4. Vận dụng (5 phút): so sánh giá cổ phiếu tăng/giảm.',
      },
    ],
  },
  {
    id: 'demo-3',
    title: 'Bài kiểm tra cuối kì I',
    messages: [
      { role: 'user', text: 'Tạo đề kiểm tra cuối kì I gồm 12 câu trắc nghiệm và 3 câu tự luận dựa trên ma trận trên.' },
      {
        role: 'assistant',
        text:
          'Phần I – Trắc nghiệm (3 điểm)\n' +
          'Câu 1. Số nào sau đây là số hữu tỉ âm? A. 0,5  B. −3/4  C. 0  D. 2\n' +
          'Câu 2. Kết quả của (−2/3) + 1/3 là: A. −1/3  B. 1/3  C. −1  D. 1\n' +
          '…\n\n' +
          'Phần II – Tự luận (7 điểm)\n' +
          'Bài 1 (2đ). Thực hiện phép tính hợp lí.\n' +
          'Bài 2 (2đ). Tìm x biết |x − 1/2| = 3/4.\n' +
          'Bài 3 (3đ). Cho tam giác ABC cân tại A…',
      },
    ],
  },
  {
    id: 'demo-4',
    title: 'Kiểm tra nhanh',
    messages: [
      { role: 'user', text: 'Cho tôi 5 câu hỏi kiểm tra nhanh 10 phút đầu giờ về số thực.' },
      {
        role: 'assistant',
        text:
          '1. Số √2 là số hữu tỉ hay vô tỉ?\n' +
          '2. Làm tròn 3,14159 đến hàng phần trăm.\n' +
          '3. So sánh −√5 và −2,3.\n' +
          '4. Giá trị tuyệt đối của −7,5 là bao nhiêu?\n' +
          '5. Sắp xếp theo thứ tự tăng dần: 1,4; √2; 1,41.',
      },
    ],
  },
  {
    id: 'demo-5',
    title: 'Thay đổi giáo án phần bài tập về lý thuyết',
    messages: [
      { role: 'user', text: 'Thay phần bài tập trong giáo án Bài 1 bằng các câu hỏi lý thuyết ngắn.' },
      {
        role: 'assistant',
        text:
          'Phần luyện tập (đã cập nhật):\n' +
          '• Số hữu tỉ là gì? Lấy 2 ví dụ.\n' +
          '• Mọi số nguyên có phải là số hữu tỉ không? Vì sao?\n' +
          '• Trên trục số, số hữu tỉ âm nằm ở phía nào của điểm 0?\n' +
          '• Hai số hữu tỉ bằng nhau khi nào?',
      },
    ],
  },
];

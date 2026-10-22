// Sample chat history shown to signed-in users in the demo (titles from the Figma "Trợ lý DeepEdu" frames).
// Static content only — no AI model is involved.

export const DEMO_CONVERSATIONS = [
  {
    id: 'demo-1',
    title: 'Ôn tập định lý Pythago',
    messages: [
      { role: 'user', text: 'Giải thích giúp mình định lý Pythago và cho một ví dụ dễ hiểu.' },
      {
        role: 'assistant',
        text:
          'Định lý Pythago: trong tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông: a² + b² = c².\n\n' +
          'Ví dụ: một chiếc thang dài 5 m dựa vào tường, chân thang cách tường 3 m. Đỉnh thang cao bao nhiêu?\n' +
          '→ h² = 5² − 3² = 25 − 9 = 16 → h = 4 m.\n\n' +
          'Mẹo nhớ: bộ ba (3, 4, 5), (5, 12, 13), (8, 15, 17) là các tam giác vuông “đẹp” hay gặp trong đề thi.',
      },
    ],
  },
  {
    id: 'demo-2',
    title: 'Tóm tắt chương 3 Kinh tế vi mô',
    messages: [
      { role: 'user', text: 'Tóm tắt chương 3 Kinh tế vi mô: Lý thuyết hành vi người tiêu dùng.' },
      {
        role: 'assistant',
        text:
          'Chương 3 – Lý thuyết hành vi người tiêu dùng:\n\n' +
          '• Lợi ích (utility) và quy luật lợi ích cận biên giảm dần.\n' +
          '• Đường bàng quan: các tổ hợp hàng hoá mang lại cùng mức thoả mãn.\n' +
          '• Đường ngân sách: giới hạn tiêu dùng theo thu nhập và giá.\n' +
          '• Lựa chọn tối ưu: tiếp điểm giữa đường bàng quan và đường ngân sách (MRS = Px/Py).\n' +
          '• Hiệu ứng thay thế và hiệu ứng thu nhập khi giá thay đổi.',
      },
    ],
  },
  {
    id: 'demo-3',
    title: 'Kế hoạch ôn thi IELTS 6.5',
    messages: [
      { role: 'user', text: 'Lập kế hoạch ôn thi IELTS 6.5 trong 8 tuần, mỗi ngày 2 tiếng.' },
      {
        role: 'assistant',
        text:
          'Tuần 1–2: Làm đề chẩn đoán, ôn ngữ pháp nền và 20 từ vựng/ngày theo chủ đề.\n' +
          'Tuần 3–4: Listening Section 1–3, Reading True/False/Not Given, Writing Task 1.\n' +
          'Tuần 5–6: Writing Task 2 (2 bài/tuần), Speaking Part 2 ghi âm tự chấm.\n' +
          'Tuần 7–8: Làm 4 đề full test có bấm giờ, chữa lỗi và luyện phần yếu nhất.',
      },
    ],
  },
  {
    id: 'demo-4',
    title: 'Giải thích quá trình quang hợp',
    messages: [
      { role: 'user', text: 'Giải thích quá trình quang hợp ngắn gọn để ôn thi Sinh học 11.' },
      {
        role: 'assistant',
        text:
          'Quang hợp: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (nhờ ánh sáng và diệp lục).\n\n' +
          '1. Pha sáng (màng thylakoid): hấp thụ ánh sáng, quang phân li nước, tạo ATP, NADPH và giải phóng O₂.\n' +
          '2. Pha tối – chu trình Calvin (chất nền lục lạp): dùng ATP, NADPH để cố định CO₂ thành đường.',
      },
    ],
  },
  {
    id: 'demo-5',
    title: 'Viết email xin thực tập',
    messages: [
      { role: 'user', text: 'Viết giúp mình email xin thực tập vị trí Data Analyst.' },
      {
        role: 'assistant',
        text:
          'Tiêu đề: Ứng tuyển Thực tập sinh Data Analyst – Nguyễn Văn Minh\n\n' +
          'Kính gửi Anh/Chị phụ trách tuyển dụng,\n\n' +
          'Em là Nguyễn Văn Minh, sinh viên năm 3 Đại học Bách khoa Hà Nội. Em rất mong được thực tập vị trí Data Analyst tại Quý công ty. ' +
          'Em thành thạo SQL, Python (pandas) và đã thực hiện dự án phân tích dữ liệu bán hàng…\n\n' +
          'Em xin gửi kèm CV và rất mong nhận được phản hồi từ Anh/Chị.\n\nTrân trọng,\nNguyễn Văn Minh',
      },
    ],
  },
];

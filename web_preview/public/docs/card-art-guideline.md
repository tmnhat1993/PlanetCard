# Card Artwork Guideline

Version 1.0 — Plant / Stone production pack

## 1. Mục tiêu

Artwork phải giúp người chơi đoán được công dụng của lá bài trước khi đọc mô tả. Mỗi hình là một biểu tượng hành động có chiều sâu, không phải một poster điện ảnh. Khung, tên, sao, icon thuộc tính và laminate do Card Builder/Godot phủ lên; tuyệt đối không bake chúng vào artwork.

## 2. Quy cách file

- Tỷ lệ dọc `2:3`; source tối thiểu 1024 × 1536 px, bản runtime có thể resize theo budget.
- Artwork-only; không text, chữ số, card frame, UI, logo hoặc watermark.
- Giữ 8% mép ngoài làm crop-safe area. Chủ thể nằm trong khoảng 55–68% khung hình.
- Một focal point chính, silhouette đọc được khi thumbnail chỉ rộng 96–120 px.
- Nền tối, tương phản tập trung vào tác động chính. Không để nebula hoặc particle cạnh tranh với chủ thể.
- Tên file: `{system}_{ability_slug}_v{NN}.png`, ví dụ `plant_briar_cascade_v01.png`.
- Laminate luôn là layer runtime. Không vẽ ánh holographic chéo toàn ảnh.

## 3. Thang độ phức tạp theo sao

| Sao | Art tier | Ngôn ngữ hình ảnh | Gameplay phù hợp |
|---|---|---|---|
| 1★ | Basic | 1 biểu tượng chính + 1 accent, chiều sâu phẳng, ít particle | Một outcome cơ bản |
| 2★ | Basic+ | 2–3 hình khối, một chuyển động ngắn, glow nhẹ | Outcome mạnh hơn hoặc một điều kiện đơn giản |
| 3★ | Advanced | 3–4 hình khối, nhiều lớp, một action arc rõ, glow vừa | Hai hiệu ứng có quan hệ trực tiếp hoặc sustain |
| 4★ | Rare | 4–6 hình khối, cosmic depth rõ hơn, nhiều mục tiêu hoặc phản ứng | AoE, counter, trigger, summon, hiệu ứng đa lượt |
| 5★ | Legendary | Signature composition, ánh sáng đặc trưng, nhịp lớn nhất set | Luật chơi đặc biệt hoặc build-around; vẫn phải đọc rõ ở thumbnail |

Không tăng độ hiếm chỉ bằng cách thêm particle. Độ hiếm phải thể hiện bằng số lớp thông tin, tương tác hình khối và mức biến đổi trạng thái.

## 4. Ngôn ngữ hệ Plant

- Palette chính: emerald, lime, violet; ruby dùng cho hút máu/đổi máu; gold dùng cho năng lượng.
- Shape language: lá cong, mầm, gai, vòng sinh trưởng, mạng nấm, rễ ôm hoặc kết nối.
- Damage: gai hoặc hạt lao ra ngoài.
- Heal: hình khối khép kín, lá non mở ra, dòng nhựa quay về tâm.
- Defend: tán lá/rễ tạo vòm bao quanh lõi.
- Energy: lá hoặc hoa hướng về nguồn sáng vàng.
- Poison: bào tử tím/xanh phát tán từ một tâm rõ ràng.
- Passive/trigger: mạng kết nối hoặc vòng lặp; tránh minh họa một cú đánh tức thời.

## 5. Ngôn ngữ hệ Stone

- Palette chính: basalt, iron, charcoal; amber cho lực/nhiệt; cyan cho lõi và trạng thái được bảo vệ.
- Shape language: phiến góc cạnh, monolith, tinh thể, vòng địa tầng, búa/đe trừu tượng.
- Damage: khối nặng có hướng rơi/va chạm rõ.
- Fracture: vết nứt bắt đầu chính xác tại điểm tác động.
- Defend: phiến đá khóa vào nhau hoặc nhiều vòng bao tâm.
- Energy: lõi địa nhiệt dẫn amber vào cell cyan.
- Counter/reflect: một vector đi vào khiên và một vector bật ra.
- Passive/damage cap: monolith đứng yên, vòng bảo vệ chặn mũi tác động ở lớp ngoài.
- Stone không dùng lá, dây leo hoặc biểu tượng hồi Hull.

## 6. Công thức prompt chuẩn

```text
Create one original reusable card artwork asset.
Use case: stylized concept art for a digital card game art library.
Format: portrait 2:3 composition, artwork only, no card frame.
Style: polished 16-bit pixel art, crisp deliberate clusters, readable at thumbnail size.
Theme: cosmic {SYSTEM}; palette {SYSTEM_PALETTE}; deep navy/charcoal starfield.
Complexity tier: {BASIC|ADVANCED|RARE|LEGENDARY}. Use {SHAPE_COUNT} main shapes,
one unmistakable focal action, crop-safe margin, controlled glow.
Ability symbol: {ONE_SENTENCE_ACTION_DESCRIPTION}.
Do not include text, letters, numbers, card borders, UI, logos, watermark,
spacecraft, vehicles, humans, characters, photorealism, or a full environment scene.
```

Viết ability sentence theo công thức: **chủ thể + động từ + mục tiêu + ý nghĩa gameplay**. Ví dụ: “three basalt slabs strike a cyan core in sequence, communicating multi-hit damage and fracture.”

## 7. Metadata cho Art Library

Mỗi asset cần có:

- `id`, `name`, `system`, `tier`, `suggestedStars`, `path`.
- 2–4 tags mô tả gameplay, ví dụ `damage`, `area`, `heal-trigger`, `summon`.
- Một summary ngắn nói hình phù hợp với loại ability nào; không khóa cứng vào một card duy nhất.
- Tăng version khi silhouette, palette hoặc composition đổi. Chỉnh compression mà không đổi hình không cần tăng version.

## 8. Workflow sản xuất

1. Viết mechanic và chọn một động từ thị giác duy nhất: strike, lock, orbit, absorb, reflect, grow, cleanse.
2. Chọn tier dựa trên sao; lập danh sách số hình khối tối đa trước khi prompt.
3. Generate bản portrait artwork-only. Không yêu cầu AI tạo frame hay chữ.
4. Kiểm tra ở kích thước thumbnail 120 px trước khi xem full size.
5. Kiểm tra palette/system và crop-safe area; loại ảnh có silhouette mơ hồ.
6. Đặt tên/version, thêm metadata và tags vào `artLibrary.ts`.
7. Dùng `USE IN BUILDER` để kiểm tra với khung, tên, sao, attribute icons và laminate thật.
8. Export card record/art; trong Godot dùng cùng 2:3 crop, `KEEP_ASPECT_COVERED`, laminate là shader/overlay riêng.

## 9. Checklist duyệt

- [ ] Có hiểu hành động khi chỉ nhìn 1 giây ở thumbnail?
- [ ] Có đúng hệ mà không cần đọc nhãn?
- [ ] Mức chi tiết có đúng số sao?
- [ ] Chỉ có một focal action chính?
- [ ] Không có text giả, frame, UI hoặc laminate bake-in?
- [ ] Chủ thể không chạm 8% safe margin?
- [ ] Khi phủ icon bridge và tên, vùng quan trọng vẫn không bị che?
- [ ] Hình còn đọc được trên nền card Action/Magic/Passive?

## 10. Cấu trúc pack hiện tại

```text
assets/cards/art_library/
├── plant/
│   ├── basic/       8
│   ├── advanced/    8
│   └── rare/        8
└── stone/
    ├── basic/       8
    ├── advanced/    8
    └── rare/        8
```

Tổng cộng 48 artwork. Mỗi set 3★ và 4★ dùng 7 hình; hình thứ 8 của mỗi tier là material dự phòng để tạo card mới mà vẫn cùng ngôn ngữ hình ảnh.
